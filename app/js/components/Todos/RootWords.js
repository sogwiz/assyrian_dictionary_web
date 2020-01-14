import React, { useState } from 'react'
import ReactDataGrid from 'react-data-grid'
import { Grid } from 'react-bootstrap';

const rootLetters = ['ܐ', 'ܒ', 'ܓ', 'ܕ', 'ܗ', 'ܘ', 'ܙ', 'ܚ', 'ܛ', 'ܝ', 'ܟ', 'ܠ', 'ܡ', 'ܢ', 'ܣ', 'ܥ', 'ܦ', 'ܨ', 'ܩ', 'ܪ', 'ܫ', 'ܬ']

const defaultColumnProperties = {
    resizable: true,
    width: 180
};


/*
const RootTextFormatter = ({ value }, { row }) => {
    console.log("row is")
    console.log(value)
    return (
        <div>
            <span>{row}</span>
            <span className="east-syriac-qasha">{value}</span>
        </div>
    )
}*/

const RootTextFormatter = React.createClass({
    /*
    propTypes: {
        //value: React.PropTypes.number.isRequired
    },*/
    
    render() {
        //const term = this.props.value;
        //const urlTerm = "/word/" + term;
        const urlRoot = "/searchkey/" + this.props.dependentValues['searchkeynum']
        return (
            <div>
            <a href={urlRoot} target="_blank"><span className="east-syriac-qasha">{this.props.value}</span></a>
        </div>)
    }
});

class RootWords extends React.Component {

    constructor(props) {
        super(props);

        let originalRows = new Array();
        let rows = originalRows.slice(0);

        this.state = { originalRows, rows};

        this._columns = [
            {
                key: 'east',
                name: 'word',
                editable: false,
                sortable: true,
                formatter: RootTextFormatter,
                getRowMetaData: (row) => row
            },
            {
                key: 'english',
                name: 'definition',
                editable: false
            },
            {
                key: 'phonetic',
                name: 'phonetic',
                editable: false
            },
        ].map(c => ({ ...c, ...defaultColumnProperties }));

        this.queryRoots()
    }

    rowGetter(i) {

        if (this.state == null) {
            console.log('state is null')
            return;
        }

        if (this.state.rows != null && this.state.rows.length > 0) {
            var listitem = this.state.rows[i];
            //var definition = {objectId: listitem.objectId, boost : listitem.get('boost'), searchkeynum : listitem.get('searchkeynum'), 
            //word: listitem.get('word'), phonetic : listitem.get('dictionary_definition_obj').get('phonetic'), 
            //east: listitem.get('dictionary_definition_obj').get('east')}

            return listitem;
        }
        return null;

    }

    queryRoots() {

        const that = this;
        fetch('/api/roots')
            .then((response) => response.json())
            .then(data => {
                that.setState({
                    originalRows: data,
                    rows: data
                })
            })
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
    
        this.setState({ rows });
      }

    render() {
        if (this.state == null || this.state.rows == null || this.state.rows.length < 1) { return (<div />); }
        
        return (
            <div>
                {<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />}
                {<link rel="stylesheet" href="https://bootswatch.com/3/cosmo/bootstrap.min.css" />}
                <ReactDataGrid
                    enableCellSelect={true}
                    columns={this._columns}
                    rowGetter={this.rowGetter.bind(this)}
                    rowsCount={this.state.rows.length}
                    minHeight={600}
                    onGridSort={this.handleGridSort}
                />
            </div>
        );
    }
}

export default RootWords