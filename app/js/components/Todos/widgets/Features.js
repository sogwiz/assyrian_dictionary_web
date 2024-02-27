import React from 'react'
import { Alert, Card, CardDeck, Col, Container, Jumbotron, Button, Row } from 'react-bootstrap'
import styled from 'styled-components'

const StyledDiv = styled.div`
    a:visited {
        color: white;
    }
`

class Features extends React.Component {
    render() {
        return (
            <Jumbotron>
  <Card className="text-center">
  <Card.Header><a href="/">Search 🔎</a></Card.Header>
  <Card.Body>
    <Card.Title>English to Assyrian Dictionary</Card.Title>
    <Card.Text>
        SargonSays is an English to Assyrian dictionary, focused on search data quality. This means search results
        are vetted and ranked according to the best match to your search query
    </Card.Text>
    <a href="/"><Button variant="primary">Begin Searching</Button></a>
  </Card.Body>
  <Card.Footer className="text-muted">More Features</Card.Footer>
</Card>
<br/>
  <CardDeck>
  <Card border="secondary">
  <Card.Header><a href="/phrases">Phrases 🗣</a></Card.Header>
    <Card.Body>
      <Card.Title>Conversation Phrases</Card.Title>
      <Card.Text>
        <b>"Hello! How are you?"</b>
        If you want to learn some useful phrases in Assyrian, the Phrases feature has translations, audio, and phonetic English so that non-native speakers can sound out the phrase in English 
      </Card.Text>
    </Card.Body>
  </Card>
  <Card border="primary">
  <Card.Header><a href="/proverbs">Proverbs 📜</a></Card.Header>
    <Card.Body>
      <Card.Title>"Long Toungue"</Card.Title>
      <Card.Text>
        Assyrian Proverbs combine traditional wisdom and biting humor
      </Card.Text>
    </Card.Body>
  </Card>
  <Card border="success">
  <Card.Header><a href="/trends">Trends 📊</a></Card.Header>
    <Card.Body>
      <Card.Title>Explore what Assyria is searching</Card.Title>
      <Card.Text>
        SargonSays search trends
      </Card.Text>
    </Card.Body>
  </Card>
</CardDeck>
<br/>
<Container>
  <Row>
    <Col><Alert variant='warning' key={0}>
    Beta Features in progress
  </Alert></Col>
  </Row>
</Container>
<CardDeck>
<Card
      bg='info'
      text='white'
    >
    <Card.Header><StyledDiv><a href="/names" className="white-link">Assyrian Names</a></StyledDiv></Card.Header>
    <Card.Body>
      <Card.Title>*Assyrian names and meanings</Card.Title>
      <Card.Text>
        <ul>
            <li>picking out a name for your new family member</li>
            <li>how to write your name in Assyrian</li>
            <li>the Assyrian meaning of your name</li>
        </ul>  
      </Card.Text>
    </Card.Body>
    <Card.Footer>
      <small>*Beta Feature</small>
    </Card.Footer>
  </Card>
  <Card
      bg='dark'
      text='white'
    >
    <Card.Header><StyledDiv><a href="/roots" className="white-link">Root Words</a></StyledDiv></Card.Header>
    <Card.Body>
      <Card.Title>*Root words</Card.Title>
      <Card.Text>
        <ul>
            <li>root words with derived terms</li>
            <li>visual graph of root words and derived / related terms</li>
            <li>understand how words are related</li>
        </ul>  
      </Card.Text>
    </Card.Body>
    <Card.Footer>
      <small>*Beta Feature</small>
    </Card.Footer>
  </Card>
  
</CardDeck>
  
</Jumbotron>
        )
    }
}

export default Features