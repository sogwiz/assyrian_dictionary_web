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
import DerivedWords from './widgets/DerivedWords'

//search results items
class TodoItem extends React.Component {
  partOfSpeech = null
  static propTypes = {
    todo: React.PropTypes.object.isRequired,
  }

  constructor () {
    super();
    this.state = {
      derivedWords: null,
      showModal: false
    };
    
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    ReactGA.initialize('UA-6312595-17');
    
  }

  /*
  componentDidMount(){
    console.log("before this.part of speech")
    console.log(this.props.todo)
    this.partOfSpeech = this.props.todo['definition']['partofspeech']
    console.log("after this.part of speech")

    if(this.partOfSpeech == "root"){

      this.queryKey()
    }
  }

  queryKey(){
    console.log("in query key")
    const that = this
    
    fetch('/api/derived/'+this.props.todo['definition']['east'])
      .then((response) => response.json())
      .then (data => {
        that.setState({
          derivedWords: data
        })
    })
  
  }
  */


  render() {
  
    const todo = this.props.todo
    
  
    const idxEntry = this.props.idxEntry + 1
    const dictionary_definition_obj = todo['definition']
    

    if(!dictionary_definition_obj.phonetic){
      dictionary_definition_obj.phonetic = ''
    }
    if(!dictionary_definition_obj.phonetic_west){
      dictionary_definition_obj.phonetic_west = ''
    }

    var rows = [];
    rows.push(<EastDefinitionRow todo={todo} font={this.props.eastfont} key={idxEntry+"e"}/>);
    rows.push(<WestDefinitionRow todo={todo} font={this.props.westfont} key={idxEntry+"w"}/>);

    //var contentDesc = "English Assyrian Translation " + todo.word + " " + dictionary_definition_obj.definition_arr.join("\n").replace(/^ : /,"");
    var contentDesc = "Translate " + todo.word + " from English to Assyrian. " + dictionary_definition_obj.east + " ( " + dictionary_definition_obj.phonetic + " )";

    const percentConfidence = Math.round(this.props.todo.boost);
    const cf = (<DefinitionHelper arr={dictionary_definition_obj.cf}/>);
    const seealso = (<DefinitionHelper arr={dictionary_definition_obj.seealso}/>);
    const source = dictionary_definition_obj.source;
    
    /*
    const derivedWords = this.state.derivedWords == null ? (<div></div>) : (
      <DerivedWords root={dictionary_definition_obj} derivations={this.state.derivedWords}/>
    )*/
    
    return (
      <div className='definition-item' onClick={this.renderDetail.bind(this)} id={idxEntry}>
      <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem">
      <meta itemprop="position" content={idxEntry} />
      <p className='definition'>{dictionary_definition_obj.definition_arr.join("\n").replace(/^ : /,"")}</p>
      <span>{rows}</span>

     {this.getSEORenderer(this.props.idxEntry, contentDesc)}
     {this.getBadgeRenderer(todo.boost)} 
     
      <div className="definition"><span className="infoicon"><span className="tooltip">&#9432;<span className="tooltiptext">Sources :<br/> {source}</span></span></span></div>
      <div className="pos">{dictionary_definition_obj.partofspeech}</div>
      
      <ReactModal 
           isOpen={this.state.showModal}
           contentLabel="onRequestClose Example"
           onRequestClose={this.handleCloseModal}
        >
        <p>Search term : {todo.word}</p>
        Definition: {dictionary_definition_obj.definition_arr.join("\n").replace(/^ : /,"")}
        <p>Category: {dictionary_definition_obj.partofspeech}</p>
          <p className='definition'>
          East: <span className={this.props.eastfont}>{dictionary_definition_obj.east}</span>
          <span className="phonetic">({PhoneticEastHelper(dictionary_definition_obj.phonetic)})</span>
        </p>
        <p className='definition'>
          West: <span className="west">{dictionary_definition_obj.west}</span>
          <span className="phonetic">({PhoneticWestHelper(dictionary_definition_obj.phonetic_west)})</span>
        </p>
        
        <p className='definition'>
          Cross References: {cf}
        </p>
        <p>
          <ul>
        <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem">Source : {dictionary_definition_obj.source}</li>
      <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem">Dialect : {dictionary_definition_obj.dialect}</li>
      <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem">Origins : {dictionary_definition_obj.origins}</li>
      <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem">See Also : {seealso}</li>
      <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem">Root : <span className={this.props.eastfont}><a href={'/word/' + dictionary_definition_obj.root}>{dictionary_definition_obj.root}</a></span></li>
      <li itemprop="itemListElement" itemscope
      itemtype="http://schema.org/ListItem">Semantics : {dictionary_definition_obj.semantics}</li>
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
    <br/>
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
    ReactGA.modalview('/word/'+this.props.todo.word+'/searchkey/'+this.props.todo.searchkeynum);
  }
  
  handleCloseModal () {
    this.setState({ showModal: false });
  }
}

export default TodoItem

class EastDefinitionRow extends React.Component {
  render() {
    const todo = this.props.todo
    const dictionary_definition_obj = todo['definition']
    var phonetic = '';
    if(dictionary_definition_obj.phonetic){
      phonetic = '('+PhoneticEastHelper(dictionary_definition_obj.phonetic)+')';
    }

    if(dictionary_definition_obj.audio){
      var audioFile = dictionary_definition_obj.audio;
      if(!audioFile.includes('http')){
        audioFile = 'http://assyrianlanguages.org/sureth/' +  dictionary_definition_obj.audio;
      }
      
      return (
        <div data-key={dictionary_definition_obj.searchkeynum}  data-id={dictionary_definition_obj.objectId} itemprop="name">
          <span className="definition"><span className="tooltip">east <span className="tooltiptext">Eastern Dialect</span></span></span>
          <span className={this.props.font}>{dictionary_definition_obj.east}</span>
          <span className="phonetic">{phonetic}</span>
          <span><ReactAudioPlayer src={audioFile}/></span>
        </div>
      );
    }else {
      return (
        <div data-key={dictionary_definition_obj.searchkeynum}  data-id={dictionary_definition_obj.objectId}>
        <span className="definition"><span className="tooltip">east <span className="tooltiptext">Eastern Dialect</span></span></span>
        <span className={this.props.font}>{dictionary_definition_obj.east}</span>
        <span className="phonetic">{phonetic}</span>
        </div>
      );
    }
  }
}

class WestDefinitionRow extends React.Component {
  render() {
    const todo = this.props.todo
    const dictionary_definition_obj = todo['definition']
    var westernUnicode = dictionary_definition_obj.west_western
    if(!westernUnicode){
      westernUnicode = dictionary_definition_obj.west
    }

    var phonetic = '';
    if(dictionary_definition_obj.phonetic_west){
      phonetic = '('+PhoneticWestHelper(dictionary_definition_obj.phonetic_west)+')';
    }
    
    

    if(dictionary_definition_obj.audio_west){
      var audioFile = dictionary_definition_obj.audio_west
      return (
        <div data-key={dictionary_definition_obj.searchkeynum}  data-id={dictionary_definition_obj.objectId}>
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
        <div data-key={dictionary_definition_obj.searchkeynum} data-id={dictionary_definition_obj.objectId}>
        <span className="definition"><span className="tooltip">west <span className="tooltiptext">Western Dialect</span></span></span>
          <span className="west">{westernUnicode}</span>
          <span className="phonetic">{phonetic}</span>
        </div>
      );
    }

  }
}
