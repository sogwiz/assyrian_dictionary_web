import React from 'react'
import ParseReact from 'parse-react'
import { Link } from 'react-router'
import ReactAudioPlayer from 'react-audio-player'
import Badge from 'react-uikit-badge';
import Helmet from "react-helmet";
import TodoDetail from './TodoDetail'
import ReactModal from 'react-modal'
import {Button, ProgressBar} from 'react-bootstrap';
import DefinitionHelper from './DefinitionHelper'
import PhoneticWestHelper from '../util/PhoneticWestHelper.js'
import PhoneticEastHelper from '../util/PhoneticEastHelper.js'
import GoogleAd from './GoogleAd.js';
import RelatedTerms from './RelatedTerms'
import ReactGA from 'react-ga';

//search results items
class TodoItem extends React.Component {

  static propTypes = {
    todo: React.PropTypes.object.isRequired,
  }

  constructor () {
    super();
    this.state = {
      showModal: false
    };
    
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    ReactGA.initialize('UA-6312595-17');
  }


  render() {
    const todo = this.props.todo
    const idxEntry = this.props.idxEntry + 1

    if(!todo.dictionary_definition_obj.phonetic){
      todo.dictionary_definition_obj.phonetic = ''
    }
    if(!todo.dictionary_definition_obj.phonetic_west){
      todo.dictionary_definition_obj.phonetic_west = ''
    }

    var rows = [];
    rows.push(<EastDefinitionRow todo={todo}/>);
    rows.push(<WestDefinitionRow todo={todo}/>);

    //var contentDesc = "English Assyrian Translation " + todo.word + " " + todo.dictionary_definition_obj.definition_arr.join("\n").replace(/^ : /,"");
    var contentDesc = "Translate " + todo.word + " from English to Assyrian. " + todo.dictionary_definition_obj.east + " ( " + todo.dictionary_definition_obj.phonetic + " )";

    const percentConfidence = Math.round(this.props.todo.boost);
    const cf = (<DefinitionHelper arr={todo.dictionary_definition_obj.cf}/>);
    const seealso = (<DefinitionHelper arr={todo.dictionary_definition_obj.seealso}/>);
    const source = todo.dictionary_definition_obj.source;
    
    return (
      <div className='definition-item' onClick={this.renderDetail.bind(this)} id={idxEntry}>
      <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem">
      <meta itemprop="position" content={idxEntry} />
      <p className='definition'>{todo.dictionary_definition_obj.definition_arr.join("\n").replace(/^ : /,"")}</p>
      <span>{rows}</span>

     {this.getSEORenderer(this.props.idxEntry, contentDesc)}
     {this.getBadgeRenderer(todo.boost)} 
     
      <div className="definition"><span className="infoicon"><span className="tooltip">&#9432;<span className="tooltiptext">Sources :<br/> {source}</span></span></span></div>
      <div className="pos">{todo.dictionary_definition_obj.partofspeech}</div>
      
      <ReactModal 
           isOpen={this.state.showModal}
           contentLabel="onRequestClose Example"
           onRequestClose={this.handleCloseModal}
        >
        <p>Search term : {todo.word}</p>
        Definition: {todo.dictionary_definition_obj.definition_arr.join("\n").replace(/^ : /,"")}
        <p>Category: {todo.dictionary_definition_obj.partofspeech}</p>
          <p className='definition'>
          East: <span className="east">{todo.dictionary_definition_obj.east}</span>
          <span className="phonetic">({PhoneticEastHelper(todo.dictionary_definition_obj.phonetic)})</span>
        </p>
        <p className='definition'>
          West: <span className="west">{todo.dictionary_definition_obj.west}</span>
          <span className="phonetic">({PhoneticWestHelper(todo.dictionary_definition_obj.phonetic_west)})</span>
        </p>
        
        <p className='definition'>
          Cross References: {cf}
        </p>
        <p>
          <ul>
        <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem">Source : {todo.dictionary_definition_obj.source}</li>
      <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem">Dialect : {todo.dictionary_definition_obj.dialect}</li>
      <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem">Origins : {todo.dictionary_definition_obj.origins}</li>
      <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem">See Also : {seealso}</li>
      <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem">Root : {todo.dictionary_definition_obj.root}</li>
      <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem">Semantics : {todo.dictionary_definition_obj.semantics}</li>
      </ul>
        </p>
        <p>
        <span><a href={"/searchkey/"+this.props.todo.searchkeynum}>More Info</a></span>
        </p>
        <GoogleAd 
      client="ca-pub-4439019971526085" 
      slot="9718385117" 
      format="auto" 
    />
    <div className="posnormal">
     Related Searches
     </div>
     <div className="tagcloudmodal">
    <RelatedTerms searchkeynum={todo.searchkeynum}/>
    </div>
        <div className="pos">
        <Button onClick={this.handleCloseModal} bsStyle="primary">Close</Button>
        </div>
        </ReactModal>
        </li>
      </div>
    )
  
  }

