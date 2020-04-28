import React from 'react'
import { Link } from 'react-router'
import ReactModal from 'react-modal'
import { Button, Col, Grid, Row, OverlayTrigger, Panel, Popover } from 'react-bootstrap'
import DefinitionHelper from './DefinitionHelper'
import PhoneticWestHelper from '../util/PhoneticWestHelper.js'
import PhoneticEastHelper from '../util/PhoneticEastHelper.js'
import AudioHelper from '../util/AudioHelper.js'
import ReactAudioPlayer from 'react-audio-player'
import RelatedTerms from './RelatedTerms'
import DerivedWords from './widgets/DerivedWords'

class TodoDetail extends React.Component {

  static propTypes = {
    todo: React.PropTypes.object.isRequired,
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

    this.queryKey();
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
      <Popover id="popover-positioned-bottom" title={"Type: " + this.state.partOfSpeech}>
        <strong>{this.state.partOfSpeech == "root" ? "Root Words" : this.state.partOfSpeech + 's'}</strong> can be found <a href={"/" + this.state.partOfSpeech + "s"}>here</a>
      </Popover>
    );

    const overlay = (

      <OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom}>
        <Button bsSize="small">{this.state.partOfSpeech}</Button>
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
        return (<div><br /><br /><br />Oooooops. Really sorry! Something went wrong here.
        Find out more about the <a href={"http://assyrianlanguages.org/sureth/dosearch.php?searchkey=" + this.props.params.searchkeynum + "&language=id"} target="_blank">term</a> you clicked on.
          </div>)
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

      return (
        <div className="todos">
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
          <link rel="stylesheet" href="https://bootswatch.com/3/cosmo/bootstrap.min.css" />


          <ul itemscope itemtype="http://schema.org/BreadcrumbList">

            Definition: {dictionary_definition_obj['definition_arr'].join("\n").replace(/^ : /, "")}
            <p>Category: {partOfSpeech}</p>
            <p className='definition'>
              East: <span className={this.state.eastfont}>{dictionary_definition_obj['east']}</span>
              <span className="phonetic">({phonetic})</span>
              <ReactAudioPlayer src={audioEast} />
            </p>
            <p className='definition'>
              West: <span className="west">{dictionary_definition_obj['west']}</span>
              <span className="phonetic">({phonetic_west})</span>
              <ReactAudioPlayer src={audioWest} />
            </p>

            <Grid>
              <Panel id="collapsible-panel-details" collapsible defaultExpanded header="Details">
                <p className='definition'>
                  Cross References: <span className={this.state.eastfont}>{cf}</span>
                </p>
                <p>
                  <li itemprop="itemListElement" itemscope
                    itemtype="http://schema.org/ListItem" itemprop="name">Source : {dictionary_definition_obj['source']}</li>
                  <li itemprop="itemListElement" itemscope
                    itemtype="http://schema.org/ListItem" itemprop="name">Dialect : {dictionary_definition_obj['dialect']}</li>
                  <li itemprop="itemListElement" itemscope
                    itemtype="http://schema.org/ListItem" itemprop="name">
                    Origins : {dictionary_definition_obj['origins']}</li>
                  <li itemprop="itemListElement" itemscope
                    itemtype="http://schema.org/ListItem" itemprop="name">See Also : <span className={this.state.eastfont}>{seealso}</span></li>
                  <li itemprop="itemListElement" itemscope
                    itemtype="http://schema.org/ListItem" itemprop="name">Root : <span className={this.state.eastfont}><a href={"/word/" + dictionary_definition_obj['root']}>{dictionary_definition_obj['root']}</a></span></li>
                  <li itemprop="itemListElement" itemscope
                    itemtype="http://schema.org/ListItem" itemprop="name">Semantics : {dictionary_definition_obj['semantics']}</li>

                </p>
              </Panel>

              {derivedWords}
            </Grid>
          </ul>

          <div className="posnormal">
            Related Searches
     </div>
          <RelatedTerms searchkeynum={this.props.params.searchkeynum} />
          <p>
            <span><a href={"http://assyrianlanguages.org/sureth/dosearch.php?searchkey=" + this.props.params.searchkeynum + "&language=id"} target="_blank">More Details</a></span>
          </p>
        </div>

      )
    }
    if (!this.state.searchResults) {
      return (<p>Loading</p>)
    }
  }
}

export default TodoDetail
