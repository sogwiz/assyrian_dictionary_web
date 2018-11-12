import React from 'react'
import Parse from 'parse'
import ParseReact from 'parse-react'

class SearchTerm extends React.Component {

  render() {
    return (
      <div id='search'>
        <div className='search-container'>
        	<input type='text' ref='searchInput' placeholder='Search'onKeyUp={(e) => this.onKeyUp(e)}/>
        	<button className='submit search' onClick={this.onSearch.bind(this)}>Search</button>
      	</div>
      </div>
    )
  }

  onSearch() {
    const input = this.refs.searchInput

    if (input.value === '') { return }

    const query = new Parse.Query('DictionaryWordDefinitionList')
    query.limit(20)
    query.equalTo('word', input.value)
    query.descending('boost')

    /*
    ParseReact.Mutation.Create('Todo', {
      name: input.value,
      done: false,
      user: Parse.User.current().toPlainObject(),
    }).dispatch()

    input.value = ''
    */

  }

  onKeyUp(e) {
    if (e.keyCode === 13) {
      this.onSearch()
    }
  }
}

export default SearchTerm
