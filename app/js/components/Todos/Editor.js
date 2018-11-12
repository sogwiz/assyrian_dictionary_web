import React from 'react'
import { Link } from 'react-router'
const ParseComponent = ParseReact.Component(React)
mixins: [ParseReact.Mixin]
import Parse from 'parse'
import ParseReact from 'parse-react'
import ReactDataGrid from 'react-data-grid'

class Editor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: new Array(),
            isSearching: false
        };

        this._columns = [
            {
                key: 'objectId',
                name: 'objectId',
                width: 80
            },
            {
                key: 'boost',
                name: 'boost',
                editable: true
            },
            {
                key: 'searchkeynum',
                name: 'searchkeynum',
                editable: true
            },
            {
                key: 'word',
                name: 'word',
                editable: true
            },
            {
                key: 'phonetic',
                name: 'phonetic',
                editable: true
            },
            {
                key: 'east',
                name: 'east',
                editable: true
            },
            {
                key: 'completeDate',
                name: 'Expected Complete',
                editable: true
            }
        ];

        this.onSearchFromUrl();
    }

    onSearchFromUrl() {
        const input = this.props.params.searchTerm.toLowerCase().trim();
        this.onSearch(input);
    }

    onSearch(inputVal) {
        
        const input = inputVal;
        console.log('query word ' + input)

        this.setState({
            isSearching: true,
            searchTime: new Date().getTime(),
        });

        const query = new Parse.Query('DictionaryWordDefinitionList')
        query.equalTo('word', input.toLowerCase().trim())
            .include('dictionary_definition_obj')
            .limit(30)
            .descending('boost')

        const that = this;
        query.find({
            success: function (results) {
                that.setState({
                    isSearching: false,
                    rows: results
                })
            },
            error: function (error) {
                that.setState({
                    isSearching: false,
                    error: true,
                    errorObj: error,
                    rows: []
                })
            }
        })

    }

    rowGetter(i) {
        console.log('in rowgetter ' + i)
        
        if (this.state == null) {
            console.log('state is null')
            return;
        }

        if (this.state.rows != null && this.state.rows.length > 0) {
            var listitem = this.state.rows[i];
            var definition = {objectId: listitem.objectId, boost : listitem.get('boost'), searchkeynum : listitem.get('searchkeynum'), 
            word: listitem.get('word'), phonetic : listitem.get('dictionary_definition_obj').get('phonetic'), 
            east: listitem.get('dictionary_definition_obj').get('east')}

            return definition;
        }
        return null;

    }



    createArrayFromObjects() {
        if (!this.data.todos || this.data.todos.length < 1) {
            console.log('coulndt find any todos')
            return;
        }

        const todos = this.data.todos.sort(function (a, b) {
            return b.boost - a.boost
        })

        this.rows = new Array();
        for (var i = 0; i < todos.length; i++) {
            var definition = { todo: todos[i], title: todos[i].dictionary_definition_obj.phonetic, subtitle: todos[i].dictionary_definition_obj.definition_arr.join("\n").replace(/^ : /, "") }
            this.rows.push(definition);
        }

        /*
        var treeArray = new Array();
            var childrenArray = new Array();
            for(var i = 0; i<todos.length; i++){
                var definition = {todo: todos[i], title : todos[i].dictionary_definition_obj.phonetic, subtitle: todos[i].dictionary_definition_obj.definition_arr.join("\n").replace(/^ : /,"")}
                childrenArray.push(definition);
            }
            treeArray.push( {title: this.props.params.searchTerm, children: childrenArray, expanded: true})
            console.log('treeArray')
            console.log(treeArray)
            this.tree = treeArray;
            */
    }

    render() {
        if (this.state == null || this.state.rows == null || this.state.rows.length < 1) { return (<div />); }
        return (
            <div>
                <ReactDataGrid
                    enableCellSelect={true}
                    columns={this._columns}
                    rowGetter={this.rowGetter.bind(this)}
                    rowsCount={this.state.rows.length}
                    minHeight={500}
                    onGridRowsUpdated={this.handleGridRowsUpdated} />
            </div>
        );
    }

    handleGridRowsUpdated({ fromRow, toRow, updated }) {
        let rows = this.state.rows.slice();

        for (let i = fromRow; i <= toRow; i++) {
            let rowToUpdate = rows[i];
            let updatedRow = React.addons.update(rowToUpdate, { $merge: updated });
            rows[i] = updatedRow;
        }

        this.setState({ rows });
    }

}

export default Editor