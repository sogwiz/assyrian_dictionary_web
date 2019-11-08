import React from 'react'
import { Button, ButtonGroup, ButtonToolbar, Carousel, Col, ControlLabel, Form, FormControl, FormGroup, Grid, Jumbotron, ListGroup, ListGroupItem, MenuItem, Nav, NavItem, NavDropdown, PageHeader, Panel, Row, Tab, Tabs, Tooltip, OverlayTrigger } from 'react-bootstrap'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FinanceTable from './FinanceTable.js';

class Thanks extends React.Component {
  

    constructor(props) {
        super(props);

        console.log(this.props.location.query) //TODO: query is deprecated in router v4
        if(this.props.location.query){
          this.state = {
            value: this.props.location.query.q,
            email: ''
        }
        }else {
          this.state = {
            value: '',
            email: ''
        }
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);

    }

    handleChange(e) {
        this.setState({ value: e.target.value });
      }

      handleChangeEmail(e) {
        this.setState({ email: e.target.value });
      }

    

    render(){

      const tooltip = (
        <Tooltip id="tooltip">
          <strong>Get notified</strong> when your translation request is fulfilled via our forum
        </Tooltip>
      );

      const tooltipRequest = (
        <Tooltip id="tooltiprequest">
          <strong>Request a translation</strong> for a word or phrase you want added to sargonsays. This will be posted to our public google groups forum
        </Tooltip>
      );
       
        const submitForm = event => {

          console.log("submit form ")
          console.log(this.state.email)
            //this is to prevent the entire page from reloading on submit
            event.preventDefault()
            if(this.state.value.trim() == "")return;
          
            
          fetch('/api/word/request/'+this.state.value,
          {
            method:'POST', 
            body:JSON.stringify({email:this.state.email}),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function(response) {
          
            if(response.ok){
              toast("Thanks for submitting! Translation request has been posted to our forum")
            }else{
              response.text().then(text => toast.error("Error submitting translation. Please try again later. " + text))
            }
          }).then((response) => console.log(response))
                          
            //const input = this.state.value.toLowerCase().trim();
          }

        return (
            <div>
                {<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />}
                {<link rel="stylesheet" href="https://bootswatch.com/3/cosmo/bootstrap.min.css"/>}
                <br/>
                <Grid>
                <h1 className='title'>Thank you!</h1>
                <br/><br/>
                <h3>Your contribution will go towards the health and integrity of the dictionary so that others can use it for generations to come.</h3>
            
            <h3>My grant to you</h3>
            <p>Please enter a word, phrase, name, anything really that you want translated into Assyrian! We'll do our best to ensure it makes it's way into the dictionary. Include your email address and we'll notify you when the entry is added via our <a href="https://groups.google.com/forum/#!forum/assyrian-app-dictionary" target="_blank">Google Groups Forum</a></p>
            <Form onSubmit={submitForm} horizontal>
            <FormGroup controlId="formHorizontalWord">
            <OverlayTrigger placement="top" overlay={tooltipRequest}>
    <Col componentClass={ControlLabel} sm={2}>
      Request Word
    </Col>
    </OverlayTrigger>
    <Col sm={10}>
            <FormControl
              type="text"
              label="inputfield"
              placeholder="Enter text"
              value={this.state.value}
              onChange={this.handleChange}
            />
            </Col>
            </FormGroup>
            <FormGroup controlId="formHorizontalEmail">
            <OverlayTrigger placement="top" overlay={tooltip}>
    <Col componentClass={ControlLabel} sm={2}>
      Email
    </Col>
    </OverlayTrigger>
    <Col sm={10}>
      <FormControl type="email" value={this.state.email} onChange={this.handleChangeEmail} placeholder="Email" />
    </Col>
  </FormGroup>

  <FormGroup>
    <Col smOffset={2} sm={10}>
    <OverlayTrigger placement="top" overlay={tooltipRequest}>
           <Button type="submit">Submit</Button>
           </OverlayTrigger>
           </Col>
  </FormGroup>
            </Form>
            
            </Grid>
            <br/>
            <FinanceTable/>
            </div>
        )
    }

}

export default Thanks