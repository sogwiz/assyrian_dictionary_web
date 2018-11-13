import React from 'react'
const ParseComponent = ParseReact.Component(React)
mixins: [ParseReact.Mixin]
import Parse from 'parse'
import ParseReact from 'parse-react'
import ReactDataGrid from 'react-data-grid'
import { Button, OverlayTrigger, Panel, PanelGroup, Popover, Table, Tooltip } from 'react-bootstrap';
import GoogleAd from './GoogleAd.js';
import ReactAudioPlayer from 'react-audio-player'
import AudioHelperString from '../util/AudioHelper.js'

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
            activeKey: -1
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
        const query1 = new Parse.Query('DictionaryDefinition')
            .equalTo('partofspeech', 'phrase')

        const query2 = new Parse.Query('DictionaryDefinition')
            .equalTo('partofspeech', 'interjection')

        const query = new Parse.Query.or(query1, query2)
            .descending('partofspeech')


        const that = this;

        query.find({
            success: function (results) {
                that.setState({
                    rows: results
                })
            },
            error: function (error) {
                that.setState({
                    error: true,
                    errorObj: error,
                    rows: []
                })
            }
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
                <Tooltip id={entry.get('searchkeynum')}><strong>Click</strong> to see details about the spelling, audio, origin, and more about this phrase</Tooltip>
            );

            if (i % 4 == 0) {
                donate = (<GoogleAd
                    client="ca-pub-4439019971526085"
                    slot="9718385117"
                    format="auto"
                />)
            }

            entries.push(
                <Panel header={entry.get('english')} eventKey={entry.get('searchkeynum')}>
                    <Table>
                        <tbody>
                            <tr>
                                <td>Phonetic - East<h4>{entry.get('phonetic')}</h4></td>
                                <td>Phonetic - West<h4>{entry.get('phonetic_west')}</h4></td>
                            </tr>
                            <tr>
                                <td><ReactAudioPlayer src={AudioHelperString(entry.get('audio'),'e',entry.get('searchkeynum'))} /></td>
                                <td><ReactAudioPlayer src={AudioHelperString(entry.get('audio'),'w',entry.get('searchkeynum'))} /></td>
                            </tr>
                        </tbody>
                    </Table>
                    <p>
                        <OverlayTrigger placement="bottom" overlay={tooltip}>
                            <a href={"/searchkey/" + entry.get('searchkeynum')}>
                                <Button bsStyle="primary">Learn more</Button>
                            </a></OverlayTrigger>
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