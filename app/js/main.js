import React from 'react'
import Parse from 'parse'
import ReactDOM from 'react-dom'
//import { render } from 'react-snapshot';
import {Router, Route, IndexRoute, browserHistory} from 'react-router'

//const PARSE_APP_ID = 's6CWs4ntdmIZgrQ0MfDT02DgRKTp4q3InQHUA77U'
//const PARSE_JS_KEY = 'F9rFXoA9svREjJOfxoFedVUBdhqWQBOZtszuiEK4'

const PARSE_APP_ID = process.env.REACT_PARSE_APP_ID
const PARSE_JS_KEY = process.env.REACT_PARSE_JS_KEY

Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY)
Parse.serverURL = 'https://assyrian-433.nodechef.com/parse';

/* Routes components */
import App from './components/App'
import Login from './components/Login'
import Search from './components/Todos/Search'
import About from './components/About'
import Thanks from './components/Thanks'
import Librarian from './components/Todos/Librarian'
import Editor from './components/Todos/Editor'
import Trends from './components/Todos/Trends'
import TodoDetail from './components/Todos/TodoDetail'
import DefinitionHelper from './components/Todos/DefinitionHelper'
import Phrases from './components/Todos/Phrases'
import Proverbs from './components/Todos/Proverbs'

// Style
require('./../assets/styles/main.less')

const loginRequired = (nextState, replace) => {
  if (!Parse.User.current()) {
    replace('/login')
  }
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route component={App} path='/'>
      <IndexRoute component={Search}/>
      <Route path='/word/:searchTerm' component={Search}/>
      <Route path='/word/:searchTerm/:indexEntry' component={Search}/>
      <Route path='/searchkey/:searchkeynum' component ={TodoDetail} />
      <Route path='/about' component={About}/>
      <Route path='/trends' component={Trends}/>
      <Route path='/thanks' component={Thanks}/>
      <Route path='/phrases' component={Phrases}/>
      <Route path='/proverbs' component={Proverbs}/>
      <Route path="/support" component={About}/>
    </Route>
    <Route component={App} path='/admin/:searchTerm'>
      <Route path='/login' component={Login}/>
      <IndexRoute onEnter={loginRequired} component={Librarian}/>
      <Route path='/admin' component={Librarian}/>
      <Route path='/admin/:searchTerm' component={Librarian}/>
      <Route path='/admin/:searchTerm/edit' component={Editor}/>
    </Route>
  </Router>
), document.getElementById('app'))