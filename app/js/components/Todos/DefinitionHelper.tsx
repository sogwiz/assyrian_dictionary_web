import React, { useMemo } from 'react'; // Import useMemo for performance optimization

// --- 1. Define Interfaces for Props ---

/**
 * Props for the LineItem component.
 * @param entry The cleaned string to display.
 * @param source The original (uncleaned) string from which numbers/brackets might be extracted.
 */
interface LineItemProps {
    entry: string;
    source: string;
}

/**
 * LineItem Functional Component
 * Displays an entry, potentially as a link if a number is found in the source string.
 */
const LineItem: React.FC<LineItemProps> = ({ entry, source }) => {
    // Regular expression to find a number in the source string
    const thenumMatch = source.match(/\d+/);
    const thenum = thenumMatch ? thenumMatch[0] : null; // Get the matched number or null

    const url = thenum ? `/searchkey/${thenum}` : undefined;

    if (thenum) {
        return (
            <span>
                <a href={url}>{entry}</a>{' '}
                {/* Added a space after the link for better separation as in original output */}
            </span>
        );
    } else {
        return (
            <span>{entry}</span>
        );
    }
};

// --- 2. Define Interfaces for DefinitionHelper Props ---

/**
 * Props for the DefinitionHelper component.
 * @param arr An array of strings, potentially containing numbers and brackets.
 * Can be null or undefined.
 */
interface DefinitionHelperProps {
    arr: string[] | null | undefined;
}

// --- 3. Helper Function (Pure, so can be outside component) ---
/**
 * Cleans an array of strings by removing numbers and square brackets.
 * @param original The original array of strings.
 * @returns A new array with cleaned strings, or null if the input is null/undefined.
 */
const getCleanArrWithHtml = (original: string[] | null | undefined): string[] | null => {
    if (!original) {
        return null;
    }
    // Using map directly on the array and replace with regex
    return original.map((item) =>
        item.replace(new RegExp("[0-9]", "g"), '').replace(/[\[\]']+/g, '')
    );
};

// --- 4. DefinitionHelper Functional Component ---
/**
 * DefinitionHelper Functional Component
 * Takes an array of strings, cleans them, and renders them as LineItem components.
 */
const DefinitionHelper: React.FC<DefinitionHelperProps> = ({ arr }) => {
    // Use useMemo to memoize the cleaned array.
    // This array will only be recomputed if 'arr' prop changes.
    const cleanedArr = useMemo(() => getCleanArrWithHtml(arr), [arr]);

    // If cleanedArr is null (meaning original arr was null/undefined), render an empty span
    if (!cleanedArr) {
        return <span />;
    }

    // Map over the cleaned array to create LineItem components
    const rows = cleanedArr.map((entry, index) => (
        // Pass both the cleaned 'entry' and the original 'source' string from 'arr'
        // Use index as key (not ideal for reorderable lists, but fine here)
        <LineItem key={index} entry={entry} source={arr![index]} />
    ));

    return (
        <span>{rows}</span>
    );
};

export default DefinitionHelper;

/*
import React, { Component} from 'react'

class DefinitionHelper extends React.Component {
    
    getCleanArrWithHtml(original){
        if(!original)return null;
        var x = original.map( function(item) {return item.replace(new RegExp("[0-9]","g"),'').replace(/[\[\]']+/g,''); })
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
*/
