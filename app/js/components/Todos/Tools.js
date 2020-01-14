import React, { useState } from 'react'
import { Col, Grid, Nav, NavItem, Row, Tab } from 'react-bootstrap';
import RootWords from './RootWords'

class Tools extends React.Component {
    constructor(props) {
        super(props)
        var defaultKey = 1

        this.state = {
            key: defaultKey
        }
    }

    handleSelect(eventkey) {
        //alert(`selected ${key}`);
        console.log("In handleSelect")
        this.setState({ key : eventkey });
        
        /*
        ReactGA.event({
          category: 'User',
          action: 'aboutTab',
          label: eventkey.toString()
        });
        */
        
      }

    render(){
        return (
            <div>
                <Grid>
                <Tab.Container id="tabs-with-dropdown" activeKey={this.state.key} onSelect={this.handleSelect.bind(this)}>
    <Row className="clearfix">
      <Col sm={12}>
        <Nav bsStyle="tabs">
          <NavItem eventKey={1}>
            Roots
          </NavItem>
          <NavItem eventKey={2}>
            More Tools
          </NavItem>
          </Nav>
          </Col>
          <Col sm={12}>
        <Tab.Content animation>
          <Tab.Pane eventKey={1}>
                    <RootWords/>
            </Tab.Pane>
            <Tab.Pane eventKey={2}>
                    Coming Soon
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