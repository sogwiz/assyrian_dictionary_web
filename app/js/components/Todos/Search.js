import Parse from 'parse'
import ParseReact from 'parse-react'
import React from 'react'
import { browserHistory } from 'react-router';
const ParseComponent = ParseReact.Component(React)
mixins: [ParseReact.Mixin]
import Autosuggest from 'react-autosuggest';
import _ from 'lodash'
import DefinitionsList from './DefinitionsList'
import TodoDetail from './TodoDetail'
import SearchTerm from './SearchTerm'
import GoogleAd from './GoogleAd'
import Badge from 'react-uikit-badge';
import ReactTooltip from 'react-tooltip'
import RelatedSearches from './RelatedSearches'

const languages = [
  {
    name: 'C',
    year: 1972
  },
  {
    name: 'Elm',
    year: 2012
  },
];

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
      data: [],
      searchQuery: '',
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

    const tooltipSupport = (
      <ReactTooltip id='happyFace' type='info'>
            <span>Support sargonsays for $2/month</span>
            <ul>
              <li>$2/month contribution</li>
              <li>Help keep the online dictionary alive!</li>
              <li>Cancel at any time</li>
            </ul>
          </ReactTooltip>
    );

    if ( (this.state.data && this.state.data.length > 0)||(this.props.params.searchTerm) ) {

      return (

        <div className='todos'>

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
              {tooltipSupport}
              <a href="https://sargonsays.memberful.com/checkout?plan=23192" data-tip data-for='happyFace'><button>Support sargonsays</button></a>
              <div className='todos'><DefinitionsList todos={this.state.data} searchTerm={this.state.searchQuery}/></div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className='todos'>
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
              {tooltipSupport}
              <a href="https://sargonsays.memberful.com/checkout?plan=23192" data-tip data-for='happyFace'><button>Support sargonsays</button></a>
            </div>
            <br/>
            <br/>
            <div className='verifyBadge'>
      <Badge notification context='success' data-tip="" data-for="test"><div className="todo-quote">keep the Assyrian language alive</div></Badge>
      <ReactTooltip place="bottom" class='extraClass' delayHide={250} id='test' html={true} getContent={() => { return this.getQuote() }}/>
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
