import React from 'react'
import { Button, ButtonGroup, ButtonToolbar, Carousel, Col, Form, FormControl, Grid, Jumbotron, ListGroup, ListGroupItem, MenuItem, Nav, NavItem, NavDropdown, PageHeader, Panel, Row, Tab, Tabs, Tooltip, OverlayTrigger } from 'react-bootstrap'; 
class Thanks extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }

    render() {
        return (
            <div>
                {<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />}
                {<link rel="stylesheet" href="https://bootswatch.com/3/cosmo/bootstrap.min.css"/>}
                <br/>
                <Grid>
                <h1 className='title'>Thank you!</h1>
                <h3>Your contribution will go towards the health and integrity of the dictionary so that others can use it for generations to come.</h3>
                <h4>Included below are some of the service / hardware costs to keep sargonsays afloat</h4> 
            <ListGroup>
    <ListGroupItem bsStyle="success">$25.00 per month : Advertising Revenue on Google Adsense</ListGroupItem>
    <ListGroupItem bsStyle="warning">$00.00 per month : Software Development Time and Energy (20 hours a month)</ListGroupItem>
    <ListGroupItem bsStyle="danger">$25.00 per month : Cloud Hosting for web app on Microsoft Azure and domain on DreamHost</ListGroupItem>
    <ListGroupItem bsStyle="danger">$10.00 per month : Cloud Hosting on Nodechef for App Container ($4) and Database Server ($5)</ListGroupItem>
  </ListGroup>
            <h3>My grant to you</h3>
            <p>Please enter a word, phrase, name, anything really that you want translated into Assyrian! We'll do our best to ensure it makes it's way into the dictionary and we'll notify you if you include your email address</p>
            <Form>
            <FormControl
              type="text"
              label="inputfield"
              placeholder="Enter text"
            />
           <button type="submit">Submit</button>
            </Form>
            
            </Grid>
            </div>
        )
    }

    submitForm() {
        const input = this.state.value.toLowerCase().trim();
        console.log("searching for " + input)
    
      }

}

export default Thanks