import React from 'react'
import { Button, Col, Form, FormControl, FormGroup, Container, Tooltip, OverlayTrigger } from 'react-bootstrap'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FinanceTable from './FinanceTable.js';

class Thanks extends React.Component {
  
    constructor(props) {
        super(props);
        if(this.props.location && this.props.location.query && this.props.location.query.q){
          this.state = {
            value: this.props.location.query.q || '',
            email: '',
            showConfetti: true,
            submitted: false
        }
        }else {
          this.state = {
            value: '',
            email: '',
            showConfetti: true,
            submitted: false
        }
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    componentDidMount() {
        // Confetti animation runs for 3 seconds
        setTimeout(() => {
            this.setState({ showConfetti: false });
        }, 3000);
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    handleChangeEmail(e) {
        this.setState({ email: e.target.value });
    }

    submitForm(event) {
        console.log("submit form ")
        console.log(this.state.email)
        event.preventDefault()
        if(!this.state.value || this.state.value.trim() == "")return;
      
        this.setState({ submitted: true });
        
        fetch('/api/word/request/'+this.state.value,
        {
          method:'POST', 
          body:JSON.stringify({email:this.state.email}),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((response) => {
        
          if(response.ok){
            toast.success("Thanks for submitting! Translation request has been posted to our forum")
            // Reset form on success
            this.setState({ value: '', email: '', submitted: false });
          }else{
            response.text().then(text => toast.error("Error submitting translation. Please try again later. " + text))
            this.setState({ submitted: false });
          }
        }).catch((error) => {
          toast.error("Error submitting translation. Please try again later.")
          this.setState({ submitted: false });
        })
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

      // Generate confetti particles for surprise animation
      const confettiParticles = [];
      if (this.state.showConfetti) {
        for (let i = 0; i < 50; i++) {
          confettiParticles.push(
            <div key={i} className={`thanks-confetti thanks-confetti-${i % 5}`} 
                 style={{
                   left: `${Math.random() * 100}%`,
                   animationDelay: `${Math.random() * 2}s`,
                   animationDuration: `${2 + Math.random() * 2}s`
                 }}></div>
          );
        }
      }

      return (
          <div className="thanks-page">
              {<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />}
              {<link rel="stylesheet" href="https://bootswatch.com/3/cosmo/bootstrap.min.css"/>}
              
              {/* Confetti Animation Surprise */}
              {this.state.showConfetti && (
                <div className="thanks-confetti-container">
                  {confettiParticles}
                </div>
              )}

              <Container className="thanks-container">
                {/* Hero Section */}
                <div className="thanks-hero">
                  <div className="thanks-hero-icon">🎉</div>
                  <h1 className="thanks-title">Thank You!</h1>
                  <p className="thanks-subtitle">
                    Your contribution will go towards the health and integrity of the dictionary 
                    so that others can use it for generations to come.
                  </p>
                </div>

                {/* Request Form Card */}
                <div className="thanks-card">
                  <div className="thanks-card-header">
                    <h2 className="thanks-card-title">My Grant to You</h2>
                    <p className="thanks-card-description">
                      Please enter a word, phrase, name, anything really that you want translated into Assyrian! 
                      We'll do our best to ensure it makes it's way into the dictionary. Include your email address 
                      and we'll notify you when the entry is added via our{' '}
                      <a href="https://groups.google.com/forum/#!forum/assyrian-app-dictionary" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="thanks-link">
                        Google Groups Forum
                      </a>
                    </p>
                  </div>

                  <Form onSubmit={this.submitForm} className="thanks-form">
                    <FormGroup controlId="formHorizontalWord" className="thanks-form-group">
                      <OverlayTrigger placement="top" overlay={tooltipRequest}>
                        <label className="thanks-label">
                          Request Word
                        </label>
                      </OverlayTrigger>
                      <FormControl
                        type="text"
                        placeholder="Enter text to translate"
                        value={this.state.value}
                        onChange={this.handleChange}
                        className="thanks-input"
                        disabled={this.state.submitted}
                      />
                    </FormGroup>

                    <FormGroup controlId="formHorizontalEmail" className="thanks-form-group">
                      <OverlayTrigger placement="top" overlay={tooltip}>
                        <label className="thanks-label">
                          Email <span className="thanks-optional">(optional)</span>
                        </label>
                      </OverlayTrigger>
                      <FormControl 
                        type="email" 
                        value={this.state.email} 
                        onChange={this.handleChangeEmail} 
                        placeholder="your.email@example.com"
                        className="thanks-input"
                        disabled={this.state.submitted}
                      />
                    </FormGroup>

                    <div className="thanks-form-actions">
                      <OverlayTrigger placement="top" overlay={tooltipRequest}>
                        <Button 
                          variant="primary" 
                          type="submit" 
                          className="thanks-submit-btn"
                          disabled={this.state.submitted || !this.state.value || !this.state.value.trim()}
                        >
                          {this.state.submitted ? (
                            <React.Fragment>
                              <span className="thanks-spinner"></span>
                              Submitting...
                            </React.Fragment>
                          ) : (
                            'Submit Request'
                          )}
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </Form>
                </div>
                
                {/* Finance Table */}
                <div className="thanks-finance-section">
                  <FinanceTable/>
                </div>
              </Container>
          </div>
      )
    }
}

export default Thanks