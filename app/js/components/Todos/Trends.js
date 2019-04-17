import React from 'react'
mixins: [ParseReact.Mixin]
import Parse from 'parse'
import ParseReact from 'parse-react'
import ReactDataGrid from 'react-data-grid'
import _ from 'lodash'
import { slide as Menu } from 'react-burger-menu'
import TrendsDefinitions from './TrendsDefinitions'
import { Button, ButtonGroup, ButtonToolbar, Col, Grid, Jumbotron, PageHeader, Panel, Popover, Row, Tab, Tabs, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { TagCloud } from 'react-tagcloud';
import ReactTooltip from 'react-tooltip'
import RecentUpdates from './RecentUpdates';
//require('./../../../assets/bootstrap/css/bootstrap-iso.css')
//import './../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
//require('./../../../assets/styles/main.less')

const LinkCellFormatter = React.createClass({
    propTypes: {
        //value: React.PropTypes.number.isRequired
    },

    render() {
        const term = this.props.value;
        const urlTerm = "/word/" + term;
        return (
            <div>
                <a href={urlTerm}>{term}</a>
            </div>);
    }
});

class Trends extends React.Component {
    constructor(props) {
        super(props);

        var defaultKey = 2;
    if(this.props.location.pathname && this.props.location.pathname.includes("updates")){
      defaultKey = 4;
    }

        this.state = {
            rows: new Array(),
            rowsCopy: new Array(),
            rowsVerified: new Array(),
            isSearching: false,
            lastSearch: 'Last Query Time',
            key: defaultKey
        };

        this._columns = [
            {
                key: 'word',
                name: 'word or phrase',
                sortable: false,
                formatter: LinkCellFormatter
            },
            {
                key: 'prank',
                sortable: false,
                name: 'Popularity Rank'
            },
            {
                key: 'queries',
                sortable: false,
                name: 'Number of Queries'
            }
        ];

        this._columns2 = [
            {
                key: 'word',
                name: 'word or phrase',
                sortable: false,
                formatter: LinkCellFormatter
            },
            {
                key: 'phonetic',
                sortable: false,
                name: 'Eastern Dialect'
            },
            {
                key: 'phonetic_west',
                sortable: false,
                name: 'Western Dialect'
            }
        ];

        this.queryTrends();
        this.queryLastSearch();
        this.queryVerified();
    }

    queryLastSearch() {
        const query = new Parse.Query('SearchStat')
            .descending('updatedAt')
            .limit(1)

        const that = this;
        query.find({

            success: function (results) {
                let lastTime = results[0]['updatedAt'];
                that.setState({
                    lastSearch: lastTime.toString()
                })
            },
            error: function (error) {

            }
        })
    }

    queryTrends() {
        this.setState({
            isSearching: true,
            searchTime: new Date().getTime(),
        });

        const that = this
        fetch('/api/searchstats')
                    .then((response) => response.json())
                    .then (data => {
                        that.setState({
                            isSearching: false,
                            rows: data,
                            rowsCopy: data
                        })
                    })
                    .catch((error) => {
                        that.setState({
                            isSearching: false,
                            error: true,
                            errorObj: error,
                            rows: []
                        })
                      })
    }

    queryVerified() {
        const query = new Parse.Query('DictionaryWordDefinitionList')
            .limit(200)
            .equalTo('boost', 100)
            .include('dictionary_definition_obj')

        const that = this;

        query.find({
            success: function (results) {
                that.setState({
                    rowsVerified: results
                })
            },
            error: function (error) {
                that.setState({
                    error: true,
                    errorObj: error,
                    rowsVerified: []
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
            var listitem = this.state.rowsCopy[i];
            //listitem.set("prank", i.toString());
            listitem["prank"] = i.toString()

            //listitem.set('rank') = i.toString();
            //console.log("listitemrank is " + listitem.get('prank'));
            // listitem.defineProperty()
            //console.log("lititemgetrank is " + listitem.get('word'));
            //var definition = {objectId: listitem.objectId, boost : listitem.get('boost'), searchkeynum : listitem.get('searchkeynum'), 
            //word: listitem.get('word'), phonetic : listitem.get('dictionary_definition_obj').get('phonetic'), 
            //east: listitem.get('dictionary_definition_obj').get('east')}
            if (this.checkWhiteListString(listitem, false)) {
                return listitem;
            }
            //return definition;
        }
        return "invalid";

    }

    rowGetter2(i) {
        //console.log('in rowgetter ' + i)

        if (this.state == null) {
            console.log('state is null')
            return;
        }

        if (this.state.rowsVerified != null && this.state.rowsVerified.length > 0) {
            var listitem = this.state.rowsVerified[i];

            if(listitem.get('dictionary_definition_obj').get('phonetic')){
                var phoneticEast = listitem.get('dictionary_definition_obj').get('phonetic').replace("š", "sh").replace("ḥ", "kh");
                listitem.set('phonetic', phoneticEast);
            }
            
            if(listitem.get('dictionary_definition_obj').get('phonetic_west')){
                var phoneticWest = listitem.get('dictionary_definition_obj').get('phonetic_west').replace("š", "sh").replace("ḥ", "kh");
                listitem.set('phonetic_west', phoneticWest);
            }
            //listitem.set('rank') = i.toString();
            //console.log("listitemrank is " + listitem.get('prank'));
            // listitem.defineProperty()
            //console.log("lititemgetrank is " + listitem.get('word'));
            //var definition = {objectId: listitem.objectId, boost : listitem.get('boost'), searchkeynum : listitem.get('searchkeynum'), 
            //word: listitem.get('word'), phonetic : listitem.get('dictionary_definition_obj').get('phonetic'), 
            //east: listitem.get('dictionary_definition_obj').get('east')}
            if (this.checkWhiteListString(listitem, true)) {
                return listitem;
            }
            //return definition;
        }
        return "invalid";

    }

    checkWhiteListString(searchStat, isParseObj) {
        if (searchStat) {
            //var term = searchStat.get('word');
            var term
            if(isParseObj == true){
                term = searchStat.get('word')
            }else{
                term = searchStat['word']
            }
            if (term) {
                if (_.includes(term, "fuck") || _.includes(term, "dick")) {

                } else {
                    return true;
                }
            }
        }
        return false;
    }

    handleGridSort(sortColumn, sortDirection) {
        const comparer = (a, b) => {
            if (sortDirection === 'ASC') {
                return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
            } else if (sortDirection === 'DESC') {
                return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
            }
        };

        const rowsRet = sortDirection === 'NONE' ? this.state.rows.slice(0) : this.state.rowsCopy.sort(comparer);

        this.setState({ rowsCopy: rowsRet });
    }

    render() {
        const tooltip1 = (
            <Tooltip id="tooltip1"><strong>Holy dolma!</strong> This # represents the aggregate number of searches. This is the total number of searches, non-unique. This isn't a live ticker yet</Tooltip>
        );

        const tooltip2 = (
            <Tooltip id="tooltip2"><strong>Big Library</strong> This live ticker statistic represents the total number of definitions in the library. Each definition is then matched up to various search terms that it could be related to</Tooltip>
        );

        const tooltip3 = (
            <Tooltip id="tooltip3"><strong>It's important</strong> to understand your users and learn from them. A good number of users are searching for phrases, not just words. We add phrases and sometimes new words weekly</Tooltip>
        );

        const tooltipSubscribe = (
            <Tooltip id="tooltipSubscribe">100 subscribers need to make sargonsays a clean looking and academic site <strong>without advertisements</strong></Tooltip>
        );
        const tooltip4 = (
            <Tooltip id="tooltip4"><strong>Activity</strong> is essential to any web app. People use this dictionary alot. Refresh the page to see the most recent search query time</Tooltip>
        );

        const popoverHoverFocus = (
            <Popover id="popover-trigger-hover-focus" title="Transparency">
              <strong>It's important</strong> we show you that we keep the dictionary data up to date. This is an ongoing effort and is possible thanks to your continued support. To earn your support, it is imperative we show you that we actively work on improving the data quality in the dictionary. 
            </Popover>
          );

        if (this.state == null || this.state.rows == null || this.state.rows.length < 1) { return (<div />); }
        return (

            <div>
                {<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />}
                {<link rel="stylesheet" href="https://bootswatch.com/3/cosmo/bootstrap.min.css"/>}
                <br /><br /><br />
                <Tabs defaultActiveKey={this.state.key} id="uncontrolled-tab-example">
                    <Tab eventKey={1} title="Statistics">
                        <Grid>
                            <Row>
                                <Col xs={6} md={4}>
                                    <Jumbotron>
                                        <h1>283,000+</h1>
                                        <p>Searches</p>
                                        <p>
                                            <OverlayTrigger placement="bottom" overlay={tooltip1}>
                                                <Button bsStyle="primary">Learn more</Button>
                                            </OverlayTrigger>
                                        </p>
                                    </Jumbotron>
                                </Col>
                                <Col xs={6} md={4}>
                                    <Jumbotron>
                                        <h1><TrendsDefinitions /></h1>
                                        <p>Unique Definitions</p>
                                        <p><OverlayTrigger placement="bottom" overlay={tooltip2}>
                                            <Button bsStyle="primary">Learn more</Button>
                                        </OverlayTrigger>
                                        </p>
                                    </Jumbotron>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6} md={4}>
                                    <Jumbotron>
                                        <h1>5 new</h1>
                                        <p>terms added weekly</p>
                                        <p><OverlayTrigger placement="bottom" overlay={tooltip3}>
                                            <a href="/updates"><Button bsStyle="primary">Learn more</Button></a>
                                        </OverlayTrigger>
                                        </p>
                                    </Jumbotron>
                                </Col>
                                <Col xs={6} md={4}>
                                    <Jumbotron>
                                        <h2>Latest Search</h2>
                                        <p>{this.state.lastSearch}</p>
                                        <p><OverlayTrigger placement="bottom" overlay={tooltip4}>
                                            <Button bsStyle="primary">Learn more</Button>
                                        </OverlayTrigger>
                                        </p>
                                    </Jumbotron>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6} md={4}>
                                    <Jumbotron>
                                        <h1>1</h1>
                                        <p>Open source github repo(s)</p>
                                        <p>
                                        <a href="https://github.com/sogwiz/assyrian_dictionary_web"><Button bsStyle="primary">Github Repo</Button></a>
                                        </p>
                                    </Jumbotron>
                                </Col>
                                <Col xs={6} md={4}>
                                    <Jumbotron>
                                        <h1>4</h1>
                                        <p>Hero Subscribers</p>
                                        <p><OverlayTrigger placement="bottom" overlay={tooltipSubscribe}>
                                        <a href="https://sargonsays.memberful.com/checkout?plan=23192"><Button bsStyle="success">Support sargonsays for $2/month.</Button></a>
                                        </OverlayTrigger>
                                        </p>
                                    </Jumbotron>
                                </Col>
                            </Row>
                            </Grid>

                    </Tab>
                    <Tab eventKey={2} title="Popular Searches">
                        <Grid>
                            <Row>
                                <h3>Trends Cloud and Most Popular Searches</h3>
                                <Panel collapsible defaultExpanded header="Trends Cloud">
                                <div className="tagcloudbg">
                                <TrendsCloud terms={this.state.rows}/>
                                </div>
                                </Panel>
                                <br/>
                                <ReactDataGrid
                                    onGridSort={this.handleGridSort.bind(this)}
                                    enableCellSelect={false}
                                    columns={this._columns}
                                    rowGetter={this.rowGetter.bind(this)}
                                    rowsCount={this.state.rows.length}
                                    minHeight={500}
                                />
                            </Row>
                        </Grid>
                    </Tab>
                    <Tab eventKey={3} title="Verified Words">
                        <Grid>
                            <Row>
                                <h3>Terms with accurate translations</h3>
                                <ReactDataGrid
                                    enableCellSelect={false}
                                    columns={this._columns2}
                                    rowGetter={this.rowGetter2.bind(this)}
                                    rowsCount={this.state.rowsVerified.length}
                                    minHeight={500}
                                />
                            </Row>
                        </Grid>
                    </Tab>
                    <Tab eventKey={4} title="Recent Updates">
                        <Grid>
                            <Row>
                            <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverHoverFocus}>
                                <h3>Terms and Definitions added recently</h3>
                            </OverlayTrigger>
                                <RecentUpdates />
                            </Row>
                        </Grid>

                    </Tab>
                </Tabs>




            </div>
        );
    }
}

export default Trends

class TrendsCloud extends React.Component {
    getRandom(arr, n) {
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len;
        }
        return result;
    }

    render (){
        //const terms = this.props.terms.slice(0,50);
        const terms = this.getRandom(this.props.terms, 50);

      const customRenderer = (tag, size, color) => (
        <span key={tag.value}
              style={{
                animation: 'blinker 5s linear infinite',
                animationDelay: `${Math.random() * 2}s`,
                fontSize: `${size}em`,
                border: `2px solid ${color}`,
                margin: '3px',
                padding: '3px',
                display: 'inline-block',
                color: 'white',
                cursor: 'pointer',
              }}>
              <a href={"/word/"+tag.value} data-tip="" data-for={tag.value} className="nounderline">{tag.value}</a>
              <ReactTooltip place="bottom" delayHide={1000} class='extraClass' id={tag.value} html={true}/>
              </span>
      )
          var data = terms.map(function(obj){
              var wordText = obj['word']
              if (_.includes(wordText, "fuck") || _.includes(wordText, "dick")) {
                    wordText = "profanity"
                } 

            return( {
             value: wordText,
             count: obj['queries']
            })
          })
          return ( 
            <TagCloud tags={data}
            minSize={2}
            maxSize={7}
            renderer={customRenderer}
             />     
          )
        }
}