import React from 'react'
import { Graph } from "react-d3-graph";
import { ToastContainer, toast } from 'react-toastify';
import ReactGA from 'react-ga';
import { Label, OverlayTrigger, Tooltip } from 'react-bootstrap'

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
        renderLabel: true,
        minZoom: 2,
        highlightDegree: 1,
        highlightOpacity: 0.2,
        linkHighlightBehavior: true,
        nodeHighlightBehavior: true
    },
    link: {
        highlightColor: "lightblue",

    },
};

// graph payload (with minimalist structure)
/*
const data = {
    nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
    links: [{ source: "Harry", target: "Sally" }, { source: "Harry", target: "Alice" }],
};
*/

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used


class DerivedWordsGraph extends React.Component {

    static propTypes = {
        derivations: React.PropTypes.array,
        root: React.PropTypes.object
    }

    static defaultProps = {
        derivations: []
    }

    linksArr = new Array()
    nodesArr = new Array()
    graphData = null

    constructor(props) {
        super(props)

        this.state = {
            eastfont: localStorage.getItem('eastfont') || 'east',
            westfont: localStorage.getItem('westfont') || 'west',
            show: false
        }
        if (this.props.root) {
            this.props.root['symbolType'] = "square"
        }

    }

    handleModalClick(searchkeynum) {
        window.location = '/searchkey/' + searchkeynum
    }

    showToast(searchkeynum) {

        ReactGA.event({
            category: 'User',
            action: 'graphNodeClick',
            label: searchkeynum.toString()
        });

        var filteredNodes = this.props.derivations.filter(function (nodeEntry) {
            return nodeEntry['searchkeynum'] == searchkeynum
        })
        var node = filteredNodes == null || filteredNodes.length == 0 ? this.props.root : filteredNodes[0]

        toast(node['east'] + " [" + node['phonetic'] + "] \n" + node['english'], { autoClose: false, onClick: () => this.handleModalClick(node['searchkeynum']) })
    }

    setupData() {

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

    render() {
        this.setupData()

        const that = this;

        /*
        const tooltipOneTime = (
            <Tooltip id="tooltipOneTimes" className="in">{that.props.root['phonetic']}</Tooltip>
        );
        */

        const graphToShow = this.linksArr == null || this.linksArr.length == 0 ? (<div />) : (
            <div>
                {/*<OverlayTrigger placement="bottom" overlay={tooltipOneTime}>*/}
                    <h3 style={{ textAlign: "center" }}>Interactive root graph for term <span className={this.state.eastfont}>{this.props.root['east']}</span></h3>
                    {/*</OverlayTrigger>*/}
                <Graph
                    id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                    data={this.graphData}
                    config={myConfig}
                    onClickNode={this.showToast.bind(this)}
                />
            </div>
        )

        return (<div>{graphToShow}</div>)


    }
}

export default DerivedWordsGraph