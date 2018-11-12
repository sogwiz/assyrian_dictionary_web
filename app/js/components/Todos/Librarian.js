import React from 'react'
import { Link } from 'react-router'
import SortableTree from 'react-sortable-tree';
import DefinitionsList from './DefinitionsList'
import _ from 'lodash'
const ParseComponent = ParseReact.Component(React)
mixins: [ParseReact.Mixin]
import Parse from 'parse'
import ParseReact from 'parse-react'
import Editor from './Editor'

class Librarian extends ParseComponent {
    constructor(props) {
        super(props);
        this.tree = [{ title: "Searching...", children: [ { title: 'Searching...' } ] }];

        this.state = {
            treeData: this.tree,
            datetime: new Date(),
            showEditor: false,
        };
    }

    observe() {
    console.log('url param ' + this.props.params.searchTerm);

    const input = this.props.params.searchTerm; 

    if (!input || input === '') {
      console.log('empty input')
      return      
    }

    this.searchTerm = this.props.params.searchTerm;
    console.log('search term ' + this.searchTerm.toLowerCase());
    
    const query = new Parse.Query('DictionaryWordDefinitionList')
    query.equalTo("word", input.toLowerCase())
    query.include('dictionary_definition_obj')
    query.limit(50)
    query.descending('boost')
      return {
      todos: query,
    }
  }

    render() {
        console.log('in render')
        if(!this.props.params.searchTerm){
            return (
                <div>
                    Must put a search term in the url field.
                    Example: <a href="http://sargonsays.com/admin/food">http://sargonsays.com/admin/food</a>
                </div>
            )
        }

        var that = this;

        const alertNodeInfo = ({
            node,
            path,
            treeIndex,
            lowerSiblingCounts: _lowerSiblingCounts,
        }) => {
            const objectString = Object.keys(node)
                .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
                .join(',\n   ');

            alert( // eslint-disable-line no-alert
                'Info passed to the button generator:\n\n' +
                `node: {\n   ${objectString}\n},\n` +
                `path: [${path.join(', ')}],\n` +
                `treeIndex: ${treeIndex}`
            );
            this.setState({
                showComponent: true,
            });

        };

        return (
            
            <div style={{ height: 800 }}>
            {this.state.showComponent ?
           <Editor /> :
           null
        }
            {this.createArrayFromObjects()}
                <SortableTree
                    treeData={this.tree}
                    onChange={this.onListDrag}
                    
                    onMoveNode={({ node, treeIndex, path }) =>
                                this.onMovedNode(node, treeIndex, path)
                            }
                    generateNodeProps={rowInfo => ({
                                buttons: [
                                    <button
                                        style={{
                                            verticalAlign: 'middle',
                                        }}
                                        onClick={() => alertNodeInfo(rowInfo)}
                                    >
                                        ℹ
                                    </button>,
                                ],
                            })}         
                />
            </div>
        
        );
    }
    changeState(){
        console.log('changing state')
        this.tree=null;
        this.data.todos = null;
        this.setState({treeData: null});
    }

    onMovedNode(node, treeIndex, path){
        console.debug( // eslint-disable-line no-console
                                    'node:', node,
                                    'treeIndex:', treeIndex,
                                    'path:', path,
                                )
        if(path[0]!=0 || path.length!=2){
            console.log("path not valid");
            this.setState({treeData: null});
            return;    
        }
        //get the boost value of the previous item and set this to be higher
        var boostItemToReplace = this.data.todos[treeIndex-1].boost;
        var boostPrevious = node.todo.boost;
        
        console.log('boost of item to replace = ' + boostItemToReplace);
        console.log('boostPrevious = ' + node.todo.boost);
        var newBoost;

        if(treeIndex==1){
            newBoost = boostItemToReplace + 1;
        }else {
            //now we have to deal with 3 items (item above, and item below)
            //item below = boostItemToReplace
            //item above = treeIndex -2
            var boostItemAbove = this.data.todos[treeIndex -2].boost;
            console.log('boost of item above = ' + boostItemAbove);
            var delta = boostItemAbove - boostItemToReplace;
            if(delta < 1){
                newBoost = boostItemToReplace + 0.01;
            }else {
                newBoost = boostItemToReplace + delta / 2.0 ;
            }
        }
        console.log('new boost is ' + newBoost);
        ParseReact.Mutation.Set(node.todo, {boost:newBoost, modification:'admin'}).dispatch().then(
            () => this.changeState()
        );

        
    }
    //doesn't do anything at the moment
    //todo: 
    onListDrag(){
        console.log('on listDrag')
        
    }

    createArrayFromObjects(){
        if(!this.data.todos || this.data.todos.length < 1) return;

        var treeArray = new Array();
        var childrenArray = new Array();

    const todos = this.data.todos.sort(function(a, b){
    return b.boost-a.boost
    })

        for(var i = 0; i<todos.length; i++){
            var definition = {todo: todos[i], title : todos[i].dictionary_definition_obj.phonetic, subtitle: todos[i].dictionary_definition_obj.definition_arr.join("\n").replace(/^ : /,"")}
            childrenArray.push(definition);
        }
        treeArray.push( {title: this.props.params.searchTerm, children: childrenArray, expanded: true})
        console.log('treeArray')
        console.log(treeArray)
        this.tree = treeArray;
    }
    
    renderEditor(){
        return <Editor/>
    }
}

export default Librarian

