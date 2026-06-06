// chrF — character n-gram F-score, the recommended automatic metric for
// low-resource, morphologically rich languages like Assyrian/Sureth where
// word-level BLEU is too brittle. Classic chrF: n-grams 1..6, beta=2 (recall
// weighted 2x). Returns a score in [0, 1].
//
// Reference: Popović, "chrF: character n-gram F-score for automatic MT evaluation" (2015).

function avg(arr) {
  if (arr.length === 0) return 0;
  var sum = 0;
  for (var i = 0; i < arr.length; i++) sum += arr[i];
  return sum / arr.length;
}

function charNgrams(str, n) {
  var grams = {};
  for (var i = 0; i + n <= str.length; i++) {
    var g = str.substr(i, n);
    grams[g] = (grams[g] || 0) + 1;
  }
  return grams;
}

// NFC-normalize and strip whitespace so Syriac combining diacritics compare
// consistently and spacing differences don't dominate the score.
function normalize(s) {
  return (s || '').normalize('NFC').replace(/\s+/g, '');
}

function chrf(hypothesis, reference, maxN, beta) {
  maxN = maxN || 6;
  beta = beta || 2;

  var hyp = normalize(hypothesis);
  var ref = normalize(reference);

  if (!hyp && !ref) return 1;
  if (!hyp || !ref) return 0;

  var precisions = [];
  var recalls = [];

  for (var n = 1; n <= maxN; n++) {
    if (hyp.length < n || ref.length < n) continue;

    var h = charNgrams(hyp, n);
    var r = charNgrams(ref, n);

    var overlap = 0;
    var hTotal = 0;
    var rTotal = 0;
    var g;

    for (g in h) {
      hTotal += h[g];
      if (r[g]) overlap += Math.min(h[g], r[g]);
    }
    for (g in r) {
      rTotal += r[g];
    }

    if (hTotal > 0) precisions.push(overlap / hTotal);
    if (rTotal > 0) recalls.push(overlap / rTotal);
  }

  var avgP = avg(precisions);
  var avgR = avg(recalls);
  if (avgP + avgR === 0) return 0;

  var beta2 = beta * beta;
  return (1 + beta2) * avgP * avgR / (beta2 * avgP + avgR);
}

// Best chrF against any of several acceptable references — translation has
// multiple valid answers, so we credit the closest one.
function chrfBest(hypothesis, references) {
  var best = 0;
  for (var i = 0; i < references.length; i++) {
    var s = chrf(hypothesis, references[i]);
    if (s > best) best = s;
  }
  return best;
}

module.exports = { chrf: chrf, chrfBest: chrfBest, normalize: normalize };
