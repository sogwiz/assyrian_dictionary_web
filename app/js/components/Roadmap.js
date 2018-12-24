import React from 'react'
import { Button, ButtonGroup, ButtonToolbar, Carousel, Col, Grid, Image, Jumbotron, ListGroup, ListGroupItem, MenuItem, Nav, NavItem, NavDropdown, PageHeader, Panel, Popover, Row, Tab, Table, Tabs, Tooltip, OverlayTrigger, Thumbnail, PanelGroup } from 'react-bootstrap';

class Roadmap extends React.Component {
    render() {
        
        const headerStyle = { textAlign:"center"};
        return (
            <PanelGroup accordion>
                <Panel bsStyle={headerStyle} header="New features you can support" eventKey="2">
                <ListGroup>
                        <ListGroupItem header="Alexa, what's the Assyrian word for love? - cool feature">Amazon Alexa integration so that you can hear the Assyrian translation for an English word straight from your Alexa enabled device</ListGroupItem>
                        <ListGroupItem header="Recently added and updated words - transparency">You'll be able to see how timely the data powering the dictionary is as well as a realtime feed of updates made to the app. This is the most transparent way I can display that your support is directly tied to preserving the language. This feature would be a real-time dashboard tracking the most recent changes to the dictionary and what those changes were. This includes additions and improvements of the definitions as well as a list of code commits used to build the SargonSays application (java, javascript, python)</ListGroupItem>
                        <ListGroupItem header="Redesign the look and feel so that the dictionary translator is easier to use - app maintenance">The more people searching on the site, the better the dictionary gets. We are saving the Assyrian language! If the site is more user friendly, I suspect we'll get more usage on the site. A key example of this is after adding the 'auto complete' feature when searching... Site traffic went up and the overall experience improved as users were able to click on the auto complete suggestion rather than searching for something that had no results</ListGroupItem>
                        <ListGroupItem header="Move to a cheaper hosting solution - cut costs">Cloud hosting of the virtual machines powering the front end, the database, and the application logic can be cheaper by consolidating services onto one node. This will require some development effort to ensure the migration is of quality.</ListGroupItem>
                        <ListGroupItem header="Admin Portal for language experts - cool feature">We leverage experts to improve the dictionary quality. This feature is to build out a portal for language experts to improve the search relevance and dictionary quality, term by term. This tedious work requires a slick and intuitive user interface</ListGroupItem>
                        <ListGroupItem header="Completed items"><ul><li>Trends page</li><li>autocomplete when searching</li><li>related words to appear for each word search via text indexing</li></ul></ListGroupItem>
                    </ListGroup>
                </Panel>
            </PanelGroup>
        );
    }
}

export default Roadmap