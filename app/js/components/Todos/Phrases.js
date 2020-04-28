import React from 'react'
import ReactDataGrid from 'react-data-grid'
import { Button,ButtonToolbar, Col, OverlayTrigger, Panel, PanelGroup, Popover, Row, Table, Tooltip, Grid } from 'react-bootstrap';
import GoogleAd from './GoogleAd.js';
import ReactAudioPlayer from 'react-audio-player'
import AudioHelperString from '../util/AudioHelper.js'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';

const LinkCellFormatter = React.createClass({
    propTypes: {
        //value: React.PropTypes.number.isRequired
    },

    render() {
        const term = this.props.value;
        const urlTerm = "http://sargonsays.com/searchkey/" + term;
        return (
            <div>
                <a href={urlTerm}>{term}</a>
            </div>);
    }
});

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

            if (i % 4 == 0) {
                donate = (<GoogleAd
                    client="ca-pub-4439019971526085"
                    slot="9718385117"
                    format="auto"
                />)
            }

            entries.push(
                <Panel header={entry['english']} eventKey={entry['searchkeynum']}>
                    <Table responsive>
                        <tbody>
                            <tr><td align='center' colSpan='2'><h4> <span className="east-syriac-qasha">{entry['east']}</span></h4></td></tr>
                            <tr>
                                <td>Phonetic - East<h4>{entry['phonetic']}</h4></td>
                                <td><ReactAudioPlayer src={AudioHelperString(entry['audio'], 'e', entry['searchkeynum'])} /></td>
                            </tr>
                            <tr>
                                <td>Phonetic - West<h4>{entry['phonetic_west']}</h4></td>
                                <td><ReactAudioPlayer src={AudioHelperString(entry['audio_west'], 'w', entry['searchkeynum'])} /></td>
                            </tr>
                        </tbody>
                    </Table>
                    <p>
                        <ButtonToolbar>
                        <CopyToClipboard text = { entry['english'] + " \n Assyrian phonetic: " + entry['phonetic'] + " \n http://sargonsays.com/phrases"}
                                    onCopy={() => toast("Copied phrase details for " + entry['english'])} >
                                        <OverlayTrigger placement="bottom" overlay={tooltipCopy}>
                                    <Button bsStyle="link" bsSize="large">📋</Button>
                                    </OverlayTrigger>
                                </CopyToClipboard>
                                <OverlayTrigger placement="bottom" overlay={tooltip}>
                                    <a href={"/searchkey/" + entry['searchkeynum']}>
                                        <Button bsStyle="primary">Learn more</Button>
                                    </a>
                                </OverlayTrigger>
                            </ButtonToolbar>
                                
                    </p>
                    {donate}
                </Panel>
            );
        }

        return (
            <div>
                {<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />}
                {<link rel="stylesheet" href="https://bootswatch.com/3/cosmo/bootstrap.min.css" />}
                <br /><br /><br />
                <h1>Phrases</h1>
                <PanelGroup activeKey={this.state.activeKey} onSelect={this.handleSelect.bind(this)} accordion>
                    {entries}
                </PanelGroup>
            </div>
        );
    }
}

export default Phrases