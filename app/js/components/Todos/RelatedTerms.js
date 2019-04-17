import React from 'react'
import { Link } from 'react-router'
import { TagCloud } from 'react-tagcloud';
import ReactTooltip from 'react-tooltip'

class RelatedTerms extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      relatedSearchTerms : null
    };
    
    this.queryRelatedTerms(this.props.searchkeynum);
  }

  queryRelatedTerms(searchkeynum) {
  /*
  const query = new Parse.Query('DictionaryWordDefinitionList')
  .equalTo('searchkeynum',parseInt(searchkeynum))
  .descending('boost')
  .limit(30)
  */
 const that = this
 fetch('/api/searchkeynum/related/'+searchkeynum)
            .then((response) => response.json())
            .then (data => {
                that.setState({
                  relatedSearchTerms: data
                })
            })
  }

  render() {
    if(this.state.relatedSearchTerms){
      /*
      var terms = this.state.relatedSearchTerms.map(function(obj){
        return (<RelatedTerm entry={obj} />)
      })
      //this is one option. not using it right now
      */
      return (<div className="posnormal">
      <div className="tagcloudbg">
        <FancyTerms terms={this.state.relatedSearchTerms}/>
        </div>
        </div>);
    }else {
      return (<div>.</div>)
    }
  }

}

export default RelatedTerms

class RelatedTerm extends React.Component {
  render (){
    const entry = this.props.entry;

        return ( 
          <div className="posnormal"><a href={"/word/"+entry.get('word')}>{entry.get('word')}</a></div>
        );
      }
}

class FancyTerms extends React.Component {
  

  render (){
    const terms = this.props.terms;
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
          <ReactTooltip place="bottom" delayHide={1000} class='extraClass' id={tag.value} html={true} getContent={() => { return "Rank : " + tag.count.toString().substring(0,4) + " / 100"}}/>
          </span>
  )
      var data = terms.map(function(obj){
        return( {
         value: obj['word'],
         count: obj['boost'] 
        })
      })
      return ( 
        <TagCloud tags={data}
        minSize={1}
        maxSize={6}
        renderer={customRenderer}
         />      
      )
    }
}