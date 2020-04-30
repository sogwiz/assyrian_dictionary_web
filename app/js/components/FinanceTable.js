import React from 'react'
import { Accordion, Button, Card, ListGroup} from 'react-bootstrap';

class FinanceTable extends React.Component {
    render() {
        return (
            <Accordion>
                <Card>
                <Card.Header>
                    <Accordion.Toggle as={Card.Header} variant="link">
                        Cost and Revenue Streams
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse >
                    <Card.Body>
                    <ListGroup>
                        <ListGroup.Item variant="success"><h4>$25.00 per month</h4>Advertising Revenue on Google Adsense (I want to remove ads to make it a clean site)</ListGroup.Item>
                        <ListGroup.Item><h4>Volunteer</h4>Linguistic Researchers and community members who keep the language data pristine and correct (30 hours a month)</ListGroup.Item>
                        <ListGroup.Item><h4>Volunteer</h4>Software Development Time and Energy (20 hours a month)</ListGroup.Item>
                        <ListGroup.Item variant="danger"><h4>$25.00 per month</h4>Cloud Hosting for web app on Microsoft Azure and domain on DreamHost</ListGroup.Item>
                        <ListGroup.Item variant="danger"><h4>$10.00 per month</h4>Cloud Hosting on Nodechef for App Container ($4) and Database Server ($5)</ListGroup.Item>
                    </ListGroup>
                    </Card.Body>
                </Accordion.Collapse>

                </Card>
                </Accordion>
                
        )
    }
}

export default FinanceTable