  getBadgeRenderer(boostValue){
    if(boostValue == 100){
     return (
     <div className='verifyBadge'>
      {/*<link rel="stylesheet" type="text/css" href='https://cdnjs.cloudflare.com/ajax/libs/uikit/2.27.2/css/uikit.min.css' />*/}
      <span className="tooltip"><Badge notification context='success'>Verified definition</Badge><span className="tooltiptext">This definition was verified by a language expert</span></span></div>
     )
    }
  }

  getSEORenderer(resultIndex, contentDesc){
    if(resultIndex==0){
      return (
            <Helmet
    meta={[
        {"property": "description", "content": contentDesc},
        {"property": "og:description", "content": contentDesc}
    ]}
      />)
    }
  }

  onDelete() {
    ParseReact.Mutation.Destroy(this.props.todo).dispatch()
  }

  onChangeState() {
    ParseReact.Mutation.Set(this.props.todo, {
      done: !this.props.todo.done,
    }).dispatch()
  }

  renderDetail() {
    //console.log('in render detail')
    const todo = this.props.todo
    if (!todo) { 
      //console.log('empty search result')
      return false 
    }
    
    //console.log('about to call return for TodoDetail')
    //return <TodoDetail todo={todo} />
    this.handleOpenModal();
  }

  handleOpenModal () {
    this.setState({ showModal: true });
    ReactGA.modalview('/word/'+this.props.todo.word+'/searchkey/'+this.props.todo.dictionary_definition_obj.searchkeynum);
  }
  
  handleCloseModal () {
    this.setState({ showModal: false });
  }
}

export default TodoItem

class EastDefinitionRow extends React.Component {
  render() {
    const todo = this.props.todo
    var phonetic = '';
    if(todo.dictionary_definition_obj.phonetic){
      phonetic = '('+PhoneticEastHelper(todo.dictionary_definition_obj.phonetic)+')';
    }

    if(todo.dictionary_definition_obj.audio){
      var audioFile = todo.dictionary_definition_obj.audio;
      if(!audioFile.includes('http')){
        audioFile = 'http://assyrianlanguages.org/sureth/' +  todo.dictionary_definition_obj.audio;
      }
      
      return (
        <div data-key={todo.dictionary_definition_obj.searchkeynum}  data-id={todo.dictionary_definition_obj.objectId} itemprop="name">
          <span className="definition"><span className="tooltip">east <span className="tooltiptext">Eastern Dialect</span></span></span>
          <span className="east">{todo.dictionary_definition_obj.east}</span>
          <span className="phonetic">{phonetic}</span>
          <span><ReactAudioPlayer src={audioFile}/></span>
        </div>
      );
    }else {
      return (
        <div data-key={todo.dictionary_definition_obj.searchkeynum}  data-id={todo.dictionary_definition_obj.objectId}>
        <span className="definition"><span className="tooltip">east <span className="tooltiptext">Eastern Dialect</span></span></span>
        <span className="east">{todo.dictionary_definition_obj.east}</span>
        <span className="phonetic">{phonetic}</span>
        </div>
      );
    }
  }
}

class WestDefinitionRow extends React.Component {
  render() {
    const todo = this.props.todo
    var westernUnicode = todo.dictionary_definition_obj.west_western
    if(!westernUnicode){
      westernUnicode = todo.dictionary_definition_obj.west
    }

    var phonetic = '';
    if(todo.dictionary_definition_obj.phonetic_west){
      phonetic = '('+PhoneticWestHelper(todo.dictionary_definition_obj.phonetic_west)+')';
    }
    
    

    if(todo.dictionary_definition_obj.audio_west){
      var audioFile = todo.dictionary_definition_obj.audio_west
      return (
        <div data-key={todo.dictionary_definition_obj.searchkeynum}  data-id={todo.dictionary_definition_obj.objectId}>
        <span className="definition"><span className="tooltip">west <span className="tooltiptext">Western Dialect</span></span></span>
          <span className="west">{westernUnicode}</span>
          <span className="phonetic">{phonetic}</span>
          <span><ReactAudioPlayer
          src={audioFile}
        /></span>
        </div>
      );
    }else {
      return (
        <div data-key={todo.dictionary_definition_obj.searchkeynum} data-id={todo.dictionary_definition_obj.objectId}>
        <span className="definition"><span className="tooltip">west <span className="tooltiptext">Western Dialect</span></span></span>
          <span className="west">{westernUnicode}</span>
          <span className="phonetic">{phonetic}</span>
        </div>
      );
    }

  }
}