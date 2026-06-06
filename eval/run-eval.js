#!/usr/bin/env node
//
// Eval harness for the multi-word translation endpoint.
//
// Runs every case in golden-set.json against POST /api/translate, scores the
// output with chrF + structural checks + must_contain, aggregates by stratum,
// and reports token usage / estimated cost. Optionally grades semantic adequacy
// with an LLM judge (--judge).
//
// Usage (run inside the web container so deps + GEMINI_API_KEY are present):
//   docker-compose -f docker-compose-dev.yaml exec web node eval/run-eval.js
//   docker-compose -f docker-compose-dev.yaml exec web node eval/run-eval.js --judge
//
// Env:
//   EVAL_BASE_URL   base URL of the running server (default http://localhost:3001)
//   GEMINI_API_KEY  required only for --judge

const fs = require('fs');
const path = require('path');
const { chrf, chrfBest } = require('./chrf');

const BASE_URL = process.env.EVAL_BASE_URL || 'http://localhost:3001';
const USE_JUDGE = process.argv.indexOf('--judge') !== -1;
const VALID_CONFIDENCE = { high: 1, medium: 1, low: 1 };

function loadGoldenSet() {
  var p = path.join(__dirname, 'golden-set.json');
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function translate(text) {
  return fetch(BASE_URL + '/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text })
  }).then(function(r) { return r.json(); });
}

// Structural validity: the response must be usable by the UI.
function structuralChecks(resp) {
  var issues = [];
  var t = (resp.translations && resp.translations[0]) || null;
  if (!t) { issues.push('no translations returned'); return { pass: false, issues: issues }; }
  if (!t.default || !t.default.east) issues.push('missing default.east');
  if (!t.masculine || !t.masculine.east) issues.push('missing masculine.east');
  if (!t.feminine || !t.feminine.east) issues.push('missing feminine.east');
  if (t.confidence && !VALID_CONFIDENCE[t.confidence]) issues.push('invalid confidence: ' + t.confidence);
  return { pass: issues.length === 0, issues: issues };
}

// All entries must appear in the default output (AND semantics). NFC-normalize
// both sides so Syriac combining diacritics in different Unicode forms still
// match; whitespace is preserved so multi-word entries stay meaningful.
function mustContainCheck(resp, mustContain) {
  if (!mustContain || mustContain.length === 0) return { pass: true, missing: [] };
  var rawEast = (resp.translations && resp.translations[0] && resp.translations[0].default && resp.translations[0].default.east) || '';
  var east = rawEast.normalize('NFC');
  var missing = mustContain.filter(function(s) { return east.indexOf(s.normalize('NFC')) === -1; });
  return { pass: missing.length === 0, missing: missing };
}

// chrF of the predicted default form against the expected default plus any
// acceptable alternatives (best match wins — multiple translations are valid).
function scoreCase(resp, gold) {
  var pred = (resp.translations && resp.translations[0]) || {};
  var refs = [];
  if (gold.expected && gold.expected.default && gold.expected.default.east) refs.push(gold.expected.default.east);
  (gold.acceptable_alternatives || []).forEach(function(a) { refs.push(a); });

  var chrfDefault = refs.length ? chrfBest((pred.default && pred.default.east) || '', refs) : null;

  var chrfMasc = null, chrfFem = null;
  if (gold.expected && gold.expected.masculine && gold.expected.masculine.east) {
    chrfMasc = chrf((pred.masculine && pred.masculine.east) || '', gold.expected.masculine.east);
  }
  if (gold.expected && gold.expected.feminine && gold.expected.feminine.east) {
    chrfFem = chrf((pred.feminine && pred.feminine.east) || '', gold.expected.feminine.east);
  }

  return { chrfDefault: chrfDefault, chrfMasc: chrfMasc, chrfFem: chrfFem };
}

function judge(input, expected, predicted) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  var genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  var model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash' });
  var prompt = 'You are grading an English-to-Assyrian (Sureth) translation. ' +
    'Rate the PREDICTED translation\'s adequacy and fluency versus the REFERENCE on a 1-5 scale ' +
    '(5 = fully correct and natural, 1 = wrong). Respond with raw JSON only: {"score": <1-5>, "reason": "<short>"}.\n\n' +
    'English: "' + input + '"\n' +
    'Reference: "' + expected + '"\n' +
    'Predicted: "' + predicted + '"';
  return model.generateContent(prompt).then(function(r) {
    try {
      var m = r.response.text().match(/\{[\s\S]*\}/);
      return JSON.parse(m ? m[0] : r.response.text());
    } catch (e) { return { score: null, reason: 'judge parse error' }; }
  });
}

function mean(arr) {
  var v = arr.filter(function(x) { return x !== null && x !== undefined; });
  if (!v.length) return null;
  return v.reduce(function(a, b) { return a + b; }, 0) / v.length;
}

function fmt(n) { return n === null || n === undefined ? '  —  ' : n.toFixed(3); }

