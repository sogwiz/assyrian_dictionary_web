import React from 'react'
import { browserHistory } from 'react-router';
import { Button, ButtonGroup, ButtonToolbar, Carousel, Col, Container, Image, Jumbotron, Nav, NavItem, NavDropdown, PageHeader, Panel, Popover, Row, Tab, Table, Tabs, Tooltip, OverlayTrigger, Thumbnail, PanelGroup } from 'react-bootstrap'; 
import ReactGA from 'react-ga';
import FinanceTable from './FinanceTable.js';
import Roadmap from './Roadmap.js';

class About extends React.Component {
  constructor(props) {
    super(props);

    var defaultKey = 1;
    if(this.props.location.pathname && this.props.location.pathname.includes("support")){
      console.log("success")
      defaultKey = 3;
    }

    this.state = {
        key: defaultKey
    };
  }

  handleSelect(eventkey) {
    //alert(`selected ${key}`);
    this.setState({ key : eventkey });
    ReactGA.event({
      category: 'User',
      action: 'aboutTab',
      label: eventkey.toString()
    });
    
  }

  handleMaybeButtonClick(){
    this.handleButtonClick('Maybe Later')
  }

  handleSuperHeroButtonClick(){
    this.handleButtonClick('Superhero')
  }

  handleHeroButtonClick(){
    this.handleButtonClick('Hero')
  }

  handleButtonClick(buttonLabel){
    ReactGA.event({
      category: 'User',
      action: 'buttonClick',
      label: buttonLabel
    });
  }

