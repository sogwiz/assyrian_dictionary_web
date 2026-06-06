import React from 'react'
import ReactGA from 'react-ga'
import TranslationCard from './TranslationCard'
import WordBreakdown from './WordBreakdown'

// Renders the LLM translation versions plus per-word dictionary breakdowns, and
// lets the user request additional alternatives ("Show another translation").
// Prior versions stay visible while a new one is generated and after it arrives.
// Expects a `result` prop: { text, translations: [...], wordResults: [...], error? }
class TranslationResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      variants: (props.result && props.result.translations) || [],
      isRegenerating: false,
      regenError: null
    };
    this.regenerate = this.regenerate.bind(this);
  }

  // If a brand-new search comes in, reset the accumulated variants. Also
  // handle the parallel-fetch case where this component first mounts with a
  // placeholder result (phrase match arrived, LLM still in flight) and then
  // gets the real LLM translations on the next props update.
  componentWillReceiveProps(nextProps) {
    const prev = this.props.result || {};
    const next = nextProps.result || {};
    const nextTranslations = next.translations || [];
    if (next.text !== prev.text) {
      this.setState({
        variants: nextTranslations,
        isRegenerating: false,
        regenError: null
      });
    } else if (this.state.variants.length === 0 && nextTranslations.length > 0) {
      this.setState({ variants: nextTranslations });
    }
  }

  // Collect every form already shown so the backend can avoid repeating them.
  collectExclusions() {
    const seen = [];
    this.state.variants.forEach((t) => {
      ['default', 'masculine', 'feminine'].forEach((k) => {
        if (t[k] && t[k].east && seen.indexOf(t[k].east) === -1) {
          seen.push(t[k].east);
        }
      });
    });
    return seen;
  }

  regenerate() {
    if (this.state.isRegenerating) return;
    const result = this.props.result || {};
    const text = result.text;
    if (!text) return;

    this.setState({ isRegenerating: true, regenError: null });

    ReactGA.event({
      category: 'Translation',
      action: 'regenerate',
      label: text,
      value: this.state.variants.length // how many versions the user already had
    });

    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text, variant: true, exclude: this.collectExclusions() })
    })
      .then((response) => response.json())
      .then((data) => {
        const fresh = (data && data.translations) || [];
        if (fresh.length === 0) {
          this.setState({ isRegenerating: false, regenError: 'No alternative could be generated. Try again.' });
          return;
        }
        this.setState((prev) => ({
          variants: prev.variants.concat(fresh),
          isRegenerating: false
        }));
      })
      .catch(() => {
        this.setState({ isRegenerating: false, regenError: 'Alternative unavailable. Try again.' });
      });
  }


  renderPhraseMatch(phraseMatch, eastfont) {
    if (!phraseMatch || !phraseMatch.length) return null;
    // Hand-curated dictionary entries for full phrases (e.g. "water under the
    // bridge"). Shown above the LLM block as the authoritative answer.
    return (
      <div className='phrase-match'>
        <div className='phrase-match-header'>
          <span className='phrase-match-badge'>✓ Dictionary match</span>
          <span className='phrase-match-subtitle'>Curated translation</span>
        </div>
        <ul className='phrase-match-list'>
          {phraseMatch.slice(0, 3).map((item, i) => {
            const def = (item && item.definition) || {};
            return (
              <li className='phrase-match-item' key={i}>
                <div className={'phrase-match-east ' + eastfont}>{def.east}</div>
                {def.phonetic && <div className='phrase-match-phonetic'>{def.phonetic}</div>}
                {def.english_short && <div className='phrase-match-gloss'>{def.english_short}</div>}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  render() {
    const result = this.props.result || {};
    const eastfont = this.props.eastfont || 'east';
    const wordResults = result.wordResults || [];
    const variants = this.state.variants;
    const multiple = variants.length > 1;
    const phraseMatch = this.props.phraseMatch;
    const isLlmLoading = this.props.isLlmLoading;

    return (
      <div className='translation-result'>
        <div className='translation-result-query'>{result.text}</div>

        {this.renderPhraseMatch(phraseMatch, eastfont)}

        {result.error && (
          <div className='translation-error'>
            Translation unavailable &mdash; showing individual word results below.
          </div>
        )}

        {variants.map((t, i) => (
          <TranslationCard
            key={i}
            translation={t}
            eastfont={eastfont}
            versionLabel={multiple ? 'Version ' + (i + 1) : null}
          />
        ))}

        {/* Inline LLM loader: shown when the phrase match arrived first and
            we're still waiting on the LLM, or when regenerating an alternative. */}
        {isLlmLoading && variants.length === 0 && (
          <div className='translation-regen-loader'>
            <span className='regen-spinner'></span>
            <span className='regen-text'>Also generating an AI translation&hellip;</span>
          </div>
        )}

        {this.state.isRegenerating && (
          <div className='translation-regen-loader'>
            <span className='regen-spinner'></span>
            <span className='regen-text'>Generating another translation&hellip;</span>
          </div>
        )}

        {this.state.regenError && (
          <div className='translation-error'>{this.state.regenError}</div>
        )}

        {variants.length > 0 && (
          <button
            className='translation-regen-btn'
            onClick={this.regenerate}
            disabled={this.state.isRegenerating}
          >
            {this.state.isRegenerating ? 'Working…' : '↻ Show another translation'}
          </button>
        )}

        <WordBreakdown wordResults={wordResults} eastfont={eastfont} />
      </div>
    );
  }
}

export default TranslationResult
