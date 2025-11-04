import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Dropdown from 'react-dropdown'
import ReactGA from 'react-ga'

// Placeholder data structure for Assyrian letters
// TODO: Replace with actual letter data
// Ordered alphabetically: ܐ through ܬ
const ASSYRIAN_LETTERS = [
  {
    assyrian: 'ܐ',
    english: 'A',
    transliteration: 'Alap',
    isSemiVowel: true,
    searchkeynum: 11686,
    pictograph: '��', // Placeholder - original pictograph
    evolution: {
      protoSinaitic: '𓃾',
      phoenician: '𐤀',
      aramaic: '𐡀',
      syriac: 'ܐ'
    },
    history: 'Alap is the first letter of the Syriac alphabet. It originated from the Proto-Sinaitic ox head symbol. In ancient Semitic languages, it represented the glottal stop sound. Over time, it evolved through Phoenician and Aramaic scripts before becoming the modern Syriac Alap.',
    phonetic: 'Glottal stop or vowel carrier',
    culturalUsage: 'Alap is used extensively in religious texts and is significant in Syriac Christian liturgy.'
  },
  {
    assyrian: 'ܒ',
    english: 'B',
    transliteration: 'Beth',
    isSemiVowel: false,
    searchkeynum: 869,
    pictograph: '🏠', // Placeholder
    evolution: {
      protoSinaitic: '𓉐',
      phoenician: '𐤁',
      aramaic: '𐡁',
      syriac: 'ܒ'
    },
    history: 'Beth derives from the Proto-Sinaitic house symbol. The name "Beth" itself means "house" in Semitic languages. This letter has been a fundamental building block of the alphabet throughout its evolution.',
    phonetic: 'b (hard), v (soft)',
    culturalUsage: 'Beth appears in many common words and is central to the Syriac script.'
  },
  {
    assyrian: 'ܓ',
    english: 'G',
    transliteration: 'Gamal',
    isSemiVowel: false,
    searchkeynum: 1823,
    pictograph: '🐫', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡂',
      syriac: 'ܓ'
    },
    history: 'Gamal comes from the camel symbol in Proto-Sinaitic script. The curved shape of the letter reflects the hump of a camel, and the name "Gamal" means camel in Semitic languages.',
    phonetic: 'g (hard), gh (soft)',
    culturalUsage: 'Used in many words related to camels and travel in ancient texts.'
  },
  {
    assyrian: 'ܕ',
    english: 'D',
    transliteration: 'Dalath',
    isSemiVowel: false,
    searchkeynum: 2643,
    pictograph: '🚪', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡃',
      syriac: 'ܕ'
    },
    history: 'Dalath originates from the door symbol. The name means "door" and the letter shape reflects an ancient door design.',
    phonetic: 'd (hard), dh (soft)',
    culturalUsage: 'Frequently used in words related to doors, entrances, and passages.'
  },
  {
    assyrian: 'ܗ',
    english: 'H',
    transliteration: 'He',
    isSemiVowel: true,
    searchkeynum: 3250,
    pictograph: '🙏', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡄',
      syriac: 'ܗ'
    },
    history: 'He derives from a window or lattice symbol. It often functions as a vowel marker in addition to its consonantal value.',
    phonetic: 'h',
    culturalUsage: 'Common in pronouns and particles.'
  },
  {
    assyrian: 'ܘ',
    english: 'W',
    transliteration: 'Waw',
    isSemiVowel: true,
    searchkeynum: 3574,
    pictograph: '🪝', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡅',
      syriac: 'ܘ'
    },
    history: 'Waw comes from the hook or peg symbol. It serves dual functions as both a consonant and a vowel, representing the sounds "w" and "u" or "o".',
    phonetic: 'w, u, o',
    culturalUsage: 'Essential as a conjunction meaning "and" in Syriac.'
  },
  {
    assyrian: 'ܙ',
    english: 'Z',
    transliteration: 'Zain',
    isSemiVowel: false,
    searchkeynum: 3659,
    pictograph: '⚔️', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡆',
      syriac: 'ܙ'
    },
    history: 'Zain originated from a weapon or sword symbol. The name means "weapon" in ancient Semitic languages.',
    phonetic: 'z',
    culturalUsage: 'Appears in words related to weapons and tools.'
  },
  {
    assyrian: 'ܚ',
    english: 'H',
    transliteration: 'Heth',
    isSemiVowel: false,
    searchkeynum: 4023,
    pictograph: '🧱', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡇',
      syriac: 'ܚ'
    },
    history: 'Heth derives from a fence or wall symbol. It represents a guttural sound that has no direct equivalent in English.',
    phonetic: 'kh (guttural h)',
    culturalUsage: 'Common in many basic words and roots.'
  },
  {
    assyrian: 'ܛ',
    english: 'T',
    transliteration: 'Teth',
    isSemiVowel: false,
    searchkeynum: 4939,
    pictograph: '��️', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡈',
      syriac: 'ܛ'
    },
    history: 'Teth comes from a wheel or shield symbol. It represents an emphatic "t" sound unique to Semitic languages.',
    phonetic: 't (emphatic)',
    culturalUsage: 'Used in words requiring emphasis or strength.'
  },
  {
    assyrian: 'ܝ',
    english: 'Y',
    transliteration: 'Yodh',
    isSemiVowel: true,
    searchkeynum: 5315,
    pictograph: '✋', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡉',
      syriac: 'ܝ'
    },
    history: 'Yodh derives from the hand symbol. It functions as both a consonant ("y") and a vowel ("i" or "e").',
    phonetic: 'y, i, e',
    culturalUsage: 'Extremely common, appearing in many words and grammatical structures.'
  },
  {
    assyrian: 'ܟ',
    english: 'K',
    transliteration: 'Kaf',
    isSemiVowel: false,
    searchkeynum: 22793,
    pictograph: '✋', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡊',
      syriac: 'ܟ'
    },
    history: 'Kaf also comes from the hand symbol, specifically representing the palm. It has hard (k) and soft (kh) pronunciations.',
    phonetic: 'k (hard), kh (soft)',
    culturalUsage: 'Very common in the language, appearing in many basic words.'
  },
  {
    assyrian: 'ܠ',
    english: 'L',
    transliteration: 'Lamadh',
    isSemiVowel: false,
    searchkeynum: 6548,
    pictograph: '🐄', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡋',
      syriac: 'ܠ'
    },
    history: 'Lamadh derives from the goad or cattle prod symbol. It represents the "l" sound and is one of the most frequently used letters.',
    phonetic: 'l',
    culturalUsage: 'Appears in countless words and is essential for grammar.'
  },
  {
    assyrian: 'ܡ',
    english: 'M',
    transliteration: 'Mim',
    isSemiVowel: false,
    searchkeynum: 30249,
    pictograph: '💧', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡌',
      syriac: 'ܡ'
    },
    history: 'Mim originates from the water symbol. The letter shape reflects waves or flowing water, and the name "Mim" relates to water in some interpretations.',
    phonetic: 'm',
    culturalUsage: 'Common in words related to water, mother, and many basic concepts.'
  },
  {
    assyrian: 'ܢ',
    english: 'N',
    transliteration: 'Nun',
    isSemiVowel: false,
    searchkeynum: 30250,
    pictograph: '🐍', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡍',
      syriac: 'ܢ'
    },
    history: 'Nun derives from the snake or fish symbol. The name "Nun" means fish in some Semitic languages, and the letter shape suggests a serpent or fish.',
    phonetic: 'n',
    culturalUsage: 'Frequently used, especially in plural forms and grammatical endings.'
  },
  {
    assyrian: 'ܣ',
    english: 'S',
    transliteration: 'Semkath',
    isSemiVowel: false,
    searchkeynum: 9369,
    pictograph: '📏', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡎',
      syriac: 'ܣ'
    },
    history: 'Semkath comes from a support or prop symbol. It represents the "s" sound and is distinct from Samekh.',
    phonetic: 's',
    culturalUsage: 'Used in East Syriac script, while Samekh is used in West Syriac.'
  },
  {
    assyrian: 'ܥ',
    english: "E",
    transliteration: 'aihn',
    isSemiVowel: false,
    searchkeynum: 10000,
    pictograph: '��️', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡏',
      syriac: 'ܥ'
    },
    history: 'E (Ain) derives from the eye symbol. It represents a guttural sound that has no English equivalent, produced deep in the throat.',
    phonetic: 'Ain (guttural)',
    culturalUsage: 'Common in many Semitic words and roots.'
  },
  {
    assyrian: 'ܦ',
    english: 'P',
    transliteration: 'Pe',
    isSemiVowel: false,
    searchkeynum: 10577,
    pictograph: '👄', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡐',
      syriac: 'ܦ'
    },
    history: 'Pe comes from the mouth symbol. It has hard (p) and soft (f) pronunciations depending on context.',
    phonetic: 'p (hard), f (soft)',
    culturalUsage: 'Used in words related to speaking, mouth, and many common terms.'
  },
  {
    assyrian: 'ܨ',
    english: 'S',
    transliteration: 'Sadhe',
    isSemiVowel: false,
    searchkeynum: 11587,
    pictograph: '🌿', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡑',
      syriac: 'ܨ'
    },
    history: 'Sadhe derives from a plant or hook symbol. It represents an emphatic "s" sound unique to Semitic languages.',
    phonetic: 's (emphatic)',
    culturalUsage: 'Used in words requiring emphasis, often related to plants or nature.'
  },
  {
    assyrian: 'ܩ',
    english: 'Q',
    transliteration: 'Qop',
    isSemiVowel: false,
    searchkeynum: 12152,
    pictograph: '🪣', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡒',
      syriac: 'ܩ'
    },
    history: 'Qop comes from the monkey or knot symbol. It represents an emphatic "q" sound, pronounced further back in the throat than regular "k".',
    phonetic: 'q (emphatic)',
    culturalUsage: 'Common in many words, especially those of ancient origin.'
  },
  {
    assyrian: 'ܪ',
    english: 'R',
    transliteration: 'Resh',
    isSemiVowel: false,
    searchkeynum: 13306,
    pictograph: '👤', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡓',
      syriac: 'ܪ'
    },
    history: 'Resh derives from the head symbol. The name means "head" in Semitic languages, and the letter represents the "r" sound.',
    phonetic: 'r',
    culturalUsage: 'Very common, appearing in many words and grammatical forms.'
  },
  {
    assyrian: 'ܫ',
    english: 'S',
    transliteration: 'Shin',
    isSemiVowel: false,
    searchkeynum: 9862,
    pictograph: '🦷', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡔',
      syriac: 'ܫ'
    },
    history: 'Shin comes from the tooth symbol. It represents the "sh" sound and is one of the most distinctive letters in the alphabet.',
    phonetic: 'sh',
    culturalUsage: 'Extremely common, appearing in many basic words.'
  },
  {
    assyrian: 'ܬ',
    english: 'T',
    transliteration: 'Taw',
    isSemiVowel: false,
    searchkeynum: 4416,
    pictograph: '✖️', // Placeholder
    evolution: {
      protoSinaitic: '��',
      phoenician: '��',
      aramaic: '𐡕',
      syriac: 'ܬ'
    },
    history: 'Taw derives from the mark or sign symbol. It is the last letter of the alphabet and represents the "t" sound, with hard (t) and soft (th) pronunciations.',
    phonetic: 't (hard), th (soft)',
    culturalUsage: 'Very common, especially in feminine endings and many basic words.'
  }
]

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLetter: ASSYRIAN_LETTERS[0],
      eastfont: localStorage.getItem('eastfont') || 'east'
    };
  }

  onChangeFont(option) {
    localStorage.setItem("eastfont", option.value)
    this.setState({
      eastfont: option.value
    })

    ReactGA.event({
      category: 'User',
      action: 'fontselect',
      label: option.value
    });
  }

  selectLetter(letter) {
    this.setState({
      selectedLetter: letter
    });

    ReactGA.event({
      category: 'User',
      action: 'alphabetLetterClick',
      label: letter.transliteration
    });
  }

  render() {
    const { selectedLetter, eastfont } = this.state;

    const fontOptions = [
      {
        type: 'group',
        name: 'Font',
        items: [
          { value: 'east', label: 'East Syriac Adiabene - ܣܘܼܪܝܼܬ݂', className: 'east' },
          { value: 'east-syriac-qasha', label: 'East Syriac Qasha - ܣܘܼܪܝܼܬ݂', className: 'east-syriac-qasha' },
          { value: 'estrangelo-antioch', label: 'Estrangelo Antioch - ܣܘܼܪܝܼܬ݂', className: 'estrangelo-antioch' },
          { value: 'estrangelo-midyat', label: 'Estrangelo Midyat - ܣܘܼܪܝܼܬ݂', className: 'estrangelo-midyat' },
          { value: 'estrangelo-nisibin', label: 'Estrangelo Nisibin - ܣܘܼܪܝܼܬ݂', className: 'estrangelo-nisibin' }
        ]
      }
    ];

    return (
      <div className="alphabet-page">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://bootswatch.com/3/cosmo/bootstrap.min.css" />
        
        <Container style={{ padding: '20px', maxWidth: '1400px' }}>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h1 className='title' style={{ marginBottom: '10px' }}>Assyrian Alphabet Explorer</h1>
            <p style={{ fontSize: '18px', color: '@gray-600' }}>Discover the history and evolution of each letter</p>
          </div>
        </Container>
        
        <Container style={{ padding: '0 20px 20px', maxWidth: '1400px', height: 'calc(100vh - 220px)' }}>
          {/* Mobile-only font selector above Panel A */}
          <div className="alphabet-mobile-font-switcher">
            <Dropdown
              options={fontOptions}
              onChange={this.onChangeFont.bind(this)}
              value={eastfont}
              placeholder="Select a font"
            />
          </div>
          
          <Row style={{ height: '100%' }}>
            <Col xs={12} md={3} className="alphabet-panel-left">
              <div className="alphabet-header">
                <h2 className="alphabet-title">Assyrian Alphabet</h2>
                <p className="alphabet-subtitle">Click a letter to explore its history</p>
              </div>
              
              <div className="alphabet-list-container">
                {ASSYRIAN_LETTERS.map((letter, index) => (
                  <div
                    key={index}
                    className={`alphabet-letter-item ${selectedLetter === letter ? 'active' : ''}`}
                    onClick={() => this.selectLetter(letter)}
                  >
                    <div className="alphabet-letter-character">
                      <span className={eastfont}>{letter.assyrian}</span>
                    </div>
                    <div className="alphabet-letter-info">
                      <div className="alphabet-letter-english">
                        {letter.english}
                        {letter.isSemiVowel && (
                          <span className="alphabet-semi-vowel-badge">Semi-vowel</span>
                        )}
                      </div>
                      <div className="alphabet-letter-name">{letter.transliteration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Col>

            <Col xs={12} md={9} className="alphabet-panel-right">
              <div className="alphabet-detail-container">
                <div className="alphabet-detail-header">
                  <div className="alphabet-detail-font-switcher">
                    <Dropdown
                      options={fontOptions}
                      onChange={this.onChangeFont.bind(this)}
                      value={eastfont}
                      placeholder="Select a font"
                    />
                  </div>
                </div>

                <div className="alphabet-detail-content">
                  <div className="alphabet-detail-main-character">
                    <span className={eastfont}>{selectedLetter.assyrian}</span>
                  </div>

                  <div className="alphabet-detail-title">
                    <h1>{selectedLetter.transliteration}</h1>
                    <h2>English: {selectedLetter.english} • Transliteration: {selectedLetter.transliteration}</h2>
                  </div>

                  {selectedLetter.searchkeynum && (
                    <div className="alphabet-detail-section" style={{ marginTop: '10px', marginBottom: '10px' }}>
                      <a href={`/searchkey/${selectedLetter.searchkeynum}`} style={{ color: '#2563eb', textDecoration: 'none', fontSize: '16px', fontWeight: '500' }}>
                        ℹ️ More Information
                      </a>
                    </div>
                  )}

                  <div className="alphabet-detail-section">
                    <h3>Phonetic Value</h3>
                    <p>{selectedLetter.phonetic}</p>
                  </div>

                  <div className="alphabet-detail-section">
                    <h3>Origin: Pictograph / Hieroglyph</h3>
                    <div className="alphabet-pictograph-container" hidden="true">
                      <div className="alphabet-pictograph-item">
                        <div className="alphabet-pictograph-label">Original Pictograph</div>
                        <div className="alphabet-pictograph-character">{selectedLetter.pictograph}</div>
                        <div className="alphabet-pictograph-description">Ancient symbol from which this letter evolved</div>
                      </div>
                    </div>
                  </div>

                  <div className="alphabet-detail-section">
                    <h3>Evolution Timeline</h3>
                    <div className="alphabet-evolution-timeline">
                      <div className="alphabet-evolution-step">
                        <div className="alphabet-evolution-character">{selectedLetter.evolution.protoSinaitic}</div>
                        <div className="alphabet-evolution-label">Proto-Sinaitic</div>
                      </div>
                      <div className="alphabet-evolution-arrow">→</div>
                      <div className="alphabet-evolution-step">
                        <div className="alphabet-evolution-character">{selectedLetter.evolution.phoenician}</div>
                        <div className="alphabet-evolution-label">Phoenician</div>
                      </div>
                      <div className="alphabet-evolution-arrow">→</div>
                      <div className="alphabet-evolution-step">
                        <div className="alphabet-evolution-character">{selectedLetter.evolution.aramaic}</div>
                        <div className="alphabet-evolution-label">Aramaic</div>
                      </div>
                      <div className="alphabet-evolution-arrow">→</div>
                      <div className="alphabet-evolution-step">
                        <div className="alphabet-evolution-character">
                          <span className={eastfont}>{selectedLetter.evolution.syriac}</span>
                        </div>
                        <div className="alphabet-evolution-label">Syriac</div>
                      </div>
                    </div>
                  </div>

                  <div className="alphabet-detail-section">
                    <h3>Historical Context</h3>
                    <p>{selectedLetter.history}</p>
                  </div>

                  <div className="alphabet-detail-section">
                    <h3>Cultural Usage</h3>
                    <p>{selectedLetter.culturalUsage}</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default Alphabet
