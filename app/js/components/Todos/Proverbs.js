import React from 'react'
import {Button, OverlayTrigger, Panel, PanelGroup, Popover, Tooltip, Collapse} from 'react-bootstrap';
import GoogleAd from './GoogleAd.js';
import {CopyToClipboard} from 'react-copy-to-clipboard';

class Proverbs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: new Array(),
            activeKey: -1
        };
        this.queryProverbs();
    }

    handleSelect(activeKey) {
        this.setState({ activeKey });
      }

    queryProverbs() {
        const that = this;
        
        fetch('/api/proverb')
        .then((response) => response.json())
        .then (data => {
            /*let searches = data.map((singleWord => {
                return (
                <li><a href={"/word/"+singleWord.word}>{singleWord.word}</a></li>
                )
            }))*/
            that.setState({
                rows: data
            })
        })
        /*
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
        */
    }

    render(){
        const tooltipCopy = (
            <Tooltip><strong>Click</strong> to copy full details for this proverb to your clipboard</Tooltip>
        );
        if (this.state == null || this.state.rows == null || this.state.rows.length < 1) { return (<div><h1>Proverbs</h1></div>); }

        var entries = [];

        for(var i = 0 ; i < this.state.rows.length; i++){
            const entry = this.state.rows[i];

            const tooltip = (
                <Tooltip id={entry['b2dynamicentityid']}><strong>Meaning to idiomatic expression: </strong> {entry['subtext']}</Tooltip>
            );

            var donate = "";

            if(i%3==0){
                donate = (
                    <a href="https://sargonsays.memberful.com/checkout?plan=23192"><Button bsStyle="info">Support sargonsays for $2/month.</Button></a>
                )
            }else if(i%4==0){
                donate = (<GoogleAd 
                    client="ca-pub-4439019971526085" 
                    slot="9718385117" 
                    format="auto" 
                  />)
            }

            entries.push(
            <Panel header={entry['text']} eventKey={entry['b2dynamicentityid']}>
            <h2>{entry['title']}</h2>
            <br/>
            <OverlayTrigger placement="bottom" overlay={tooltip}>
            <p>{entry['subtext']}</p>
                </OverlayTrigger>
            <CopyToClipboard text = {"Assyrian Proverb: " + entry['text'] + " \n Assyrian phonetic: [" + entry['title'] + "] " +  entry['subtext'] + "\n http://sargonsays.com/proverbs"}
                onCopy={() => toast("Copied proverb to clipboard")} >
                    <OverlayTrigger placement="bottom" overlay={tooltipCopy}>
                    <Button bsStyle="link" bsSize="large">📋</Button>
                    </OverlayTrigger>
            </CopyToClipboard>
            {donate}
            <br/>
            </Panel>
            );
        }
        
        const popoverHoverFocuss = (
            <Popover id="popover-trigger-click" title="Literal and idiomatic translation">
            of Assyrian quotes and proverbs as well as the underlying meaning of the <strong>idiomatic expressions / phrases</strong></Popover>
        )
        const popoverHoverFocus = (
            <Tooltip placement="bottom" className="in" id="tooltip-right">
            <strong>Literal and idiomatic translation</strong> of Assyrian quotes and proverbs as well as the underlying meaning of the idiomatic expressions / phrases
          </Tooltip>
            
        )
        return (
            <div>
                {<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />}
                {<link rel="stylesheet" href="https://bootswatch.com/3/cosmo/bootstrap.min.css"/>}
                <br /><br /><br />
                <OverlayTrigger placement="bottom" overlay={popoverHoverFocus}>
                <h1>Proverbs + Quotes</h1>
    </OverlayTrigger>
                
                <PanelGroup activeKey={this.state.activeKey} onSelect={this.handleSelect.bind(this)}>
                {entries}
                </PanelGroup>
            </div>
        );
    }

}

export default Proverbs