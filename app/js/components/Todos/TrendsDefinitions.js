import React from 'react'

class TrendsDefinitions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: 36000,
            isSearching: false
        };

        this.queryCount();
    }

    queryCount() {
        this.setState({
            isSearching: true,
            searchTime: new Date().getTime(),
        });

        const that = this;

        fetch('/api/stats/dictionarydefinition')
            .then((response) => response.json())
            .then (data => {
                that.setState({
                    isSearching: false,
                    rows: data
                })
            })
            .catch((error) => {
                that.setState({
                    isSearching: false,
                    error: true,
                    errorObj: error
                })
              })

        /*
        this.setState({
            rows: query.count()
        })*/
    }

    render() {
        return(
            <div>
              {this.state.rows.toLocaleString()}
            </div>
        );

    }
}
    export default TrendsDefinitions