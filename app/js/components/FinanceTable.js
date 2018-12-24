import React from 'react'
import { Button, ButtonGroup, ButtonToolbar, Carousel, Col, Grid, Image, Jumbotron, ListGroup, ListGroupItem, MenuItem, Nav, NavItem, NavDropdown, PageHeader, Panel, Popover, Row, Tab, Table, Tabs, Tooltip, OverlayTrigger, Thumbnail, PanelGroup } from 'react-bootstrap';

class FinanceTable extends React.Component {
    render() {
        return (
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
        );
    }
}

export default FinanceTable