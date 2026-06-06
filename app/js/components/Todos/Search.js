import Parse from 'parse'
import ParseReact from 'parse-react'
import React from 'react'
import { browserHistory } from 'react-router';
const ParseComponent = ParseReact.Component(React)
mixins: [ParseReact.Mixin]
import Autosuggest from 'react-autosuggest';
import _ from 'lodash'
import DefinitionsList from './DefinitionsList'
import TranslationResult from './TranslationResult'
import TranslationLoader from './TranslationLoader'
import TranslationTip from './TranslationTip'
import WordBreakdown from './WordBreakdown'

// Mirrors STOP_WORDS in devServer.js so the early per-word breakdown we render
// while the LLM is in flight matches what the backend ultimately returns.
const STOP_WORDS = new Set(['a','an','the','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','must','shall','can','need','dare','ought','used','to','of','in','for','on','with','at','by','from','as','into','through','during','before','after','above','below','between','under','again','further','then','once','and','but','or','nor','so','yet','both','either','neither','not','only','own','same','than','too','very','just','also']);
import TodoDetail from './TodoDetail'
import SearchTerm from './SearchTerm'
import Doodle from './widgets/Doodle'
import GoogleAd from './GoogleAd'
import Badge from 'react-uikit-badge';
import ReactTooltip from 'react-tooltip'
import RelatedSearches from './RelatedSearches'
import Dropdown from 'react-dropdown';
import ReactGA from 'react-ga';
import { isSupporterUnlocked } from '../../utils/supporter';
// import 'react-dropdown/style.css';
//import Select from 'react-select';

const languages = [
  {
    name: 'C',
    year: 1972
  },
  {
    name: 'Elm',
    year: 2012
  },
]

// Teach Autosuggest how to calculate suggestions for any given input value.
/*
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : languages.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};
*/

function getSuggestionValue(suggestion) {
  console.log(suggestion);
  return suggestion;
}

function renderSuggestion(suggestion) {
  console.log(suggestion);
  return (
    <span>{suggestion}</span>
  );
}

class Search extends React.Component {
  updateCount = 0;
  searchParam = null;
  searchTerm = new String();

  constructor(props) {
    super(props);
    this.updateCount = 0;
    this.searchTerm = new String();
    console.log('in constructor ');

    this.state = {
      value: '',
      suggestions: [],
      isLoading: false,
      isSearching: false,
      isTranslating: false,
      isLlmLoading: false,
      translationResult: null,
      phraseMatch: null,
      wordBreakdown: null,
      translationText: '',
      data: [],
      searchQuery: '',
      eastfont: localStorage.getItem('eastfont') || 'east',
      westfont: localStorage.getItem('westfont') || 'west'
    };

    this.lastRequestId = null;

    if (this.props.params.searchTerm) {
      console.log('search url parameter exists in url : ' + this.props.params.searchTerm);

      this.onSearchFromUrl();
    } else {
      console.log('no search url param');
    }

  }



  /*
    render() {
      console.log('rendering search ')
    return (
        <div className='todos'>
          <h1 className='title'>English to Assyrian Dictionary</h1>
          <div id='search'>
            <div className='search-container'>
              <input type='text' ref={(searchInput) => { this.textInput = searchInput; }} placeholder='Search' onKeyUp={(e) => this.onKeyUp(e)}/>
              <button className='submit search' onClick={this.onSearch.bind(this)}>Search</button>
            </div>
          </div>
          <DefinitionsList todos={this.data.todos}/>
          {this.renderDetail()}
        </div>
      )
  }*/

