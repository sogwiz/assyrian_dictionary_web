import React from 'react'
import {Overlay, OverlayTrigger, Panel, Popover, Tab, Tabs} from 'react-bootstrap'
import { Graph } from "react-d3-graph";
import { ToastContainer, toast } from 'react-toastify';
import GenericDataGrid from './GenericDataGrid'

// graph payload (with minimalist structure)
/*
const data = {
    nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
    links: [{ source: "Harry", target: "Sally" }, { source: "Harry", target: "Alice" }],
};
*/

/* I had code that did do this in the tab view 
  <Tab eventKey={2} title="List">
  <ul>
            {this.props.derivations.map(derivedWord => <li><a href={'/searchkey/' + this.props.root['searchkeynum']}><span className={this.state.eastfont}>{derivedWord['east']}</span></a></li>)}
          </ul>
  </Tab>
*/

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
    nodeHighlightBehavior: true,
    directed: true,
    focusAnimationDuration: 0.75,
    node: {
        color: "lightgreen",
        size: 400,
        highlightStrokeColor: "blue",
        fontSize: 20,
        highlightFontSize: 24,
        mouseCursor: "pointer",
        labelProperty: "east",
        renderLabel: true
    },
    link: {
        highlightColor: "lightblue",

    },
};

class DerivedWords extends React.Component {
    linksArr = new Array()
    nodesArr = new Array()
    graphData = null
    
    constructor(props){
        super(props)

        this.state = {
            eastfont: localStorage.getItem('eastfont') || 'east',
            westfont: localStorage.getItem('westfont') || 'west',
            show: false
        }

    }

    handleModalClick(searchkeynum) {
        window.location = '/searchkey/' + searchkeynum
    }

    showToast(searchkeynum){
        
        var filteredNodes = this.props.derivations.filter(function(nodeEntry){
            return nodeEntry['searchkeynum'] == searchkeynum
        })
        var node = filteredNodes == null || filteredNodes.length == 0 ? this.props.root : filteredNodes[0]

        toast(node['east'] + " [" + node['phonetic'] + "] \n" + node['english'], { autoClose: false, onClick: () => this.handleModalClick(node['searchkeynum']) })
    }

    setupData(){

        this.linksArr = [...this.props.derivations]
        this.linksArr.forEach(element => {
            element['source'] = this.props.root['searchkeynum']
        });

        this.linksArr.forEach(element => {
            element['target'] = element['searchkeynum']
        });

        this.nodesArr = [...this.props.derivations]
        

        this.nodesArr.unshift(this.props.root)
        this.nodesArr.forEach(element => {
            element['id'] = element['searchkeynum']
        });

        this.graphData = {
            nodes: this.nodesArr,
            links: this.linksArr
        }
    }

    render(){
        this.setupData()
        const graphToShow = this.linksArr == null || this.linksArr.length == 0 ? (<div/>) : (
           
           
            <Graph
          id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
          data={this.graphData}
          config={myConfig}
          onClickNode={this.showToast.bind(this)}
          /> 
         
        )
        return (
            <Panel id="collapsible-panel-derived" collapsible defaultExpanded header="Derived Words">
               <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
  <Tab eventKey={1} title="Graph">
  
  {graphToShow}
  
  </Tab>
  <Tab eventKey={2} title="List">
            <GenericDataGrid rows={this.props.derivations}/>
          
  </Tab>
 
</Tabs> 
               
            
          
          </Panel>
          
          
        )
    }
}

export default DerivedWords