  render() {

    const tooltipOneTime = (
      <Tooltip id="tooltipOneTime">I want to <strong>preserve</strong> the Assyrian langauge by making a generous one time contribution so that individuals can learn Assyrian</Tooltip>
    );

    const tooltipRepeat = (
      <Tooltip id="tooltipRepeat">I want to <strong>keep the language alive</strong> on my shoulders, by making a commitment to preserve the Assyrian language via supporting this online dictionary</Tooltip>
    );

    const wellStyles = { maxWidth: 500, margin: '0 auto 10px' };

    const popoverBottom = (
      <Popover id="popover-positioned-bottom">
        <Popover.Title as="h3">Thank you</Popover.Title>
        <Popover.Content>
        <strong>Holy dolma!</strong> Thank you for considering the Maybe Later option. Here's how to say <a href="/word/maybe">maybe</a> and <a href="/word/later">later</a> and <a href="/word/birthday">birthday</a> in Assyrian
        </Popover.Content>
      </Popover>
    );

    const popoverLamassu = (
      <Popover id="popover-lamassu">
        <Popover.Title as="h3">Lamassu #superhero</Popover.Title>
        <Popover.Content>
        The lamassu, or shedu, encompasses all life within it. They first appeared in the Sumerian epic of Gilgamesh as physical entities in the lands. 
        The eventual evolution of the lamassu across the Assyrian and Akkadian empires led to its widespread use in entrances as a protective deity, often two lamassu would flank an entrance to a city or state building. Here's how to say <a href="/word/lamassu">lamassu</a> and <a href="/word/shedu">shedu</a> in Assyrian
        </Popover.Content>        
      </Popover>
    );

    const divStyleOpacity = {
      opacity: '100',    
    };

    return (
      
      <div>
        {<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />}
        {<link rel="stylesheet" href="https://bootswatch.com/3/cosmo/bootstrap.min.css"/>}
        
        <Container>
          <br/>
        <h1 className='title'>About SargonSays</h1>
        <h4>Hello, I'm Sargon.</h4> 
        I wanted an easy to use Assyrian Sureth dictionary with high fidelity search results. Quality is important. To read more about the design technology that powers this dictionary, check out my <a href="http://sogwiz.blogspot.com/2016/12/english-to-assyrian-dictionary.html" target='_blank'>blog post</a>.
        <br/><br/>
        <Tab.Container id="tabs-with-dropdown" activeKey={this.state.key} onSelect={this.handleSelect.bind(this)}>
    <Row className="clearfix">
      <Col sm={12}>
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey={1}>About</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={2}>Testimonials</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={3}>Mission Values</Nav.Link>
          </Nav.Item>
          <NavDropdown eventKey="3" title="How to Help">
            <NavDropdown.Item eventKey="3.1">Use It. Share it</NavDropdown.Item>
            <NavDropdown.Item eventKey="3.2" href="/suggest">Request / Suggest a translation</NavDropdown.Item>
            <NavDropdown.Item eventKey="3.3">Feedback</NavDropdown.Item>
            <NavDropdown.Item divider />
            <NavDropdown.Item eventKey={3}>Donate</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown eventKey="4" title="Features">
            <NavDropdown.Item eventKey="4.1" href="/phrases">Phrases</NavDropdown.Item>
            <NavDropdown.Item eventKey="4.2" href="/proverbs">Proverbs</NavDropdown.Item>
            <NavDropdown.Item eventKey="4.23" href="/tools">More Tools</NavDropdown.Item>
            <NavDropdown.Item eventKey="4.21" href="/trends">Trends</NavDropdown.Item>
            <NavDropdown.Item eventKey="4.22" href="/updates">Updates</NavDropdown.Item>
            <NavDropdown.Item divider />
            <NavDropdown.Item eventKey="4.3" href="/">Search</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Col>
      <Col sm={12}>
        <Tab.Content animation>
          <Tab.Pane eventKey={1} style={divStyleOpacity}>
           <h1 className='title'>Where does the data come from?</h1> 
        Great question! It comes from 3 main sources
        <ol>
          <li><a href="http://assyrianlanguages.org" target='_blank'>assyrianlanguages.org</a></li>
          <li><a href="http://sfarmele.de" target='_blank'>sfarmele.de</a></li>
          <li><a href="http://assyrianapp.com/michael-younan/" target='_blank'>Michael Alexan Younan</a></li>
        </ol>

        <h1 className='title'>How come the word or phrase I want doesn't show up?</h1>
        Did you try clicking on More Results? Still, not there? <a href='https://groups.google.com/forum/#!forum/assyrian-app-dictionary'
          target='_blank'>
          Contact Us
        </a> - we'll add it as we add new words and phrases weekly.


        <h1 className='title'>Phonetic Pronunciation Key</h1>
        
        This modern dictionary replaces certain phonetic spellings that we get from AssyrianLanguages.org
        <ul>
        <li>ḥ => kh : Example : qam ḥa = qam kha</li>
        <li>š => sh : Example lé ša = le sha</li>
        <li>šla: ma: ' lu:ḥ = shla ma lookh</li>
        </ul>
        <p>
        
        <h1 className='title'>Why the Advertisements?</h1>
        I'd love to make this a clean looking and academic site without advertisements. To reach that design and fiscal goal, the site needs 100 subscribers. Check out the Trends page to determine how many paying subscribers the site has.
        
        <h1 className='title'>Open Source Codebase</h1>
        That's right. In the spirit of transparency, the codebase for sargonsays is opensource and available on <a href="https://github.com/sogwiz/assyrian_dictionary_web" target='_blank'>github</a>. Currently, the web frontend logic is open sourced. Soon, the backend logic that performs the data heuristics to optimize search results will also be available on github as open source.
        <br/><br/>
        <Container>
        <Row className="show-grid">
      <Col xs={12} md={8}><a href="/support"><Button bsStyle="success">Support sargonsays</Button></a></Col>
      <Col xs={6} md={4}></Col>
      </Row>
      <Row className="show-grid">
      <Col xs={12} md={8}></Col>
      <Col xs={6} md={4}>Powered by <a href="http://www.assyrianapp.com" target="_blank">assyrianapp.com</a></Col>
      </Row>
        
        </Container>
        </p>
          </Tab.Pane>
          <Tab.Pane eventKey={2} style={divStyleOpacity}>
            <Carousel>
    <Carousel.Item>
      <img width={900} height={500} alt="900x500" src={require("images/carousel.png")}/>
      <Carousel.Caption>
        <h3>Maryam : Shamiram Media</h3>
        <p>Hi my friend...I wanted to share this moment captured by our camera operator. I am looking up a word on sargonsays.com right before a recording! Thank you for the Assyrian invention of the year, has made my life so much easier..🙏🏼</p>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
      <img width={900} height={500} alt="900x500" src={require("images/carousel.png")}/>
      <Carousel.Caption>
        <h3>Timothy</h3>
        <p>I was just searching on Google and I came across your website and I really like how you want to keep the language alive.  I am half Assyrian and half German and my wife is Assyrian.  I have been wanting to really learn the language for awhile but my wife doesn't have the greatest patience as a teacher.  I speak broken Assyrian and have been looking around for a long time for something to help me learn a bit on my own and at work.  Have a child on the way and really want our kids to speak the language.  So I stand behind you in keeping this site going to help people like me to keep the language alive.</p>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
      <img width={900} height={500} alt="900x500" src={require("images/carousel.png")}/>
      <Carousel.Caption>
        <h3>Edmon</h3>
        <p>Seaching for "cash me outside how bah da!"...It didn't work!!! How Bah Dah 😂😂😂</p>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
      <img width={900} height={500} alt="900x500" src={require("images/carousel.png")}/>
      <Carousel.Caption>
        <h3>Suha</h3>
        <p>I actually used it for my Assyrian homework the other day! Great job! Thank you! :)</p>
      </Carousel.Caption>
    </Carousel.Item>
  </Carousel>
          </Tab.Pane>
          <Tab.Pane eventKey={3} style={divStyleOpacity}>
          <Jumbotron>
    <h1>Be a part of a solution...</h1>
    <Container>
    <Row>
      <p>...<strong>keep the Assyrian language alive</strong>. The Assyrian language is at a crucial juncture in history, struggling to survive. Support a digital footprint that empowers people to fall in love with the Assyrian language</p>
      </Row>
      </Container>
      <br/>
          
      <Roadmap/>
      <div className="well" style={wellStyles}>
    <a href="https://sargonsays.memberful.com/checkout?plan=23192"><OverlayTrigger placement="top" overlay={tooltipRepeat}><Button variant="primary" size="lg" onClick={this.handleSuperHeroButtonClick.bind(this)} block>Superhero - Support $2/month.</Button></OverlayTrigger></a>
    <br/>
    {<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick"/>
<input type="hidden" name="hosted_button_id" value="DUURLYD3DP3XU"/>
<OverlayTrigger placement="bottom" overlay={tooltipOneTime}>
<Button type="submit" variant="success" size="lg" onClick={this.handleHeroButtonClick.bind(this)} block>One Time Hero Donation</Button></OverlayTrigger>
<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"/>
</form>}
<OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom}>
<Button size="lg" variant="secondary" onClick={this.handleMaybeButtonClick.bind(this)} block>Maybe Later on my Birthday</Button>
</OverlayTrigger>
    </div>
 

