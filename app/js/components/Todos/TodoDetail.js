import React from 'react'
import { Link } from 'react-router'
mixins: [ParseReact.Mixin]
import Parse from 'parse'
import ParseReact from 'parse-react'
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
    //console.log("searchkeynum = " + this.props.params.searchkeynum)
    const query = new Parse.Query('DictionaryDefinition')
        .equalTo('searchkeynum',parseInt(this.props.params.searchkeynum))
        .limit(1)

    const that = this;
    query.find({

        success: function (results) {
            //let lastTime = results[0]['updatedAt'];
            that.setState({
                searchResults: results
            })
        },
        error: function (error) {

        }
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
      //const cf = this.getCleanArrWithHtml(dictionary_definition_obj.get('cf'));
      //const seealso = this.getCleanArrWithHtml(dictionary_definition_obj.get('seealso'));

      //var rows = [];
      const cf = (<DefinitionHelper arr={dictionary_definition_obj.get('cf')}/>);
      const seealso = (<DefinitionHelper arr={dictionary_definition_obj.get('seealso')}/>);
      
      const phonetic = PhoneticEastHelper(dictionary_definition_obj.get('phonetic'));

      const phonetic_west = PhoneticWestHelper(dictionary_definition_obj.get('phonetic_west'));

      const audioEast = PhoneticWestHelper(dictionary_definition_obj.get('audio'));
      const audioWest = PhoneticWestHelper(dictionary_definition_obj.get('audio_west'));

      return (
        <div className="todos">
<ul itemscope itemtype="http://schema.org/BreadcrumbList">

     Definition: {dictionary_definition_obj.get('definition_arr').join("\n").replace(/^ : /,"")}
     <p>Category: {dictionary_definition_obj.get('partofspeech')}</p>
       <p className='definition'>
       East: <span className="east">{dictionary_definition_obj.get('east')}</span>
       <span className="phonetic">({phonetic})</span>
       <ReactAudioPlayer src={audioEast}/>
     </p>
     <p className='definition'>
       West: <span className="west">{dictionary_definition_obj.get('west')}</span>
       <span className="phonetic">({phonetic_west})</span>
       <ReactAudioPlayer src={audioWest}/>
     </p>

     <p className='definition'>
       Cross References: {cf}
     </p>
     <p>
     <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem" itemprop="name">Source : {dictionary_definition_obj.get('source')}</li>
      <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem" itemprop="name">Dialect : {dictionary_definition_obj.get('dialect')}</li>
      <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem" itemprop="name">
       Origins : {dictionary_definition_obj.get('origins')}</li>
       <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem" itemprop="name">See Also : {seealso}</li>
      <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem" itemprop="name">Root : {dictionary_definition_obj.get('root')}</li>
      <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem" itemprop="name">Semantics : {dictionary_definition_obj.get('semantics')}</li>
       
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
