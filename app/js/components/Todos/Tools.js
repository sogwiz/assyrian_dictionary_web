import React, { useState } from 'react'
import { Col, Container, Row, Tab, Tabs} from 'react-bootstrap';
import RootWords from './RootWords'
import Thanks from '../Thanks'
import DerivedWordsGraph from './widgets/DerivedWordsGraph';
import ReactGA from 'react-ga';
import Features from './widgets/Features'

class Tools extends React.Component {
  constructor(props) {
    super(props)
    var handleToUpdate  = this.handleToUpdate.bind(this);
    var defaultKey = window.location.pathname == '/roots' ? 1 : 0
    //this.props.eventKey == null || this.props.eventKey == 0 ? 0 : this.props.eventKey

    this.state = {
      key: defaultKey,
      root: null,
      derivedWords: null
    }

    this.getInitialRoot()
  }

  getInitialRoot(){
    const that = this
    fetch('/api/roots')
    .then((response) => response.json())
      .then(data => {
        that.handleToUpdate(data[0])
      })
  }

  handleToUpdate(rootWord) {
    console.log("in handleToUpdate")
    this.setState({
      root: rootWord,
      derivedWords:null
    })
    ReactGA.event({
      category: 'User',
      action: 'rootTreeIcon',
      label: rootWord['searchkeynum'].toString()
    });
  }

  handleSelect(eventkey) {
    //alert(`selected ${key}`);
    console.log("In handleSelect")
    this.setState({ key: eventkey });

    /*
    ReactGA.event({
      category: 'User',
      action: 'aboutTab',
      label: eventkey.toString()
    });
    */
  }

  queryDerivedTerms(){

    const that = this
    fetch('/api/derived/' + this.state.root['east'])
    .then((response) => response.json())
      .then(data => {
        that.setState({
          derivedWords: data
        })
      })

  }

  render() {
    if(this.state.root!=null){
      console.log("root not null")
      console.log(this.state.root)
      if(this.state.derivedWords==null){
        this.queryDerivedTerms()
      }
    }

    const derivedWordsGraph = this.state.derivedWords == null ? (<div />) : (
      <DerivedWordsGraph root={this.state.root} derivations={this.state.derivedWords} />
    )

    const divStyleOpacity = {
      opacity: '100',    
    };
    return (
      <div>
        <br/>
        <Container>
          <Tabs id="tabs-tools" animation={true} activeKey={this.state.key} onSelect={this.handleSelect.bind(this)}>     
                <Tab eventKey={0} title="Features" style={divStyleOpacity}>
                  <Features/>
                </Tab>
                  <Tab eventKey={1} title="Root Words" style={divStyleOpacity}>
                    <Row>
                    <Col md={6} mdPush={6}>
                    {derivedWordsGraph}
                    </Col>
                    <Col md={6} mdPull={6}>
                    <RootWords handleToUpdate = {this.handleToUpdate.bind(this)}/>
                    </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey={2} title="Suggest Changes" style={divStyleOpacity}>
                    <Thanks />
                  </Tab>

          </Tabs>
        </Container>
      </div>
    )
  }

}

export default Tools