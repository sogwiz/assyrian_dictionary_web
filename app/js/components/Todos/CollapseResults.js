import React from 'react'
import Collapse, { Panel } from 'rc-collapse';
import 'rc-collapse/assets/index.css';
import GoogleAd from './GoogleAd.js';

class CollapseResults extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        var entries = []
        for (var i = 1; i < this.props.items.length; i++) {
          entries.push(this.props.items[i])

          if (i%4==0){
            entries.push(<GoogleAd
              client="ca-pub-4439019971526085"
              slot="8013892948"
              format="fluid"
          />)
          }
        }
            //console.log("redraw")
        return (
            <Collapse accordion={this.props.accordion} onChange={this.props.toggle} defaultActiveKey="1">
            <Panel header={this.props.headerText} key='1'>
              {entries}
              {/*this.props.items.slice(1,this.props.items.length)*/}
            </Panel>
          </Collapse>
        )
    }
}

export default CollapseResults