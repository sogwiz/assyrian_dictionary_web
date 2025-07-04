import React from 'react'
import NavBar from './NavBar'
import MenuBurger from './MenuBurger'
import Footer from './Footer'
import Helmet from "react-helmet";
import { toast } from 'react-toastify';
import ReactGA from 'react-ga';

class App extends React.Component {

  render() {
    // Call it once in your app. At the root of your app is the best place
  toast.configure()
  if(location.hostname != "localhost"){
    ReactGA.initialize('UA-6312595-17');
  }
   
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
        <Footer><font color="#696969"> ܣܲܪܓܘܿܢ</font><font color="#696969"> says.</font>  <a href="/about"><font color="#FFFFFF">About</font></a> | <a href="/"><font color="#FFFFFF">Search</font></a> | <a href="/tools"><font color="#FFFFFF">Tools</font></a></Footer>
      </div>
    )
  }
}

export default App
