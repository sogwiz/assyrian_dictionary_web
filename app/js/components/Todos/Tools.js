import React, { useState } from 'react'
import { Col, Grid, Row, Tab, Tabs} from 'react-bootstrap';
import RootWords from './RootWords'
import Thanks from '../Thanks'
import DerivedWordsGraph from './widgets/DerivedWordsGraph';
import ReactGA from 'react-ga';

class Tools extends React.Component {
  constructor(props) {
    super(props)
    var handleToUpdate  = this.handleToUpdate.bind(this);
    var defaultKey = this.props.eventKey == null || this.props.eventKey == 0 ? 1 : this.props.eventKey

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
    return (
      <div>
        <br/>
        <Grid>
          <Tabs id="tabs-tools" animation={true} activeKey={this.state.key} onSelect={this.handleSelect.bind(this)}>     
                
                  <Tab eventKey={1} title="Root Words">
                    <Row>
                    <Col md={6} mdPush={6}>
                    {derivedWordsGraph}
                    </Col>
                    <Col md={6} mdPull={6}>
                    <RootWords handleToUpdate = {this.handleToUpdate.bind(this)}/>
                    </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey={2} title="Suggest Changes">
                    <Thanks />
                  </Tab>

          </Tabs>
        </Grid>
      </div>
    )
  }

}

export default Tools