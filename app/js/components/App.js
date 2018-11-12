import React from 'react'
import NavBar from './NavBar'
import MenuBurger from './MenuBurger'
import Helmet from "react-helmet";
class App extends React.Component {

  render() {
    return (
      <div>
      <Helmet
    meta={[
        {"name": "description", "content": "Online English Assyrian Dictionary. Search for any word in English and get Assyrian audio, script, and phonetic translations in both dialects. How to say words in Assyrian"},
        {"property": "og:description", "content": "Online English Assyrian Dictionary. Search for any word in English and get Assyrian audio, script, and phonetic translations in both dialects. How to say words in Assyrian"}
    ]}
      />
      <MenuBurger/>
        {this.props.children}
      </div>
    )
  }
}

export default App
