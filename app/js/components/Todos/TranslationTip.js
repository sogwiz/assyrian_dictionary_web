import React from 'react'
import ReactGA from 'react-ga'

// Shown on dictionary results for terms like "translate"/"translator" — users
// who search those are signaling intent to translate a phrase, so we surface
// the new full-sentence translation feature with a one-click example.
const EXAMPLE = 'I want to drink water';

class TranslationTip extends React.Component {
  constructor(props) {
    super(props);
    this.handleTry = this.handleTry.bind(this);
  }

  componentDidMount() {
    // Impression: lets us measure how often the tip is seen vs. acted on.
    ReactGA.event({ category: 'Translation', action: 'tip_shown', label: this.props.searchTerm || '' });
  }

  handleTry() {
    ReactGA.event({ category: 'Translation', action: 'tip_try_example', label: EXAMPLE });
    if (this.props.onTry) this.props.onTry(EXAMPLE);
  }

  render() {
    return (
      <div className='translation-tip'>
        <span className='translation-tip-icon'>💬</span>
        <div className='translation-tip-body'>
          <div className='translation-tip-title'>Need to translate a whole phrase?</div>
          <div className='translation-tip-text'>
            Type a full sentence (4+ words) in the search box above and we&rsquo;ll translate it
            to Assyrian &mdash; with gender forms and pronunciation.
          </div>
          <button className='translation-tip-btn' onClick={this.handleTry}>
            Try: &ldquo;{EXAMPLE}&rdquo;
          </button>
        </div>
      </div>
    );
  }
}

export default TranslationTip
