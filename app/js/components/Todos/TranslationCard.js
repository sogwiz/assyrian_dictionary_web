import React from 'react'

// A single translation "version". Owns its own gender-form state so each
// generated alternative can be toggled independently of the others.
class TranslationCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { genderForm: 'default' };
    this.setGender = this.setGender.bind(this);
  }

  setGender(form) {
    this.setState({ genderForm: form });
  }

  renderGenderToggle(translation) {
    // Only show the toggle if masculine/feminine actually differ.
    const hasGender = translation.masculine && translation.feminine &&
      (translation.masculine.east !== translation.feminine.east);
    if (!hasGender) return null;

    const current = this.state.genderForm;
    const options = [
      { key: 'default', label: 'Default' },
      { key: 'masculine', label: '♂ Masculine' },
      { key: 'feminine', label: '♀ Feminine' }
    ];

    return (
      <div className='translation-gender-toggle'>
        {options.map((opt) => (
          <button
            key={opt.key}
            className={'gender-btn' + (current === opt.key ? ' is-active' : '')}
            onClick={() => this.setGender(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  render() {
    const translation = this.props.translation || {};
    const eastfont = this.props.eastfont || 'east';
    const form = translation[this.state.genderForm] || translation.default || {};

    return (
      <div className='translation-card'>
        <div className='translation-card-header'>
          <span className='translation-beta-badge'>Beta</span>
          {this.props.versionLabel && (
            <span className='translation-version-label'>{this.props.versionLabel}</span>
          )}
          {translation.confidence && (
            <span className={'translation-confidence confidence-' + translation.confidence}>
              {translation.confidence} confidence
            </span>
          )}
        </div>

        {this.renderGenderToggle(translation)}

        <div className='translation-primary'>
          <div className={'translation-east ' + eastfont}>{form.east}</div>
          {form.phonetic && <div className='translation-phonetic'>{form.phonetic}</div>}
          {form.english_phonetic && (
            <div className='translation-english-phonetic'>{form.english_phonetic}</div>
          )}
        </div>

        {translation.explanation && (
          <div className='translation-explanation'>{translation.explanation}</div>
        )}
      </div>
    );
  }
}

export default TranslationCard
