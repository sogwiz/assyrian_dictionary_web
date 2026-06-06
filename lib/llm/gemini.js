// Gemini provider for the translation LLM. Wraps @google/generative-ai so the
// rest of the app can call providers behind a single { generate(...) } shape.

const { GoogleGenerativeAI } = require('@google/generative-ai');

const INPUT_PRICE_PER_M = parseFloat(process.env.GEMINI_INPUT_PRICE_PER_M || '0.30');
const OUTPUT_PRICE_PER_M = parseFloat(process.env.GEMINI_OUTPUT_PRICE_PER_M || '2.50');

function create(modelOverride) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = modelOverride || process.env.LLM_MODEL || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const client = new GoogleGenerativeAI(apiKey);
  const generativeModel = client.getGenerativeModel({ model: model });

  return {
    name: 'gemini',
    model: model,

    generate: function(opts) {
      const request = {
        contents: [{ role: 'user', parts: [{ text: opts.prompt }] }],
        generationConfig: { temperature: opts.temperature }
      };
      return generativeModel.generateContent(request).then(function(llmResponse) {
        const text = llmResponse.response.text();
        const usage = (llmResponse.response && llmResponse.response.usageMetadata) || {};
        const inTok = usage.promptTokenCount || 0;
        const outTok = usage.candidatesTokenCount || 0;
        // Gemini 2.5 thinking models emit "thoughts" tokens billed at output
        // rate but reported separately. Fall back to (total - prompt - output)
        // if thoughtsTokenCount isn't present.
        let thoughtTok = usage.thoughtsTokenCount || 0;
        if (!thoughtTok && usage.totalTokenCount) {
          thoughtTok = Math.max(0, usage.totalTokenCount - inTok - outTok);
        }
        const inUsd = inTok / 1e6 * INPUT_PRICE_PER_M;
        const outUsd = (outTok + thoughtTok) / 1e6 * OUTPUT_PRICE_PER_M;
        return {
          text: text,
          usage: {
            promptTokens: inTok,
            outputTokens: outTok,
            thoughtTokens: thoughtTok,
            totalTokens: usage.totalTokenCount || (inTok + outTok + thoughtTok)
          },
          cost: { inUsd: inUsd, outUsd: outUsd, totalUsd: inUsd + outUsd }
        };
      });
    }
  };
}

module.exports = { create: create };
