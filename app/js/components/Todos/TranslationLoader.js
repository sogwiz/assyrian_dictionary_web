import React from 'react'

// Whimsical-but-on-theme status messages that cycle while the LLM works.
// Order is shuffled once per mount so repeat searches feel fresh.
const STATUS_MESSAGES = [
  'Consulting the lexicon',
  'Parsing your words',
  'Conjugating verbs',
  'Weighing gender forms',
  'Transliterating the script',
  'Tuning the phonetics',
  'Cross-referencing roots',
  'Consulting ancient scribes',
  'Aligning East & West dialects',
  'Untangling the grammar',
  'Polishing the translation',
  'Almost there'
];

function shuffle(arr) {
  const copy = arr.slice();
  for (var i = copy.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

class TranslationLoader extends React.Component {
  constructor(props) {
    super(props);
    this.messages = shuffle(STATUS_MESSAGES);
    this.state = {
      messageIndex: 0,
      visible: true
    };
  }

  componentDidMount() {
    // Cycle the status message every 2s with a brief fade so it reads as motion.
    this.cycleTimer = setInterval(() => {
      this.setState({ visible: false });
      this.fadeTimer = setTimeout(() => {
        this.setState((prev) => ({
          messageIndex: (prev.messageIndex + 1) % this.messages.length,
          visible: true
        }));
      }, 280);
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.cycleTimer);
    clearTimeout(this.fadeTimer);
  }

  render() {
    const message = this.messages[this.state.messageIndex];
    const phraseLabel = this.props.text ? '"' + this.props.text + '"' : 'your phrase';

    return (
      <div className='translation-loader' role='status' aria-live='polite'>
        <div className='translation-loader-orb'>
          <span className='orb-ring'></span>
          <span className='orb-ring orb-ring-2'></span>
          <span className='orb-core'>ܐ</span>
        </div>
        <div className='translation-loader-text'>
          <div className='translation-loader-heading'>
            Translating {phraseLabel}
          </div>
          <div className={'translation-loader-status' + (this.state.visible ? ' is-visible' : '')}>
            {message}
            <span className='loader-dots'>
              <span className='loader-dot'>.</span>
              <span className='loader-dot'>.</span>
              <span className='loader-dot'>.</span>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default TranslationLoader
