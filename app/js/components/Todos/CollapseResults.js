import React from 'react'
import Collapse, { Panel } from 'rc-collapse';
import 'rc-collapse/assets/index.css';

class CollapseResults extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
            //console.log("redraw")
        return (
            <Collapse accordion={this.props.accordion} onChange={this.props.toggle} >
            <Panel header={this.props.headerText} key='1'>
              {this.props.items.slice(1,this.props.items.length)}
            </Panel>
          </Collapse>
        )
    }
}

export default CollapseResults