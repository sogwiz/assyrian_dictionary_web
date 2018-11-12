import React from 'react'
const ParseComponent = ParseReact.Component(React)
mixins: [ParseReact.Mixin]
import Parse from 'parse'
import ParseReact from 'parse-react'
import {Button, OverlayTrigger, Panel, PanelGroup, Popover, Tooltip} from 'react-bootstrap';
import GoogleAd from './GoogleAd.js';

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
        const query = new Parse.Query('Proverb')
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

    render(){
        if (this.state == null || this.state.rows == null || this.state.rows.length < 1) { return (<div><h1>Proverbs</h1></div>); }

        var entries = [];

        for(var i = 0 ; i < this.state.rows.length; i++){
            const entry = this.state.rows[i];

            const tooltip = (
                <Tooltip id={entry.get('b2dynamicentityid')}><strong>Meaning</strong> {entry.get('subtext')}</Tooltip>
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
            <Panel header={entry.get('text')} eventKey={entry.get('b2dynamicentityid')}>
            <h2>{entry.get('title')}</h2>
            <br/>
            <p><OverlayTrigger placement="bottom" overlay={tooltip}>
                <Button bsStyle="primary">Learn more</Button>
                </OverlayTrigger>
            </p>
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
                
                <PanelGroup activeKey={this.state.activeKey} onSelect={this.handleSelect.bind(this)} accordion>
                {entries}
                </PanelGroup>
            </div>
        );
    }

}

export default Proverbs