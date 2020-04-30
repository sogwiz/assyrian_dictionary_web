import React from 'react'

class TrendsQueriesCount extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [],
            isSearching: false
        };
    }

  componentDidMount() {
      this.queryCount()
  }

    queryCount() {
        this.setState({
            isSearching: true,
            searchTime: new Date().getTime(),
        });

        const that = this;

        fetch('/api/stats/queries')
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
                    errorObj: error,
                    rows: []
                })
              })

        
            /*
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
        })*/
        /*
        this.setState({
            rows: query.count()
        })*/
    }

    render() {
        const value = this.state.rows.length == 0 ? 558000 : this.state.rows[0]['count']
        
        return(
            <div>
              {value.toLocaleString()}
            </div>
        );

    }
}
    export default TrendsQueriesCount