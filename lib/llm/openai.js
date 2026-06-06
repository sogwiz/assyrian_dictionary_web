// OpenAI provider for the translation LLM.
// Pricing defaults reflect mid-2026 list prices; override via env as needed.

const OpenAI = require('openai');

const PRICING = {
  // GPT-5 family (current)
  'gpt-5': { in: 1.25, out: 10.00 },
  'gpt-5-mini': { in: 0.25, out: 2.00 },
  // GPT-4o family (legacy, included for benchmarking)
  'gpt-4o': { in: 2.50, out: 10.00 },
  'gpt-4o-mini': { in: 0.15, out: 0.60 },
  '_default': { in: 2.50, out: 10.00 }
};

function pricesFor(model) {
  const envIn = process.env.OPENAI_INPUT_PRICE_PER_M;
  const envOut = process.env.OPENAI_OUTPUT_PRICE_PER_M;
  const defaults = PRICING[model] || PRICING._default;
  return {
    inPerM: envIn ? parseFloat(envIn) : defaults.in,
    outPerM: envOut ? parseFloat(envOut) : defaults.out
  };
}

function create(modelOverride) {
  const model = modelOverride || process.env.LLM_MODEL || 'gpt-5-mini';
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prices = pricesFor(model);

  return {
    name: 'openai',
    model: model,

    generate: function(opts) {
      return client.chat.completions.create({
        model: model,
        temperature: opts.temperature,
        // response_format JSON mode would be ideal, but the prompt already asks
        // for raw JSON and Gemini/Anthropic don't get that flag — keep parity.
        messages: [{ role: 'user', content: opts.prompt }]
      }).then(function(response) {
        const text = (response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content) || '';
        const usage = response.usage || {};
        const inTok = usage.prompt_tokens || 0;
        const outTok = usage.completion_tokens || 0;
        // Reasoning tokens (o-series / GPT-5 thinking) are inside completion_tokens_details.
        const details = usage.completion_tokens_details || {};
        const reasoningTok = details.reasoning_tokens || 0;
        const inUsd = inTok / 1e6 * prices.inPerM;
        const outUsd = outTok / 1e6 * prices.outPerM;
        return {
          text: text,
          usage: {
            promptTokens: inTok,
            outputTokens: outTok,
            thoughtTokens: reasoningTok,
            totalTokens: usage.total_tokens || (inTok + outTok)
          },
          cost: { inUsd: inUsd, outUsd: outUsd, totalUsd: inUsd + outUsd }
        };
      });
    }
  };
}

module.exports = { create: create };
