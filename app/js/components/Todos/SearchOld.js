import Parse from 'parse'
import ParseReact from 'parse-react'
import React from 'react'
import { browserHistory } from 'react-router';

const ParseComponent = ParseReact.Component(React)
mixins: [ParseReact.Mixin]

import _ from 'lodash'
import DefinitionsList from './DefinitionsList'
import TodoDetail from './TodoDetail'
import SearchTerm from './SearchTerm'

class SearchOld extends ParseComponent {
  updateCount = 0;
  searchParam = null;
  searchTerm = new String();

  constructor(props) {
    super(props);
    this.updateCount=0;
    this.searchTerm = new String();
    console.log('in constructor');

    if(this.props.params.searchTerm){
      //bad hack
      this.componentDidUpdate();
    }
  }

  observe() {
    console.log('url param ' + this.props.params.searchTerm);
    
    if(!this.textInput)
    {
      console.log('empty search Input');
    }
    const input = this.props.params.searchTerm; 

    if (!input || input === '') {
      console.log('empty input')
      return      
    }

    this.searchTerm = this.props.params.searchTerm;
    console.log('search term ' + this.searchTerm.toLowerCase());
    Parse.Cloud.run('searchStats', {word: this.searchTerm.toLowerCase()});
    const query = new Parse.Query('DictionaryWordDefinitionList')
    query.equalTo('word', input.toLowerCase().trim())
    query.include('dictionary_definition_obj')
    query.limit(25)
    // query.equalTo('user', Parse.User.current())
    query.descending('boost')
      return {
      todos: query,
    }
  }

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

  onSearch() {
    this.updateCount = 0;
    console.log('onSearch');
    //this.props.router.push('/' + this.textInput.value)
    
    browserHistory.push('/word/' + this.textInput.value);
    this.props.params.searchTerm = this.textInput.value;
    
    if(this.searchTerm.valueOf() == this.textInput.value){
      //in the match scenario, the search / render only happens twice instead
      //of 3x. so we need to do something to change it
      console.log('match')
      return;
    }

    
    this.setState({
      seachQuery : this.textInput,
      searchTime: new Date().getTime(),
    })
  }


  onKeyUp(e) {
    this.updateCount = 0;

    if (e.keyCode === 13) {
      //    this.props.router.push('/' + this.textInput.value)
      browserHistory.push('/word/' + this.textInput.value);

      this.props.params.searchTerm = this.textInput.value;

      if(this.searchTerm.valueOf() == this.textInput.value){
        console.log('match')
        return;
      }
      
      this.setState({
        seachQuery : this.textInput,
        searchTime: new Date().getTime(),
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
  // only update chart if the data has changed
      console.log('componentDidUpdate')
      //on the 3rd time this is called, reset it
      //i have NO idea why it is called 3 times
      if(this.updateCount ==2){
          this.updateCount = 0;
          console.log('sending')
          //store the query analytics but really only run it after we've rendered
          //Parse.Cloud.run('searchStats', {word: this.textInput.value.toLowerCase()});
      }else {
        this.updateCount += 1;
      }
}

}

//export default Search