  getQuote() {
    var quotes = [
      "When we lose a language, we lose the worldview, culture and knowledge of the people who spoke it, constituting a loss to all humanity",
      "Assyrian King Ashurbanipal created the oldest surviving royal library. He collected thousands of cuneiform tablets, from letters and legal texts to myths and legends",
      "Every language in some sense is an ecosystem of ideas, a watershed of thought, an old growth forest of the mind",
      "Now a language is not just a body of vocabulary or a set of grammatical rules, it’s a flash of the human spirit. It’s a vehicle for which the soul of a culture comes through to the material world",
      "a central aspect of any culture’s existence as a coherent entity is the fact of its having its own language",
      "Languages, however, are variations on a worldwide, cross-cultural perception of this thing called life",
      "In other cultures, their art and music is tied into their language so deeply that it can’t be explained, described, or performed accurately without the native tongue",
      "languages are conduits of human heritage. ... so language itself is often the only way to convey a community’s songs, stories and poems",
      "The Iliad was an oral story before it was written, as was The Odyssey. “How many other traditions are out there in the world that we’ll never know about because no-one recorded them before the language disappeared?”"
    ]
    var item = quotes[Math.floor(Math.random()*quotes.length)];
    return item;
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  shouldRenderSuggestions(value) {
    return value.trim().length >= 2;
  }

  loadSuggestions(value) {

    // Cancel the previous request
    if (this.lastRequestId !== null) {
      clearTimeout(this.lastRequestId);
    }

    this.setState({
      isLoading: true
    });


    // Fake request
    this.lastRequestId = setTimeout(() => {
      const that = this;
      fetch('/api/autosuggest/' + value.toLowerCase().trim())
                    .then((response) => response.json())
                    .then (results => {
                        that.setState({
                            isLoading: false,
                            suggestions: [...new Set(results.map(item => item['word']))],
                        })
                    })
                    .catch((error) => {
                        that.setState({
                            isLoading: false,
                            suggestions: [...new Set(results.map(item => item['word']))]
                        })
                      })
    }, 1000);
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.loadSuggestions(value);
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  textInput = autosuggest => {
    if (autosuggest != null) {
      this.input = autosuggest.input;
    }
  };


  // Searches for these terms signal intent to translate a phrase — surface the
  // feature via a tip on the dictionary results.
  isTranslateQuery() {
    var q = (this.state.searchQuery || '').toLowerCase().trim();
    return ['translate', 'translator', 'translation', 'translations', 'translating'].indexOf(q) !== -1;
  }

  onTryTranslationExample = (example) => {
    this.setState({ value: example });
    this.onSearch(example);
  };

  renderResults(eastfont, westfont) {
    // If we have either a dictionary phrase match or an LLM translation, render
    // the result component — even if the LLM call is still in flight. The phrase
    // match (when present) gives the user an authoritative answer immediately
    // while the LLM fills in below.
    if (this.state.translationResult || this.state.phraseMatch) {
      return (
        <TranslationResult
          result={this.state.translationResult || { text: this.state.translationText, translations: [], wordResults: this.state.wordBreakdown || [] }}
          phraseMatch={this.state.phraseMatch}
          isLlmLoading={this.state.isLlmLoading}
          eastfont={eastfont}
        />
      );
    }
    // While the LLM is loading and we have nothing else yet, show the animated
    // loader followed by the per-word breakdown (streaming in as each lookup
    // returns) so the user has something to read instead of just a spinner.
    if (this.state.isTranslating) {
      return (
        <div>
          <TranslationLoader text={this.state.translationText} />
          <WordBreakdown wordResults={this.state.wordBreakdown || []} eastfont={eastfont} />
        </div>
      );
    }
    return (
      <div>
        {this.isTranslateQuery() && (
          <TranslationTip searchTerm={this.state.searchQuery} onTry={this.onTryTranslationExample} />
        )}
        <DefinitionsList
          todos={this.state.data}
          searchTerm={this.state.searchQuery}
          eastfont={eastfont}
          westfont={westfont}
        />
      </div>
    );
  }

  render() {
    const { value, suggestions } = this.state;
    // Autosuggest will pass through all these props to the input element.
    const inputProps = {
      placeholder: 'Search in English or Assyrian',
      value,
      onChange: this.onChange,
      onKeyDown: this.onKeyUp.bind(this)
    };

    var quote = this.getQuote();

    const state = JSON.stringify(this.state);
    const eastfont = this.state.eastfont;
    const westfont = this.state.westfont;

    const tooltipSupport = (
      <ReactTooltip id='happyFace' type='info'>
            <span>Keep Assyrian Alive</span>
            <ul>
              <li>$2.99/month contribution</li>
              <li>Help preserve the Assyrian language!</li>
              <li>Cancel at any time</li>
            </ul>
          </ReactTooltip>
    );

    const options = [
      {type:'group', name:'Font', items:[
        {value: 'east', label:'East Syriac Adiabene - ܣܘܼܪܝܼܬ݂', className: 'east'},
        {value: 'east-syriac-qasha', label: 'East Syriac Qasha - ܣܘܼܪܝܼܬ݂', className: 'east-syriac-qasha'},
        {value: 'estrangelo-antioch', label: 'Estrangelo Antioch - ܣܘܼܪܝܼܬ݂', className: 'estrangelo-antioch'},
        {value: 'estrangelo-midyat', label: 'Estrangelo Midyat - ܣܘܼܪܝܼܬ݂', className: 'estrangelo-midyat'},
        {value: 'estrangelo-nisibin', label: 'Estrangelo Nisibin - ܣܘܼܪܝܼܬ݂', className: 'estrangelo-nisibin'}
      ]
    }
      
    ];
    if ( (this.state.data && this.state.data.length > 0)||(this.props.params.searchTerm)||this.state.isTranslating||this.state.translationResult||this.state.phraseMatch ) {

      return (

        <div className='todos'>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
          <link rel="stylesheet" href="https://bootswatch.com/3/cosmo/bootstrap.min.css" />

          <h1 className='title'>English to Assyrian Dictionary</h1>
          <div id='search'>

            <div className='search-container'>
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                shouldRenderSuggestions={this.shouldRenderSuggestions}
                onSuggestionSelected={this.onSuggestionSelected.bind(this)}
                inputProps={inputProps}
                ref={this.textInput}
              />
              <button className='submit search' onClick={this.onSearchFromSearchBar.bind(this)}>Search</button>
              {!isSupporterUnlocked() && tooltipSupport}
              {!isSupporterUnlocked() && <a href="https://sargonsays.memberful.com/checkout?plan=146420" data-tip data-for='happyFace'><button>&#9825; Keep Assyrian Alive</button></a>}
              <br/><br/>
              <Dropdown options={options} onChange={this.onChangeFont.bind(this)} value={eastfont} placeholder="Select a font" />
              <div className='todos'>{this.renderResults(eastfont, westfont)}</div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className='todos'>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
          <link rel="stylesheet" href="https://bootswatch.com/4/cosmo/bootstrap.min.css" />
          <h1 className='title'>English to Assyrian Dictionary</h1>
          <div id='search'>

            <div className='search-container'>
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                shouldRenderSuggestions={this.shouldRenderSuggestions}
                onSuggestionSelected={this.onSuggestionSelected.bind(this)}
                ref={this.textInput}
              />
              <button className='submit search' id="btnSearch" onClick={this.onSearchFromSearchBar.bind(this)}>Search</button>
              {!isSupporterUnlocked() && tooltipSupport}
              {!isSupporterUnlocked() && <a href="https://sargonsays.memberful.com/checkout?plan=146420" data-tip data-for='happyFace'><button>&#9825; Keep Assyrian Alive</button></a>}
            </div>
            <br/>
            <br/>
            <div className='verifyBadge'>
      <Badge notification context='success' data-tip="" data-for="test"><div className="todo-quote">keep the Assyrian language alive</div></Badge>
      <ReactTooltip place="bottom" className='extraClass' delayHide={500} delayShow={100} id='test' html={true} event="mouseenter" eventOff="mouseleave" getContent={() => { return this.getQuote() }}/>
      </div>
          
          </div>
        </div>
      )
    }
  }

  renderDetail() {
    //if (!this.props.params.todoId || this.data.todos.length === 0) { return false }
    if (!this.props.params.indexEntry || this.data.todos.length === 0) { return false }
    //const todo = _.find(this.data.todos, {objectId: this.props.params.todoId})
    console.log('idxEntry is ' + this.props.params.indexEntry);
    const todo = this.data.todos[this.props.params.indexEntry - 1];
    if (!todo) { return false }
    return <TodoDetail todo={todo} />
  }

  onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
    const input = suggestionValue.toLowerCase().trim();
    this.onSearch(input);
  }

  onSearchFromUrl() {
    const input = this.props.params.searchTerm.toLowerCase().trim();
    this.onSearch(input);
  }

  onSearchFromSearchBar() {
    const input = this.state.value.toLowerCase().trim();
    this.onSearch(input);

  }

  onChangeFont(option){
      
      localStorage.setItem("eastfont",option.value)
      this.setState({
        eastfont:option.value
      })  

      ReactGA.event({
        category: 'User',
        action: 'fontselect',
        label: option.value
      });
    
  }

  onSearch(inputVal) {
    this.updateCount = 0;
    console.log('onSearch');
    //this.props.router.push('/' + this.textInput.value)
    const input = inputVal;
    browserHistory.push('/word/' + input);
    this.props.params.searchTerm = input;


    if (this.state.searchQuery == input) {
      //in the match scenario, the search / render only happens twice instead
      //of 3x. so we need to do something to change it
      console.log('match');
      return;
    }

    /*
    * Got rid of this on 11/24/2017 because console warning that
    * setstate Can only update a mounted or mounting component
    this.setState({
      isSearching: true,
      seachQuery: this.state.value,
      searchTime: new Date().getTime(),
    });
    */

    const that = this;

    // Branch: 4+ word inputs go to the LLM translation flow, shorter ones
    // use the existing single-word dictionary search.
    const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 3) {
      this.runTranslation(input);
      return;
    }

    console.log('query word ' + input)
    Parse.Cloud.run('searchStats', { word: input.toLowerCase().trim() });
    /*
    const query = new Parse.Query('DictionaryWordDefinitionList')
    query.equalTo('word', input.toLowerCase().trim())
      .include('dictionary_definition_obj')
      .limit(50)
      .descending('boost')*/


      fetch('/api/word/search/'+input.toLowerCase().trim())
                 .then((response) => response.json())
                 .then (results => {
                     that.setState({
                      isSearching: false,
                      isTranslating: false,
                      isLlmLoading: false,
                      translationResult: null,
                      phraseMatch: null,
                      wordBreakdown: null,
                      searchQuery : input,

                       data: [...new Set(results.map(item => item))],
                     })
                 })
                 .catch(error => this.setState({ error:true,
                  errorObj:error,
                  isSearching: false,
                  data: []
                 }));
    



       /*
    query.find({
      success: function (results) {
        that.setState({
          isSearching: false,
          searchQuery : input,
          data: [...new Set(results.map(item => item.toJSON()))],
        })
      },
      error: function (error) {
        that.setState({
          isSearching: false,
          error: true,
          errorObj: error,
          data: []
        })
      }
    })
    */
  }

  runTranslation(input) {
    const that = this;

    // Pre-compute the lookup words so we can render placeholder slots in the
    // word-by-word breakdown immediately (each filled in as its fetch returns).
    const allWords = input.trim().split(/\s+/).map(function(w) { return w.toLowerCase(); }).filter(Boolean);
    const lookupWords = allWords.filter(function(w) { return !STOP_WORDS.has(w); });
    const initialBreakdown = lookupWords.map(function(w) {
      return { word: w, results: [], loading: true };
    });

    // Start with the animated loader; both fetches below clear it as soon as
    // either one returns a result the user can read.
    this.setState({
      isTranslating: true,
      isLlmLoading: true,
      translationResult: null,
      phraseMatch: null,
      wordBreakdown: initialBreakdown,
      translationText: input,
      data: [],
      searchQuery: input
    });

    var wordCount = input.trim().split(/\s+/).filter(Boolean).length;
    ReactGA.event({
      category: 'Translation',
      action: 'translate',
      label: input,
      value: wordCount
    });

    // Per-word dictionary lookups stream in alongside the LLM call so the user
    // sees the word-by-word breakdown almost immediately (these endpoints are
    // Redis-cached, so common words return in tens of ms). When the LLM call
    // completes it replaces this with its own wordResults of the same shape.
    lookupWords.forEach(function(word, idx) {
      fetch('/api/word/search/' + encodeURIComponent(word))
        .then(function(r) { return r.json(); })
        .then(function(results) {
          var slice = Array.isArray(results) ? results.slice(0, 3) : [];
          that.setState(function(prev) {
            if (prev.translationText !== input) return null; // search changed
            if (!prev.wordBreakdown) return null;
            var updated = prev.wordBreakdown.slice();
            updated[idx] = { word: word, results: slice, loading: false };
            return { wordBreakdown: updated };
          });
        })
        .catch(function() {
          that.setState(function(prev) {
            if (prev.translationText !== input) return null;
            if (!prev.wordBreakdown) return null;
            var updated = prev.wordBreakdown.slice();
            updated[idx] = { word: word, results: [], loading: false };
            return { wordBreakdown: updated };
          });
        });
    });

    // Dictionary phrase lookup runs in parallel with the LLM call. Most phrases
    // won't match (only ~a handful of curated entries like "water under the
    // bridge"), but when they do we want to surface the authoritative result
    // immediately instead of making the user wait for the LLM.
    fetch('/api/word/search/' + encodeURIComponent(input.toLowerCase().trim()))
      .then((response) => response.json())
      .then((results) => {
        if (Array.isArray(results) && results.length > 0) {
          ReactGA.event({ category: 'Translation', action: 'phrase_match', label: input, value: results.length });
          that.setState({
            phraseMatch: results,
            isTranslating: false // exit full loader; result is already useful
          });
        }
      })
      .catch(() => { /* silent — LLM path is still in flight */ });

    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input })
    })
      .then((response) => response.json())
      .then((result) => {
        // Track outcome so we can see the success/failure funnel in GA.
        if (result && result.error) {
          ReactGA.event({ category: 'Translation', action: 'translate_error', label: input });
        } else {
          ReactGA.event({
            category: 'Translation',
            action: 'translate_success',
            label: input,
            value: (result && result.translations) ? result.translations.length : 0
          });
        }
        that.setState({
          isTranslating: false,
          isLlmLoading: false,
          translationResult: result
        });
      })
      .catch((error) => {
        ReactGA.event({ category: 'Translation', action: 'translate_error', label: input });
        that.setState({
          isTranslating: false,
          isLlmLoading: false,
          translationResult: {
            text: input,
            translations: [],
            wordResults: [],
            error: 'Translation unavailable'
          }
        });
      });
  }


  onKeyUp(e) {

    if (e.keyCode === 13) {
      this.onSearchFromSearchBar();
      /*
      browserHistory.push('/word/' + this.textInput.value);

      this.props.params.searchTerm = this.textInput.value;

      if(this.searchTerm.valueOf() == this.textInput.value){
        console.log('match')
        return;
      }
      */
    }
  }



}

export default Search
