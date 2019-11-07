import React from 'react'
import NavBar from './NavBar'
import MenuBurger from './MenuBurger'
import Footer from './Footer.js'
import Helmet from "react-helmet";
import { toast } from 'react-toastify';
class App extends React.Component {

  render() {
    // Call it once in your app. At the root of your app is the best place
  toast.configure()
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
        <Footer><a href="/about">About</a> / <a href="/">Search</a></Footer>
      </div>
    )
  }
}

export default App
