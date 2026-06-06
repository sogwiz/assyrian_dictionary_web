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

function splitWords(searchTerm) {
  return (searchTerm || '')
    .split(/\s+/)
    .map(function(w) { return w.toLowerCase().trim(); })
    .filter(Boolean);
}

class DefinitionsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      accordion: true,
      activeKey: ['1'],
      wordResults: null,        // { word: [results...] } once fetched
      wordResultsFor: null      // the searchTerm those results correspond to
    };
  }

  componentDidMount() {
    this.maybeFetchWordResults();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searchTerm !== this.props.searchTerm ||
        prevProps.todos !== this.props.todos) {
      this.maybeFetchWordResults();
    }
  }

  // When a multi-word phrase yields zero dictionary results, fetch the top
  // matches for each individual word in parallel so the user gets something
  // useful instead of just a "no results" message with links.
  maybeFetchWordResults() {
    const todos = this.props.todos || [];
    const term = this.props.searchTerm || '';
    const words = splitWords(term);

    if (todos.length > 0 || words.length < 2) {
      if (this.state.wordResults) this.setState({ wordResults: null, wordResultsFor: null });
      return;
    }
    if (this.state.wordResultsFor === term) return; // already fetched for this query

    this.setState({ wordResultsFor: term });

    const that = this;
    Promise.all(words.map(function(w) {
      return fetch('/api/word/search/' + encodeURIComponent(w))
        .then(function(r) { return r.json(); })
        .then(function(results) { return { word: w, results: Array.isArray(results) ? results.slice(0, 3) : [] }; })
        .catch(function() { return { word: w, results: [] }; });
    })).then(function(allResults) {
      if (that.state.wordResultsFor !== term) return; // search changed mid-flight
      that.setState({ wordResults: allResults });
    });
  }

  renderWordResult(wordResult) {
    const eastfont = this.props.eastfont || 'east';
    const results = wordResult.results || [];

    return (
      <div className='word-section' key={wordResult.word}>
        <div className='word-section-header'>
          <a href={'/word/' + wordResult.word} className='word-section-title'>
            {wordResult.word}
          </a>
          <span className='word-section-count'>
            {results.length > 0 ? results.length + ' match' + (results.length > 1 ? 'es' : '') : 'no match'}
          </span>
        </div>
        {results.length > 0 ? (
          <ul className='word-section-list'>
            {results.map((item, i) => {
              const def = (item && item.definition) || {};
              return (
                <li className='word-section-item' key={i}>
                  <span className={'word-east ' + eastfont}>{def.east}</span>
                  {def.phonetic && <span className='word-phonetic'>{def.phonetic}</span>}
                  {def.english_short && <span className='word-gloss'>{def.english_short}</span>}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className='word-section-empty'>No dictionary entry found</div>
        )}
      </div>
    );
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
      const urlSuggest = "/suggest?q="+this.props.searchTerm
      const words = splitWords(this.props.searchTerm);
      const isMultiWord = words.length > 1;
      const wordResults = this.state.wordResults;

      return (
        <div>
          <p className='noresults'>
            No results found for <strong>{this.props.searchTerm}</strong>.
            {!isMultiWord && (
              <span>
                {' '}Have you tried the <a href='https://groups.google.com/forum/#!forum/assyrian-app-dictionary' target='_blank'>forum</a> or requested a <a href={urlSuggest}>translation suggestion</a>?
              </span>
            )}
          </p>

          {isMultiWord && (
            <div className='word-breakdown'>
              <div className='word-breakdown-heading'>Word-by-word</div>
              {wordResults
                ? wordResults.map((wr) => this.renderWordResult(wr))
                : words.map((w) => (
                    <div className='word-section' key={w}>
                      <div className='word-section-header'>
                        <a href={'/word/' + w} className='word-section-title'>{w}</a>
                        <span className='word-section-count'>loading&hellip;</span>
                      </div>
                    </div>
                  ))}
            </div>
          )}

          {isMultiWord && (
            <p className='noresults'>
              Have you tried the <a href='https://groups.google.com/forum/#!forum/assyrian-app-dictionary' target='_blank'>forum</a> or requested a <a href={urlSuggest}>translation suggestion</a>?
            </p>
          )}

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
