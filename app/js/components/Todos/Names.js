import React, { useState } from 'react'
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data, Filters } from "react-data-grid-addons";
import {Container, Row, Col} from 'react-bootstrap';
import styled from 'styled-components'

const StyledDiv = styled.div`
    p {
        font-size: 11px;
    }
`

const defaultColumnProperties = {
    filterable: true,
    sortable: true,
    width: 150,
    resizable: true
};

const selectors = Data.Selectors

class DefinitionCellFormatter extends React.Component {
    static propTypes = {
        //value: React.PropTypes.number.isRequired
    };

    render() {
        const definition_arr = this.props.value.slice(1)

        definition_arr.forEach(function(part, index, theArray) {
            theArray[index] = theArray[index].replace(/&quot;/g,"\'")
          })
        //const urlTerm = "/searchkey/" + term.toString().split(":")[1];
        return (
            <StyledDiv>
                <p>{definition_arr.join(" ")}</p>
            </StyledDiv>)
    }
}

class AssyrianCellFormatter extends React.Component {
    static propTypes = {
        //value: React.PropTypes.number.isRequired
    };

    render() {
        return (
            <span className="east-syriac-qasha">
                {this.props.value}
            </span>)
    }
}

class LinkCellFormatter extends React.Component {
    static propTypes = {
        //value: React.PropTypes.number.isRequired
    };

    render() {
        const urlTerm = "/searchkey/" + this.props.value
        return (
            <div>
                <a href={urlTerm}>Info</a>
            </div>)
    }
}

class GenderCellFormatter extends React.Component {
    static propTypes = {
        //value: React.PropTypes.number.isRequired
    };

    render() {
        let gender = this.props.value
        return (<div>{gender}</div>)
    }
}

const columns = [
    {
        key: "english_short",
        name: "Name",
        filterable: true,
        sortable: true,
        width: 140,
        resizable: true
    },
    {
        key: "east",
        name: "Assyrian",
        filterable: true,
        sortable: true,
        width: 180,
        resizable: true,
        formatter: AssyrianCellFormatter
    },
    {
        key: "definition_arr",
        name: "Meaning",
        width: 250,
        filterable: true,
        sortable: true,
        resizable: true,
        formatter: DefinitionCellFormatter
    },
    {
        key: "wordform",
        name: "Gender",
        filterable: true,
        width: 70,
        formatter: GenderCellFormatter
    },
    {
        key: "searchkeynum",
        name: "Info",
        filterable: false,
        width: 50,
        formatter: LinkCellFormatter
    }
]
//.map(c => ({ ...c, ...defaultColumnProperties }));



//getRows(rows, filters) {
function getRows(rows, filters) {
        //const rows = this.state.rows
        //const filters = this.state.filters
        return selectors.getRows({ rows, filters });
    }

class Names extends React.Component {
    constructor(props) {
        super(props)

        let originalRows = new Array();
        let rows = originalRows.slice(0);

        this.state = {
            rows,
            originalRows,
            filters: new Array(),

        }
    }

    componentDidMount() {
        this.queryNames()
    }

    queryNames(){
        const that = this

        fetch('/api/names')
        .then((response) => response.json())
        .then(data => {
            that.setState({
                rows: data,
                originalRows: data
            })
        })
    }

    handleFilterChange(filter){
            const newFilters = { ...this.state.filters };
            if (filter.filterTerm) {
              newFilters[filter.column.key] = filter;
            } else {
              delete newFilters[filter.column.key];
            }
            return newFilters;
    } 

    handleGridSort = (sortColumn: string, sortDirection: SortDirection) => {
        const comparer = (a: object, b: object) => {
          if (sortDirection === 'ASC') {
            return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
          } else if (sortDirection === 'DESC') {
            return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
          }
        };
    
        const rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.state.rows.sort(comparer);
    
        this.setState({ rows, filters:{} });
      }

    render(){
        
        if (this.state == null || this.state.rows == null || this.state.rows.length < 1) { return (<div />); }

        const filters = this.state.filters;
        //console.log("filters")
        //console.log(filters)
        const filteredRows = getRows(this.state.rows, filters);
        //const filteredRows = this.getRows.bind(this);

        //console.log("filterRows")
        //console.log(filteredRows.slice(0,10))
        //console.log(this.state.rows.slice(0,10))

        return (
            <div>
                <br /><br /><br />
                {<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />}
                {<link rel="stylesheet" href="https://bootswatch.com/3/cosmo/bootstrap.min.css"/>}
                <Container fluid>
                <Row>
    <Col></Col>
    <Col xs={6}>Assyrian Names</Col>
    <Col></Col>
  </Row>
                    <Row>
                        <Col>
                        <ReactDataGrid
            columns={columns}
            rowGetter={i => filteredRows[i]}
            rowsCount={filteredRows.length}
            minHeight={600}
            enableCellSelect={true}
            toolbar={<Toolbar enableFilter={true} />}
            onGridSort={this.handleGridSort}
            onAddFilter={filter => this.setState(
                {
                    filters: this.handleFilterChange(filter)
                }
            )}
            onClearFilters={() => this.setState(
                {
                    filters: {},
                    rows: this.state.originalRows
                }
            )}
            
            />
                        </Col>
                    </Row>
                
            
            </Container>
            </div>
        )
    }
}

export default Names