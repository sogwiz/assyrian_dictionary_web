import React from 'react'

//import { slide as Menu } from 'react-burger-menu'
import Menu from 'react-burger-menu/lib/menus/slide'

class MenuBurger extends React.Component {


    render() {
        return (
            <div id="outer-container" style={{height: '100%'}}>
        <Menu>
        <a id="home" className="menu-item" href="/">Search 🔎</a>
        <a id="about" className="menu-item" href="/about">About 📖</a>
        <a id="trends" className="menu-item" href="/trends">Trends 📊</a>
        <a id="phrases" className="menu-item" href="/phrases">Phrases 🗣</a>
        <a id="proverbs" className="menu-item" href="/proverbs">Proverbs 📜</a>
        <a id="support" className="menu-item" href="/support">Support ♥</a>
      </Menu>
      <main id="page-wrap">
          </main>
      </div>
      );
    }
}

export default MenuBurger