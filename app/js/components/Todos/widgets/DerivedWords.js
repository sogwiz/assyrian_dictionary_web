import PropTypes from 'prop-types';
import React from 'react'
import { Accordion, Card, Overlay, OverlayTrigger, Popover, Tab, Tabs } from 'react-bootstrap'
import { Graph } from "react-d3-graph";
import { ToastContainer, toast } from 'react-toastify';
import GenericDataGrid from './GenericDataGrid'
import DerivedWordsGraph from './DerivedWordsGraph'



/* I had code that did do this in the tab view 
  <Tab eventKey={2} title="List">
  <ul>
            {this.props.derivations.map(derivedWord => <li><a href={'/searchkey/' + this.props.root['searchkeynum']}><span className={this.state.eastfont}>{derivedWord['east']}</span></a></li>)}
          </ul>
  </Tab>
*/

class DerivedWords extends React.Component {
    static propTypes = {
        derivations: PropTypes.array,
        root: PropTypes.object
    }

    render() {

        return (
            <Accordion>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Card.Header}>
                        Derived Words
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse>
                        <Card.Body>
                        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                    <Tab eventKey={1} title="Graph">

                        <DerivedWordsGraph derivations={this.props.derivations} root={this.props.root} />

                    </Tab>
                    <Tab eventKey={2} title="List">
                        <GenericDataGrid rows={this.props.derivations} />

                    </Tab>

                </Tabs>
                        </Card.Body>

                    </Accordion.Collapse>
                </Card>
            </Accordion>


        )
    }
}

export default DerivedWords