async function main() {
  var golden = loadGoldenSet();
  var cases = golden.cases || [];
  console.log('Running eval: ' + cases.length + ' cases against ' + BASE_URL + (USE_JUDGE ? ' (+LLM judge)' : ''));
  console.log('');

  var results = [];
  var totals = { tokens: 0, cost: 0, latency: 0, calls: 0 };
  var unreviewed = 0;

  for (var i = 0; i < cases.length; i++) {
    var c = cases[i];
    if (!c.reviewed_by || c.reviewed_by === 'unreviewed') unreviewed++;
    var resp;
    try {
      resp = await translate(c.input);
    } catch (e) {
      results.push({ id: c.id, stratum: c.stratum, error: String(e) });
      console.log('✗ ' + c.id + '  REQUEST FAILED: ' + e);
      continue;
    }

    var struct = structuralChecks(resp);
    var mc = mustContainCheck(resp, c.must_contain);
    var scores = scoreCase(resp, c);

    if (resp.usage) {
      totals.tokens += resp.usage.totalTokens || 0;
      totals.cost += resp.usage.estCostUsd || 0;
      totals.calls += 1;
    }

    var row = {
      id: c.id,
      stratum: c.stratum || 'uncategorized',
      reviewed: !(!c.reviewed_by || c.reviewed_by === 'unreviewed'),
      structPass: struct.pass,
      structIssues: struct.issues,
      mustContainPass: mc.pass,
      chrfDefault: scores.chrfDefault,
      chrfMasc: scores.chrfMasc,
      chrfFem: scores.chrfFem,
      predicted: (resp.translations && resp.translations[0] && resp.translations[0].default && resp.translations[0].default.east) || '',
      usage: resp.usage || null
    };

    if (USE_JUDGE && resp.translations && resp.translations[0]) {
      var j = await judge(c.input,
        (c.expected && c.expected.default && c.expected.default.east) || '',
        row.predicted);
      row.judgeScore = j.score;
      row.judgeReason = j.reason;
    }

    results.push(row);

    var mark = struct.pass && mc.pass ? '✓' : '✗';
    console.log(mark + ' ' + c.id +
      '  chrF=' + fmt(scores.chrfDefault) +
      '  struct=' + (struct.pass ? 'ok' : 'FAIL[' + struct.issues.join(',') + ']') +
      (c.must_contain && c.must_contain.length ? '  must_contain=' + (mc.pass ? 'ok' : 'MISSING[' + mc.missing.join(',') + ']') : '') +
      (USE_JUDGE ? '  judge=' + (row.judgeScore || '—') + '/5' : ''));
  }

  // ---- Aggregate report ----
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));

  var byStratum = {};
  results.forEach(function(r) {
    if (r.error) return;
    var s = r.stratum;
    byStratum[s] = byStratum[s] || { chrf: [], struct: 0, n: 0, judge: [] };
    byStratum[s].chrf.push(r.chrfDefault);
    byStratum[s].struct += r.structPass ? 1 : 0;
    byStratum[s].n += 1;
    if (r.judgeScore != null) byStratum[s].judge.push(r.judgeScore);
  });

  console.log('\nStratum            n   chrF(default)  struct-pass  judge/5');
  console.log('-'.repeat(60));
  Object.keys(byStratum).sort().forEach(function(s) {
    var g = byStratum[s];
    var label = (s + '                  ').slice(0, 17);
    console.log(label + ' ' + String(g.n).padStart(3) + '   ' +
      fmt(mean(g.chrf)) + '         ' +
      (g.struct + '/' + g.n).padEnd(9) + '   ' +
      (g.judge.length ? mean(g.judge).toFixed(2) : '—'));
  });

  var allChrf = mean(results.map(function(r) { return r.chrfDefault; }));
  var structPassTotal = results.filter(function(r) { return r.structPass; }).length;
  var allJudge = mean(results.map(function(r) { return r.judgeScore; }));

  console.log('-'.repeat(60));
  console.log('OVERALL            ' + String(results.length).padStart(3) + '   ' +
    fmt(allChrf) + '         ' + (structPassTotal + '/' + results.length).padEnd(9) + '   ' +
    (allJudge != null ? allJudge.toFixed(2) : '—'));

  console.log('\nCost accounting (' + totals.calls + ' LLM calls):');
  console.log('  total tokens : ' + totals.tokens);
  console.log('  total cost   : $' + totals.cost.toFixed(4));
  console.log('  avg / call   : $' + (totals.calls ? (totals.cost / totals.calls).toFixed(5) : '0') +
    '  (' + (totals.calls ? Math.round(totals.tokens / totals.calls) : 0) + ' tokens)');

  if (unreviewed > 0) {
    console.log('\n⚠  ' + unreviewed + '/' + cases.length + ' cases are UNREVIEWED — scores against them are not ground truth yet.');
  }

  // ---- Persist results for trend tracking ----
  var outDir = path.join(__dirname, 'results');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  var stamp = new Date().toISOString().replace(/[:.]/g, '-');
  var outFile = path.join(outDir, 'eval-' + stamp + '.json');
  fs.writeFileSync(outFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    judged: USE_JUDGE,
    overall: { chrfDefault: allChrf, structPass: structPassTotal + '/' + results.length, judge: allJudge },
    cost: totals,
    results: results
  }, null, 2));
  console.log('\nWrote ' + outFile);
}

main().catch(function(e) { console.error(e); process.exit(1); });
