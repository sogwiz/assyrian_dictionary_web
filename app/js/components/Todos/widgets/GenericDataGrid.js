import React, { useState } from 'react'
import ReactDataGrid from 'react-data-grid'

const defaultColumnProperties = {
    resizable: true,
    width: 180
};

class RootTextFormatter extends React.Component {
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
}

class GenericDataGrid extends React.Component {
    constructor(props) {
        super(props)

        let originalRows = this.props.rows
        let rows = originalRows.slice(0)

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
    }

    rowGetter(i) {

        if (this.props == null) {
            console.log('props is null')
            return;
        }

        if (this.props.rows != null && this.props.rows.length > 0) {
            var listitem = this.props.rows[i];
            //var definition = {objectId: listitem.objectId, boost : listitem.get('boost'), searchkeynum : listitem.get('searchkeynum'), 
            //word: listitem.get('word'), phonetic : listitem.get('dictionary_definition_obj').get('phonetic'), 
            //east: listitem.get('dictionary_definition_obj').get('east')}

            return listitem;
        }
        return null;

    }

    handleGridSort = (sortColumn: string, sortDirection: SortDirection) => {
        const comparer = (a: object, b: object) => {
          if (sortDirection === 'ASC') {
            return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
          } else if (sortDirection === 'DESC') {
            return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
          }
        };
    
        const rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.props.rows.sort(comparer);
    
        this.setState({ rows });
      }

    render() {
        console.log("in render of genericdata grid")
        console.log(this.props.rows)
        if (this.props == null || this.props.rows == null || this.props.rows.length < 1) { return (<div />); }
        
        return (
            <div>
                {<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />}
                {<link rel="stylesheet" href="https://bootswatch.com/3/cosmo/bootstrap.min.css" />}
                <ReactDataGrid
                    enableCellSelect={true}
                    columns={this._columns}
                    rowGetter={this.rowGetter.bind(this)}
                    rowsCount={this.props.rows.length}
                    minHeight={600}
                    onGridSort={this.handleGridSort}
                />
            </div>
        );
    }

}

export default GenericDataGrid