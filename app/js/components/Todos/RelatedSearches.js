import React from 'react'
import { Link } from 'react-router'

class RelatedSearches extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      relatedSearches : null
    };

    if(this.props.searchTerm){

        this.makeRequest(this.props.searchTerm)
    }
  }

  componentDidUpdate(prevProps, prevState){
      if((prevProps) && (prevProps.searchTerm==this.props.searchTerm)){

      }else {
          this.makeRequest(this.props.searchTerm)
      }
  }
  componentDidMount(){
    this.makeRequest(this.props.searchTerm);
  }

  makeRequest(searchTerm){
      
      if(searchTerm){
        fetch('/api/word/related/'+searchTerm)
        .then((response) => response.json())
        .then (data => {
            let searches = data.map((singleWord => {
                return (
                <li><a href={"/word/"+singleWord.word}>{singleWord.word}</a></li>
                )
            }))
            this.setState({relatedSearches:searches})
        })
      }
  }

  render() {
      
    if(this.state.relatedSearches){
      /*
      var terms = this.state.relatedSearchTerms.map(function(obj){
        return (<RelatedTerm entry={obj} />)
      })
      //this is one option. not using it right now
      */
      return (<div>Searches related to {this.props.searchTerm}
      <ul>
      {this.state.relatedSearches}
      </ul>
        </div>);
    }else {
      return (<div></div>)
    }
  }

}

export default RelatedSearches