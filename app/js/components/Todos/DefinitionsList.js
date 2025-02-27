import React from 'react'
import TodoItem from './TodoItem.js'
import PropTypes from 'prop-types';
import Collapse, { Panel } from 'rc-collapse';
import 'rc-collapse/assets/index.css';
import Helmet from "react-helmet";
import GoogleAd from './GoogleAd.js';
import ReactGA from 'react-ga';
import RelatedSearches from './RelatedSearches.js'
import CollapseResults from './CollapseResults.js';

function displayNoSearchResults(searchTerm){
  var terms = searchTerm.split(" ")
  
  //user could be searching for a phrase translation
  var result = [];
  result.push(<strong>{searchTerm}</strong>)
  
  var helpStr = ". If searching for a phrase, you can try each individual word "
  var barStr = " | "
  if(terms.length > 1){
    result.push(helpStr)
    result.push(<br/>)
    for (var i = 0 ; i<terms.length; i++){
      var urlStr = "/word/" + terms[i]
      result.push(<a href={urlStr}>{terms[i]}</a>)
      result.push( barStr )
    }
    result.pop()
    result.push(<br/>)
    return result;
  }
  return searchTerm;
}

class DefinitionsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {accordion: true,
      activeKey: ['1']};
  }

  static propTypes = {
    todos: PropTypes.array,
  }

  static defaultProps = {
    todos: [],
  }

  toggle = (activeKey) => {
    this.setState({
      accordion: !this.state.accordion,
    });
    ReactGA.event({
      category: 'User',
      action: 'toggleRelatedWords',
      label: 'toggleRelated'
    });
  }

  onChange(activeKey) {
    this.setState({
      activeKey,
    });
  }

  render() {
const accordion = this.state.accordion;
const btn = accordion ? 'accordion' : 'collapse';
    const activeKey = this.state.activeKey;

    var gAd = (
      <div>
        <br/>
        <br/>
        <div>
    <GoogleAd 
          client="ca-pub-4439019971526085" 
          slot="9718385117" 
          format="auto" 
        /></div>
        </div>
    );

    if(this.props.todos.length==0){
      console.log('no search results for ' + this.props.searchTerm)
      const outputStr = displayNoSearchResults(this.props.searchTerm)
      const urlSuggest = "/suggest?q="+this.props.searchTerm
      return (
        <div>
        <p className='noresults'>No results found for {outputStr}. Have you tried the <a href='https://groups.google.com/forum/#!forum/assyrian-app-dictionary'
  target='_blank'>forum</a> or requested a <a href={urlSuggest}>translation suggestion</a>?</p>
    <RelatedSearches searchTerm={this.props.searchTerm}/>
    {gAd}
        </div>

      )
    }

//todo: do we need to change anything here when we're using the new search?
    const items = this.props.todos.map((todo, index) => {
      return <TodoItem key={todo.objectId} todo={todo} idxEntry={index} key={index} eastfont={this.props.eastfont} westfont={this.props.westfont}/>
    })

    const headerText = items.length-1 + " More Results";
    /*
    var collapse = (
  <Collapse accordion={this.state.accordion} onChange={this.toggle} >
    <Panel header={headerText} key='1'>
      {items.slice(1,items.length)}
    </Panel>
  </Collapse>
);*/

var titleText = "Online English Assyrian Dictionary : " + this.props.todos[0].word;
    return (
      <ol itemscope itemtype="http://schema.org/BreadcrumbList">
      <div className='definitions-list'>
        <Helmet title={titleText}>
          <meta name="description" content={titleText} />
          <meta property="og:description" content={titleText} />
        </Helmet>
      	{items[0]}
         <CollapseResults accordion={this.state.accordion} onChange={this.toggle} headerText={headerText} items={items} />
         <br/>
         <RelatedSearches searchTerm={this.props.searchTerm}/>
         {gAd}
      </div>
      </ol>
     

    )
  }
}

export default DefinitionsList
