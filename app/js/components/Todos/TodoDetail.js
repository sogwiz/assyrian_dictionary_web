import React from 'react'
import { Link } from 'react-router'
import ReactModal from 'react-modal'
import {Button, Col, Grid, Row} from 'react-bootstrap'
import DefinitionHelper from './DefinitionHelper'
import PhoneticWestHelper from '../util/PhoneticWestHelper.js'
import PhoneticEastHelper from '../util/PhoneticEastHelper.js'
import AudioHelper from '../util/AudioHelper.js'
import ReactAudioPlayer from 'react-audio-player'
import RelatedTerms from './RelatedTerms'

class TodoDetail extends React.Component {

  static propTypes = {
    todo: React.PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      searchResults:null
    }

    this.queryKey();
  }

  queryKey() {

    const that = this;

    fetch('/api/searchkeynum/' + this.props.params.searchkeynum)
                    .then((response) => response.json())
                    .then (data => {
                        that.setState({
                          searchResults: data
                        })
                    })
}

  render() {
    console.log('in render of TodoDetail')
    
    if(this.state.searchResults){
      const dictionary_definition_obj = this.state.searchResults[0]
      console.log("dictionary_definition_obj " )
      console.log(dictionary_definition_obj)
      if(!dictionary_definition_obj){
        return(<div><br/><br/><br/>Oooooops. Really sorry! Something went wrong here. 
        Find out more about the <a href={"http://assyrianlanguages.org/sureth/dosearch.php?searchkey="+this.props.params.searchkeynum+"&language=id"} target="_blank">term</a> you clicked on.
          </div>)
      }
      //const cf = this.getCleanArrWithHtml(dictionary_definition_obj['cf'));
      //const seealso = this.getCleanArrWithHtml(dictionary_definition_obj['seealso'));

      //var rows = [];
      const cf = (<DefinitionHelper arr={dictionary_definition_obj['cf']}/>);
      const seealso = (<DefinitionHelper arr={dictionary_definition_obj['seealso']}/>);
      
      const phonetic = PhoneticEastHelper(dictionary_definition_obj['phonetic']);

      const phonetic_west = PhoneticWestHelper(dictionary_definition_obj['phonetic_west']);

      const audioEast = PhoneticWestHelper(dictionary_definition_obj['audio']);
      const audioWest = PhoneticWestHelper(dictionary_definition_obj['audio_west']);

      return (
        <div className="todos">
<ul itemscope itemtype="http://schema.org/BreadcrumbList">

     Definition: {dictionary_definition_obj['definition_arr'].join("\n").replace(/^ : /,"")}
     <p>Category: {dictionary_definition_obj['partofspeech']}</p>
       <p className='definition'>
       East: <span className="east">{dictionary_definition_obj['east']}</span>
       <span className="phonetic">({phonetic})</span>
       <ReactAudioPlayer src={audioEast}/>
     </p>
     <p className='definition'>
       West: <span className="west">{dictionary_definition_obj['west']}</span>
       <span className="phonetic">({phonetic_west})</span>
       <ReactAudioPlayer src={audioWest}/>
     </p>

     <p className='definition'>
       Cross References: {cf}
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
      itemtype="http://schema.org/ListItem" itemprop="name">See Also : {seealso}</li>
      <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem" itemprop="name">Root : {dictionary_definition_obj['root']}</li>
      <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem" itemprop="name">Semantics : {dictionary_definition_obj['semantics']}</li>
       
     </p>
     </ul>
     <div className="posnormal">
     Related Searches
     </div>
     <RelatedTerms searchkeynum={this.props.params.searchkeynum}/>
     <p>
     <span><a href={"http://assyrianlanguages.org/sureth/dosearch.php?searchkey="+this.props.params.searchkeynum+"&language=id"} target="_blank">More Details</a></span>
     </p>
     </div>

      )
    }
    if(!this.state.searchResults){
      return (<p>Loading</p>)
    }
  }
}

export default TodoDetail
