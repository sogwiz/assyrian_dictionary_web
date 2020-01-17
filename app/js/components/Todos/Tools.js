import React, { useState } from 'react'
import { Col, Grid, Nav, NavItem, Row, Tab } from 'react-bootstrap';
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
          <Tab.Container id="tabs-with-dropdown" activeKey={this.state.key} onSelect={this.handleSelect.bind(this)}>
            <Row className="clearfix">
              <Col sm={12}>
                <Nav bsStyle="tabs">
                  <NavItem eventKey={1}>
                    Root Words
          </NavItem>
                  <NavItem eventKey={2}>
                    Suggest Changes
          </NavItem>
                </Nav>
              </Col>
              <Col sm={12}>
                <Tab.Content animation>
                  <Tab.Pane eventKey={1}>
                    <Col>
                    {derivedWordsGraph}
                   </Col>
                    <Col>
                    <RootWords handleToUpdate = {this.handleToUpdate.bind(this)}/>
                   </Col>
                  </Tab.Pane>
                  <Tab.Pane eventKey={2}>
                    <Thanks />
                  </Tab.Pane>
                </Tab.Content>
              </Col>

            </Row>
          </Tab.Container>
        </Grid>
      </div>
    )
  }

}

export default Tools