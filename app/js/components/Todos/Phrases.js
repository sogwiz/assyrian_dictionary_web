import React from 'react'
import { Accordion, Button,ButtonToolbar, Col, OverlayTrigger, Card, Popover, Table, Tooltip } from 'react-bootstrap';
import GoogleAd from './GoogleAd.js';
import ReactAudioPlayer from 'react-audio-player'
import AudioHelperString from '../util/AudioHelper.js'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';

class LinkCellFormatter extends React.Component {
    static propTypes = {
        //value: React.PropTypes.number.isRequired
    };

    render() {
        const term = this.props.value;
        const urlTerm = "http://sargonsays.com/searchkey/" + term;
        return (
            <div>
                <a href={urlTerm}>{term}</a>
            </div>);
    }
}

class Phrases extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: new Array(),
            activeKey: -1,
            value: '',
            copied: false,
        };
        this._columns = [
            {
                key: 'searchkeynum',
                name: 'id',
                formatter: LinkCellFormatter,
                editable: false
            },
            {
                key: 'english',
                name: 'phrase',
                editable: false
            },
            {
                key: 'phonetic',
                name: 'phonetic_east',
                editable: false
            },
            {
                key: 'partofspeech',
                name: 'type',
                editable: false
            }
        ];

        this.queryPhrases();
    }
    handleSelect(activeKey) {
        this.setState({ activeKey });
    }

    queryPhrases() {

        const that = this;
        fetch('/api/phrases')
            .then((response) => response.json())
            .then (data => {
                that.setState({
                    rows: data
                })
            })
    }

    rowGetter(i) {
        //console.log('in rowgetter ' + i)

        if (this.state == null) {
            console.log('state is null')
            return;
        }

        if (this.state.rows != null && this.state.rows.length > 0) {
            var listitem = this.state.rows[i];
            return listitem;
        }
        return "invalid";

    }

    render() {
        if (this.state == null || this.state.rows == null || this.state.rows.length < 1) { return (<div />); }

        var entries = [];
        for (var i = 0; i < this.state.rows.length; i++) {
            const entry = this.state.rows[i];
            var donate = "";
            const tooltip = (
                <Tooltip id={entry['searchkeynum']}><strong>Click</strong> to see details about the spelling, audio, origin, and more about this phrase</Tooltip>
            );
            const tooltipCopy = (
                <Tooltip><strong>Click</strong> to copy full details for this phrase to your clipboard</Tooltip>
            );

            if (i % 6 == 0) {
                donate = (<GoogleAd
                    client="ca-pub-4439019971526085"
                    slot="8013892948"
                    format="fluid"
                />)
            }

            entries.push(
                    <div>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Card.Header} eventKey={entry['searchkeynum']}>
                                {entry['english']}
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={entry['searchkeynum']}>
                            <Card.Body>
                            <Table responsive>
                        <tbody>
                            <tr><td align='center' colSpan='2'><h4> <span className="east-syriac-qasha">{entry['east']}</span></h4></td></tr>
                            <tr>
                                <td>Phonetic - East<h4>{entry['phonetic']}</h4></td>
                                <td><ReactAudioPlayer src={AudioHelperString(entry['audio'], 'e', entry['searchkeynum'])} controls /></td>
                            </tr>
                            <tr>
                                <td>Phonetic - West<h4>{entry['phonetic_west']}</h4></td>
                                <td><ReactAudioPlayer src={AudioHelperString(entry['audio_west'], 'w', entry['searchkeynum'])} controls /></td>
                            </tr>
                        </tbody>
                    </Table>
                    
                        <ButtonToolbar>
                        <CopyToClipboard text = { entry['english'] + " \n Assyrian phonetic: " + entry['phonetic'] + " \n http://sargonsays.com/phrases"}
                                    onCopy={() => toast("Copied phrase details for " + entry['english'])} >
                                        <OverlayTrigger placement="bottom" overlay={tooltipCopy}>
                                    <Button variant="link" size="lg">📋</Button>
                                    </OverlayTrigger>
                                </CopyToClipboard>
                                <OverlayTrigger placement="bottom" overlay={tooltip}>
                                    <a href={"/searchkey/" + entry['searchkeynum']}>
                                        <Button variant="primary">Learn more</Button>
                                    </a>
                                </OverlayTrigger>
                            </ButtonToolbar>
                    {/*donate*/}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    {donate}
                    </div>
               
            );
        }

        return (
            <div>
                {<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />}
                {<link rel="stylesheet" href="https://bootswatch.com/3/cosmo/bootstrap.min.css" />}
                <br /><br /><br />
                <h1>Phrases</h1>
                <Accordion>
                    {entries}
                </Accordion>
            </div>
        );
    }
}

export default Phrases