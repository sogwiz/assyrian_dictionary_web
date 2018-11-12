import React, { Component} from 'react'

class DefinitionHelper extends React.Component {
    
    
    getCleanArrWithHtml(original){
        if(!original)return null;
        var x = original.map( function(item) {return item.replace(new RegExp("[0-9]","g"),'').replace(/[\[\]']+/g,''); })
          //var searchkey = item.match(/\d+/)
          //var url = "/searchkey/"+searchkey;
        //return <a href='<a href='+url+'>'+
        
         //item.replace(new RegExp("[0-9]","g"),'').replace(/[\[\]']+/g,'');
         
        
        return x;
    }

    render() {
        var arr = this.getCleanArrWithHtml(this.props.arr);
        var rows = [];
        if(!arr)return(<span/>);
        for(var x=0; x<arr.length; x++){
            rows.push(<LineItem entry={arr[x]} source={this.props.arr[x]}/>)
        }
        return(
            <span>{rows}</span>
        );

    }
}

export default DefinitionHelper

class LineItem extends React.Component {
    render (){
        const entry = this.props.entry;
        const sourceEntry = this.props.source;
        const thenum = sourceEntry.match(/\d+/)
        const url = "/searchkey/" + thenum;

        if(thenum){
            return ( 
                <span><a href={url}>{entry}</a>  </span>
            );
        }else {
            return (
                <span>{entry}</span>
            )
        }
        

    }

}
