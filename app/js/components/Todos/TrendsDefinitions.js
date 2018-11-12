import React from 'react'
mixins: [ParseReact.Mixin]
import Parse from 'parse'
import ParseReact from 'parse-react'

class TrendsDefinitions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: 0,
            isSearching: false
        };

        this.queryCount();
    }

    queryCount() {
        this.setState({
            isSearching: true,
            searchTime: new Date().getTime(),
        });

        const query = new Parse.Query('DictionaryDefinition')

        const that = this;

        
        query.count({
            success: function (number) {
                that.setState({
                    isSearching: false,
                    rows: number
                })
            },
            error: function (error) {
                that.setState({
                    isSearching: false,
                    error: true,
                    errorObj: error,
                    rows: 0
                })
            }
        })
        /*
        this.setState({
            rows: query.count()
        })*/
    }

    render() {
        return(
            <div>
              {this.state.rows}
            </div>
        );

    }
}
    export default TrendsDefinitions