    <Container>
    <Row>
      <Image src={require("images/language_alive.jpeg")} thumbnail/>
      </Row>
    <Row>
        <Col>
        "When we lose a language, we lose the worldview, culture and knowledge of the people who spoke it, constituting a loss to all humanity"
        </Col>
        </Row>
    </Container>

  </Jumbotron>
            <br/>
            <FinanceTable/>
  <Container>
    <Row>
    <OverlayTrigger trigger="hover" placement="top" delayHide={2000} overlay={popoverLamassu}>
        <Image src={require("images/hero.png")} circle />
        </OverlayTrigger>
    </Row>
  </Container>
          </Tab.Pane>
          

          <Tab.Pane eventKey="3.1" style={divStyleOpacity}>
            Thanks for clicking! Use the dictionary and search. It will make you a better person (heehee). The reason I created the dictionary was so that people would use it. It's truly an honor for me each and every time someone takes time out of their day to use this dictionary.
            <br/>
            Tell your friends and social circles about it
          </Tab.Pane>
          <Tab.Pane eventKey="3.2" style={divStyleOpacity}>
          </Tab.Pane>
          <Tab.Pane eventKey="3.3" style={divStyleOpacity}>
            If some words look incorrect, then they just may be. We don't have a bug bounty program yet but you can submit your feedback and findings to our <a href="https://groups.google.com/forum/#!forum/assyrian-app-dictionary" target="_blank">Google Group Page</a>
          </Tab.Pane>
          <Tab.Pane eventKey="3.4">
            Tab 3.4 content
          </Tab.Pane>
        </Tab.Content>
      </Col>
    </Row>
  </Tab.Container>
        
        </Container>
      </div>
    )
  }
}

export default About
