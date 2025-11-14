import PropTypes from 'prop-types';
import React from 'react'
import { OverlayTrigger, Popover, Button } from 'react-bootstrap'
import DefinitionHelper from './DefinitionHelper'
import PhoneticWestHelper from '../util/PhoneticWestHelper.js'
import PhoneticEastHelper from '../util/PhoneticEastHelper.js'
import ReactAudioPlayer from 'react-audio-player'
import RelatedTerms from './RelatedTerms'
import DerivedWords from './widgets/DerivedWords'

class TodoDetail extends React.Component {

  static propTypes = {
    todo: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      searchResults: null,
      partOfSpeech: null,
      derivedWords: new Array(),
      eastfont: localStorage.getItem('eastfont') || 'east',
      westfont: localStorage.getItem('westfont') || 'west'
    }

  }

  componentDidMount(){
    this.queryKey()
  }

  queryKey() {

    const that = this;

    fetch('/api/searchkeynum/' + this.props.params.searchkeynum)
      .then((response) => response.json())
      .then(data => {
        that.setState({
          searchResults: data,
          partOfSpeech: data[0]['partofspeech']
        })
      })
      .then(function (data) {
        // do stuff with `data`, call second `fetch`
        return that.state.partOfSpeech != "root" ? null : fetch('/api/derived/' + that.state.searchResults[0]['east'])
      })
      .then((response) => response.json())
      .then(data => {
        that.setState({
          derivedWords: data
        })
      })


  }

  render() {
    console.log(this.state.derivedWords)

    const popoverBottom = (
      <Popover>
      <Popover.Title as="h3">{'Type: ' + this.state.partOfSpeech}</Popover.Title>
        <Popover.Content>
        more <strong>{this.state.partOfSpeech == "root" ? "Root Words" : this.state.partOfSpeech + 's'}</strong> can be found <a href={"/" + this.state.partOfSpeech + "s"}>here</a>
        </Popover.Content>
    </Popover>
    );

    const overlay = (

      <OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom}>
        <Button size="sm" variant="secondary">{this.state.partOfSpeech}</Button>
      </OverlayTrigger>
    )

    const derivedWords = this.state.partOfSpeech != "root" ? (<div />) : (
      <DerivedWords root={this.state.searchResults[0]} derivations={this.state.derivedWords} />
    )


    if (this.state.searchResults) {
      const dictionary_definition_obj = this.state.searchResults[0]
      console.log("dictionary_definition_obj ")
      console.log(dictionary_definition_obj)
      if (!dictionary_definition_obj) {
        return (
          <div className="todos">
            <div className="definition-detail-page">
              <div className="definition-detail-container">
                <div className="definition-detail-error">
                  <h2>Oops! Something went wrong</h2>
                  <p>We couldn't find the definition you're looking for.</p>
                  <a 
                    href={"http://assyrianlanguages.org/sureth/dosearch.php?searchkey=" + this.props.params.searchkeynum + "&language=id"} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link-button"
                  >
                    <span>Try on Assyrian Languages</span>
                    <span className="external-link-icon">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )
      }

      let partOfSpeech = dictionary_definition_obj['partofspeech']
      if (partOfSpeech == "root" || partOfSpeech == "phrase" || partOfSpeech == "name" ) {
        partOfSpeech = overlay
      }
      //const cf = this.getCleanArrWithHtml(dictionary_definition_obj['cf'));
      //const seealso = this.getCleanArrWithHtml(dictionary_definition_obj['seealso'));

      //var rows = [];
      const cf = (<DefinitionHelper arr={dictionary_definition_obj['cf']} />);
      const seealso = (<DefinitionHelper arr={dictionary_definition_obj['seealso']} />);

      const phonetic = PhoneticEastHelper(dictionary_definition_obj['phonetic']);

      const phonetic_west = PhoneticWestHelper(dictionary_definition_obj['phonetic_west']);

      const audioEast = PhoneticWestHelper(dictionary_definition_obj['audio']);
      const audioWest = PhoneticWestHelper(dictionary_definition_obj['audio_west']);

      // Format audio URLs
      let audioEastUrl = audioEast;
      let audioWestUrl = audioWest;
      if (audioEast && !audioEast.includes('http')) {
        audioEastUrl = 'http://assyrianlanguages.org/sureth/' + audioEast;
      }
      if (audioWest && !audioWest.includes('http')) {
        audioWestUrl = 'http://assyrianlanguages.org/sureth/' + audioWest;
      }

      return (
        <div className="todos">
          <div className="definition-detail-page">
            <div className="definition-detail-container">
              <ul itemscope itemtype="http://schema.org/BreadcrumbList">
                
                {/* Main Definition Card */}
                <div className="definition-detail-main">
                  <div className="definition-detail-header">
                    <h1 className="definition-detail-title">Definition</h1>
                    <div className="definition-detail-category">
                      Category: {partOfSpeech}
                    </div>
                  </div>
                  
                  <div className="definition-detail-body">
                    <p className="definition-detail-text">
                      {dictionary_definition_obj['definition_arr'].join("\n").replace(/^ : /, "")}
                    </p>
                  </div>

                  {/* East/West Dialects */}
                  <div className="definition-detail-dialects">
                    <div className="dialect-row">
                      <div className="dialect-label">East:</div>
                      <div className="dialect-content">
                        <span className={this.state.eastfont}>{dictionary_definition_obj['east']}</span>
                        {phonetic && <span className="phonetic">({phonetic})</span>}
                        {audioEast && (
                          <div className="audio-player-wrapper">
                            <ReactAudioPlayer src={audioEastUrl} controls />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="dialect-row">
                      <div className="dialect-label">West:</div>
                      <div className="dialect-content">
                        <span className="west">{dictionary_definition_obj['west']}</span>
                        {phonetic_west && <span className="phonetic">({phonetic_west})</span>}
                        {audioWest && (
                          <div className="audio-player-wrapper">
                            <ReactAudioPlayer src={audioWestUrl} controls />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="definition-detail-section">
                  <div className="definition-detail-section-header">
                    <h2>Details</h2>
                  </div>
                  
                  <div className="definition-detail-section-content">
                    {cf && (
                      <div className="detail-item">
                        <strong>Cross References:</strong>
                        <span className={this.state.eastfont}>{cf}</span>
                      </div>
                    )}
                    
                    <div className="detail-metadata">
                      <ul>
                        {dictionary_definition_obj['source'] && (
                          <li itemprop="itemListElement" itemscope
                            itemtype="http://schema.org/ListItem">
                            <strong>Source:</strong> {dictionary_definition_obj['source']}
                          </li>
                        )}
                        {dictionary_definition_obj['dialect'] && (
                          <li itemprop="itemListElement" itemscope
                            itemtype="http://schema.org/ListItem">
                            <strong>Dialect:</strong> {dictionary_definition_obj['dialect']}
                          </li>
                        )}
                        {dictionary_definition_obj['origins'] && (
                          <li itemprop="itemListElement" itemscope
                            itemtype="http://schema.org/ListItem">
                            <strong>Origins:</strong> {dictionary_definition_obj['origins']}
                          </li>
                        )}
                        {seealso && (
                          <li itemprop="itemListElement" itemscope
                            itemtype="http://schema.org/ListItem">
                            <strong>See Also:</strong> <span className={this.state.eastfont}>{seealso}</span>
                          </li>
                        )}
                        {dictionary_definition_obj['root'] && (
                          <li itemprop="itemListElement" itemscope
                            itemtype="http://schema.org/ListItem">
                            <strong>Root:</strong> <span className={this.state.eastfont}>
                              <a href={"/word/" + dictionary_definition_obj['root']}>
                                {dictionary_definition_obj['root']}
                              </a>
                            </span>
                          </li>
                        )}
                        {dictionary_definition_obj['semantics'] && (
                          <li itemprop="itemListElement" itemscope
                            itemtype="http://schema.org/ListItem">
                            <strong>Semantics:</strong> {dictionary_definition_obj['semantics']}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Derived Words Section */}
                {derivedWords && (
                  <div className="definition-detail-section">
                    {derivedWords}
                  </div>
                )}

                {/* Related Searches */}
                <div className="definition-detail-section">
                  <div className="definition-detail-section-header">
                    <h2>Related Searches</h2>
                  </div>
                  <div className="definition-detail-section-content">
                    <RelatedTerms searchkeynum={this.props.params.searchkeynum} />
                  </div>
                </div>

                {/* External Link */}
                <div className="definition-detail-external-link">
                  <a 
                    href={"http://assyrianlanguages.org/sureth/dosearch.php?searchkey=" + this.props.params.searchkeynum + "&language=id"} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link-button"
                  >
                    <span>View on Assyrian Languages</span>
                    <span className="external-link-icon">↗</span>
                  </a>
                </div>
              </ul>
            </div>
          </div>
        </div>
      )
    }
    if (!this.state.searchResults) {
      return (
        <div className="todos">
          <div className="definition-detail-page">
            <div className="definition-detail-container">
              <div className="definition-detail-loading">
                <div className="loading-spinner"></div>
                <p>Loading definition...</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default TodoDetail
