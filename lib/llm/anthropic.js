// Anthropic (Claude) provider for the translation LLM.
// Pricing defaults reflect mid-2026 list prices; override via env as needed.

const Anthropic = require('@anthropic-ai/sdk');

// Per-model defaults so swapping LLM_MODEL doesn't silently use wrong prices.
const PRICING = {
  // Claude Haiku 4.5
  'claude-haiku-4-5-20251001': { in: 1.00, out: 5.00 },
  // Claude Sonnet 4.6
  'claude-sonnet-4-6': { in: 3.00, out: 15.00 },
  // Older Sonnet 3.5 for benchmarking
  'claude-3-5-sonnet-20241022': { in: 3.00, out: 15.00 },
  // Fallback if model name unknown
  '_default': { in: 3.00, out: 15.00 }
};

function pricesFor(model) {
  const envIn = process.env.ANTHROPIC_INPUT_PRICE_PER_M;
  const envOut = process.env.ANTHROPIC_OUTPUT_PRICE_PER_M;
  const defaults = PRICING[model] || PRICING._default;
  return {
    inPerM: envIn ? parseFloat(envIn) : defaults.in,
    outPerM: envOut ? parseFloat(envOut) : defaults.out
  };
}

function create(modelOverride) {
  const model = modelOverride || process.env.LLM_MODEL || 'claude-haiku-4-5-20251001';
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prices = pricesFor(model);

  return {
    name: 'anthropic',
    model: model,

    generate: function(opts) {
      return client.messages.create({
        model: model,
        max_tokens: 2048,
        temperature: opts.temperature,
        messages: [{ role: 'user', content: opts.prompt }]
      }).then(function(response) {
        // Concatenate any text blocks the model returned.
        const text = (response.content || [])
          .filter(function(b) { return b.type === 'text'; })
          .map(function(b) { return b.text; })
          .join('');
        const usage = response.usage || {};
        const inTok = usage.input_tokens || 0;
        const outTok = usage.output_tokens || 0;
        const inUsd = inTok / 1e6 * prices.inPerM;
        const outUsd = outTok / 1e6 * prices.outPerM;
        return {
          text: text,
          usage: {
            promptTokens: inTok,
            outputTokens: outTok,
            thoughtTokens: 0,
            totalTokens: inTok + outTok
          },
          cost: { inUsd: inUsd, outUsd: outUsd, totalUsd: inUsd + outUsd }
        };
      });
    }
  };
}

module.exports = { create: create };
