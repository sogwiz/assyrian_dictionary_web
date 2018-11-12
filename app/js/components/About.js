import React from 'react'
import { browserHistory } from 'react-router';
import { Button, ButtonGroup, ButtonToolbar, Carousel, Col, Grid, Image, Jumbotron, ListGroup, ListGroupItem, MenuItem, Nav, NavItem, NavDropdown, PageHeader, Panel, Popover, Row, Tab, Table, Tabs, Tooltip, OverlayTrigger, Thumbnail, PanelGroup } from 'react-bootstrap'; 
import ReactGA from 'react-ga';

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
    ReactGA.initialize('UA-6312595-17'); 
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
      <Popover id="popover-positioned-bottom" title="Thank you">
        <strong>Holy dolma!</strong> Thank you for considering the Maybe Later option. Here's how to say <a href="/word/maybe">maybe</a> and <a href="/word/later">later</a> in Assyrian
      </Popover>
    );

    const popoverLamassu = (
      <Popover id="popover-lamassu" title="Lamassu #superhero">
        The lamassu, or shedu, encompasses all life within it. They first appeared in the Sumerian epic of Gilgamesh as physical entities in the lands. 
        The eventual evolution of the lamassu across the Assyrian and Akkadian empires led to its widespread use in entrances as a protective deity, often two lamassu would flank an entrance to a city or state building. Here's how to say <a href="/word/lamassu">lamassu</a> and <a href="/word/shedu">shedu</a> in Assyrian
      </Popover>
    );

    return (
      
      <div>
        {<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />}
        {<link rel="stylesheet" href="https://bootswatch.com/3/cosmo/bootstrap.min.css"/>}
        <Grid>
          <br/>
        <h1 className='title'>About SargonSays</h1>
        <h4>Hello, I'm Sargon.</h4> 
        I wanted an easy to use Assyrian Sureth dictionary with high fidelity search results. Quality is important. To read more about the design technology that powers this dictionary, check out my <a href="http://sogwiz.blogspot.com/2016/12/english-to-assyrian-dictionary.html" target='_blank'>blog post</a>.
        <br/><br/>
        <Tab.Container id="tabs-with-dropdown" activeKey={this.state.key} onSelect={this.handleSelect.bind(this)}>
    <Row className="clearfix">
      <Col sm={12}>
        <Nav bsStyle="tabs">
          <NavItem eventKey={1}>
            About
          </NavItem>
          <NavItem eventKey={2}>
            Testimonials
          </NavItem>
          <NavItem eventKey={3}>
            Cost Structure
          </NavItem>
          <NavDropdown eventKey="3" title="How to Help">
            <MenuItem eventKey="3.1">Use It. Share it</MenuItem>
            <MenuItem eventKey="3.3">Feedback</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={3}>Donate</MenuItem>
          </NavDropdown>
          <NavDropdown eventKey="4" title="Features">
            <MenuItem eventKey="4.1" href="/phrases">Phrases</MenuItem>
            <MenuItem eventKey="4.2" href="/proverbs">Proverbs</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey="4.3" href="/">Search</MenuItem>
          </NavDropdown>
        </Nav>
      </Col>
      <Col sm={12}>
        <Tab.Content animation>
          <Tab.Pane eventKey={1}>
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
        <br/><br/>
        <Grid>
        <Row className="show-grid">
      <Col xs={12} md={8}><a href="/support"><Button bsStyle="success">Support sargonsays</Button></a></Col>
      <Col xs={6} md={4}></Col>
      </Row>
      <Row className="show-grid">
      <Col xs={12} md={8}></Col>
      <Col xs={6} md={4}>Powered by <a href="http://www.assyrianapp.com" target="_blank">assyrianapp.com</a></Col>
      </Row>
        
        </Grid>
        </p>
          </Tab.Pane>
          <Tab.Pane eventKey={2}>
            <Carousel>
    <Carousel.Item>
      <img width={900} height={500} alt="900x500" src={require("images/anb.png")}/>
      <Carousel.Caption>
        <h3>Maryam : ANB Satellite</h3>
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
          <Tab.Pane eventKey={3}>
          <Jumbotron>
    <h1>You could be a hero...</h1>
    <Grid>
    <Row>
      <p>...<strong>keep the Assyrian language alive</strong>. The Assyrian language is at a crucial juncture in history, struggling to survive. Support a digital footprint that empowers people to fall in love with the Assyrian language</p>
      </Row>
      </Grid>
      <br/>
    
      <div className="well" style={wellStyles}>
    <a href="https://sargonsays.memberful.com/checkout?plan=23192"><OverlayTrigger placement="top" overlay={tooltipRepeat}><Button bsStyle="primary" bsSize="large" onClick={this.handleSuperHeroButtonClick.bind(this)} block>Superhero - Support $2/month.</Button></OverlayTrigger></a>
    <br/>
    {<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick"/>
<input type="hidden" name="hosted_button_id" value="DUURLYD3DP3XU"/>
<OverlayTrigger placement="bottom" overlay={tooltipOneTime}>
<Button type="submit" bsStyle="success" bsSize="large" onClick={this.handleHeroButtonClick.bind(this)} block>One Time Hero Donation</Button></OverlayTrigger>
<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"/>
</form>}
<OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom}>
<Button bsSize="large" onClick={this.handleMaybeButtonClick.bind(this)} block>Maybe Later</Button>
</OverlayTrigger>
    </div>
 

    <Grid>
    <Row>
      <Image src={require("images/language_alive.jpeg")} thumbnail/>
      </Row>
    <Row>
        <Col>
        "When we lose a language, we lose the worldview, culture and knowledge of the people who spoke it, constituting a loss to all humanity"
        </Col>
        </Row>
    </Grid>

  </Jumbotron>
            <br/>
            <PanelGroup accordion>
    <Panel header="Cost and Revenue Streams" eventKey="1">
    <ListGroup>
    <ListGroupItem bsStyle="success" header="$25.00 per month">Advertising Revenue on Google Adsense (I want to remove ads to make it a clean site)</ListGroupItem>
    <ListGroupItem header="Volunteer">Linguistic Researchers and community members who keep the language data pristine and correct (30 hours a month)</ListGroupItem>
    <ListGroupItem header="Volunteer">Software Development Time and Energy (20 hours a month)</ListGroupItem>
    <ListGroupItem bsStyle="danger" header="$25.00 per month">Cloud Hosting for web app on Microsoft Azure and domain on DreamHost</ListGroupItem>
    <ListGroupItem bsStyle="danger" header="$10.00 per month">Cloud Hosting on Nodechef for App Container ($4) and Database Server ($5)</ListGroupItem>
  </ListGroup>
  </Panel>
      </PanelGroup>
  <Grid>
    <Row>
    <OverlayTrigger trigger="hover" placement="top" delayHide={2000} overlay={popoverLamassu}>
        <Image src={require("images/hero.png")} circle />
        </OverlayTrigger>
    </Row>
  </Grid>
          </Tab.Pane>
          

          <Tab.Pane eventKey="3.1">
            Thanks for clicking! Use the dictionary and search. It will make you a better person (heehee). The reason I created the dictionary was so that people would use it. It's truly an honor for me each and every time someone takes time out of their day to use this dictionary.
            <br/>
            Tell your friends and social circles about it
          </Tab.Pane>
          <Tab.Pane eventKey="3.2">
          </Tab.Pane>
          <Tab.Pane eventKey="3.3">
            If some words look incorrect, then they just may be. We don't have a bug bounty program yet but you can submit your feedback and findings to our <a href="https://groups.google.com/forum/#!forum/assyrian-app-dictionary" target="_blank">Google Group Page</a>
          </Tab.Pane>
          <Tab.Pane eventKey="3.4">
            Tab 3.4 content
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

export default About
