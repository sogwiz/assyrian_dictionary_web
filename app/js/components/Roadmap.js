import React from 'react'
import { Accordion, Card, ListGroup} from 'react-bootstrap';

class Roadmap extends React.Component {
    render() {
        
        return (
            <Accordion>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Card.Header} variant="link" eventKey="2">
                            New features you can support
                        </Accordion.Toggle>
                    </Card.Header>
                        <Accordion.Collapse eventKey="2">
                            <Card.Body>
                            <ListGroup>
                        <ListGroup.Item><h4>Alexa, what's the Assyrian word for love? - cool feature</h4>Amazon Alexa integration so that you can hear the Assyrian translation for an English word straight from your Alexa enabled device</ListGroup.Item>
                        <ListGroup.Item><h4>Recently added and updated words - transparency</h4>You'll be able to see how timely the data powering the dictionary is as well as a realtime feed of updates made to the app. This is the most transparent way I can display that your support is directly tied to preserving the language. This feature would be a real-time dashboard tracking the most recent changes to the dictionary and what those changes were. This includes additions and improvements of the definitions as well as a list of code commits used to build the SargonSays application (java, javascript, python)</ListGroup.Item>
                        <ListGroup.Item><h4>Redesign the look and feel so that the dictionary translator is easier to use - app maintenance</h4>The more people searching on the site, the better the dictionary gets. We are saving the Assyrian language! If the site is more user friendly, I suspect we'll get more usage on the site. A key example of this is after adding the 'auto complete' feature when searching... Site traffic went up and the overall experience improved as users were able to click on the auto complete suggestion rather than searching for something that had no results</ListGroup.Item>
                        <ListGroup.Item><h4>Move to a cheaper hosting solution - cut costs</h4>Cloud hosting of the virtual machines powering the front end, the database, and the application logic can be cheaper by consolidating services onto one node. This will require some development effort to ensure the migration is of quality.</ListGroup.Item>
                        <ListGroup.Item><h4>Admin Portal for language experts - cool feature</h4>We leverage experts to improve the dictionary quality. This feature is to build out a portal for language experts to improve the search relevance and dictionary quality, term by term. This tedious work requires a slick and intuitive user interface</ListGroup.Item>
                        <ListGroup.Item><h4>Completed items</h4><ul><li>Trends page</li><li>autocomplete when searching</li><li>related words to appear for each word search via text indexing</li></ul></ListGroup.Item>
                    </ListGroup>

                            </Card.Body>
                        </Accordion.Collapse>
                </Card>
            </Accordion>
        )
    }
}

export default Roadmap
