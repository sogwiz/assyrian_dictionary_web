import React from 'react'
import { Link } from 'react-router'
const ParseComponent = ParseReact.Component(React)
mixins: [ParseReact.Mixin]
import Parse from 'parse'
import ParseReact from 'parse-react'
import ReactDataGrid from 'react-data-grid'

const LinkCellFormatter = React.createClass({
    propTypes: {
        //value: React.PropTypes.number.isRequired
    },

    render() {
        const term = this.props.value;
        const urlTerm = "http://sargonsays.com/searchkey/" + term.toString().split(":")[1];
        return (
            <div>
                <a href={urlTerm}>{term.toString().split(":")[0]}</a>
            </div>)
    }
});

const DateCellFormatter = React.createClass({
    propTypes: {
        //value: React.PropTypes.number.isRequired
    },

    render() {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        var date = new Date(this.props.value)
        const dateString = date.toLocaleDateString('en-us', options)
        return (
            <div>
                {dateString}
            </div>)
    }
})

class RecentUpdates extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: new Array(),
            isLoading: false
        };

        this._columns = [
            {
                name: 'Word or phrase',
                key: 'word',
                formatter: LinkCellFormatter
            },
            {
                name: 'Add / Update Date',
                key: '_updated_at',
                formatter: DateCellFormatter
            }
        ]

    }

    componentDidMount(){
        this.setState({
            isLoading: true
        })
        
        const query = new Parse.Query('DictionaryWordDefinitionList')
        query.limit(50).descending('_updated_at')

        const that = this;
        query.find({
            success: function(results){
                that.setState({
                    isLoading: false,
                    rows: results
                })
            },
            error: function(error){
                that.setState({
                    isLoading: false,
                    error: true,
                    errorObj: error,
                    rows: []
                })
            }
        })
    }

    rowGetter(i) {

        if (this.state == null) {
            return
        }

        if(this.state.rows != null && this.state.rows.length > 0) {
            var listitem = this.state.rows[i]
            var result = {word: listitem.get('word') + ":" + listitem.get("searchkeynum"), _updated_at: listitem.updatedAt.toString(), searchkeynum: listitem.get('searchkeynum')}
            return result
        }
        return null
    }

    render() {
        if (this.state == null || this.state.rows == null || this.state.rows.length < 1) { return (<div />)}

        return (
                <ReactDataGrid
                    enableCellSelect={true}
                    columns={this._columns}
                    rowGetter={this.rowGetter.bind(this)}
                    rowsCount={this.state.rows.length}
                    minHeight={500} />
        )
    }
}

export default RecentUpdates