// Factory for the configured LLM provider. Pick via LLM_PROVIDER env var
// (gemini | anthropic | openai). Set LLM_MODEL to override the model id;
// each provider has its own sensible default if you don't.

function create(opts) {
  opts = opts || {};
  const providerName = opts.provider || process.env.LLM_PROVIDER || 'gemini';
  switch (providerName) {
    case 'gemini':    return require('./gemini').create(opts.model);
    case 'anthropic': return require('./anthropic').create(opts.model);
    case 'openai':    return require('./openai').create(opts.model);
    default:
      throw new Error('Unknown LLM_PROVIDER: ' + providerName + ' (expected gemini|anthropic|openai)');
  }
}

module.exports = { create: create };
