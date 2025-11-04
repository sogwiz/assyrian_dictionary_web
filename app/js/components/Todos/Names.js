import React from 'react'
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data, Filters } from "react-data-grid-addons";
import {Container, Row, Col} from 'react-bootstrap';
import styled from 'styled-components'

const StyledDiv = styled.div`
    p {
        font-size: 11px;
    }
`

const NamesPageContainer = styled.div`
    padding: 40px 20px;
    max-width: 1400px;
    margin: 0 auto;
    
    @media (max-width: 768px) {
        padding: 20px 12px;
    }
    
    @media (max-width: 480px) {
        padding: 16px 8px;
    }
`

const GridContainer = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid #e5e7eb;
    overflow: hidden;
    margin-bottom: 24px;
    
    @media (max-width: 768px) {
        border-radius: 8px;
        margin-bottom: 16px;
    }
`

const AlphabetFilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 12px;
    margin-bottom: 16px;
`

const AlphabetButtons = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
`

const LetterButton = styled.button`
    padding: 6px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: ${props => props.active ? '#337ab7' : 'white'};
    font-size: 14px;
    color: ${props => props.active ? 'white' : '#333'};
    cursor: pointer;
    
    &:hover:not(:disabled) {
        background: ${props => props.active ? '#286090' : '#f5f5f5'};
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`

const FilterInfo = styled.div`
    text-align: center;
    font-size: 12px;
    color: #666;
`

const GenderBadge = styled.div`
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: capitalize;
    background: ${props => props.isMasculine ? '#dbeafe' : '#f3f4f6'};
    color: ${props => props.isMasculine ? '#1e40af' : '#6b7280'};
`

const defaultColumnProperties = {
    filterable: true,
    sortable: true,
    width: 150,
    resizable: true
};

const selectors = Data.Selectors

class DefinitionCellFormatter extends React.Component {
    static propTypes = {
        //value: React.PropTypes.number.isRequired
    };

    render() {
        const definition_arr = this.props.value.slice(1)

        definition_arr.forEach(function(part, index, theArray) {
            theArray[index] = theArray[index].replace(/&quot;/g,"\'")
          })
        //const urlTerm = "/searchkey/" + term.toString().split(":")[1];
        return (
            <StyledDiv>
                <p>{definition_arr.join(" ")}</p>
            </StyledDiv>)
    }
}

class AssyrianCellFormatter extends React.Component {
    static propTypes = {
        //value: React.PropTypes.number.isRequired
    };

    render() {
        return (
            <span className="east-syriac-qasha">
                {this.props.value}
            </span>)
    }
}

class LinkCellFormatter extends React.Component {
    static propTypes = {
        //value: React.PropTypes.number.isRequired
    };

    render() {
        const urlTerm = "/searchkey/" + this.props.value
        return (
            <div>
                <a href={urlTerm}>Info</a>
            </div>)
    }
}

class GenderCellFormatter extends React.Component {
    static propTypes = {
        //value: React.PropTypes.number.isRequired
    };

    render() {
        let gender = this.props.value
        const isMasculine = gender && gender.toLowerCase().includes('masc')
        return (<GenderBadge isMasculine={isMasculine}>{gender}</GenderBadge>)
    }
}

const columns = [
    {
        key: "english_short",
        name: "Name",
        filterable: true,
        sortable: true,
        width: 160,
        resizable: true
    },
    {
        key: "east",
        name: "Assyrian",
        filterable: true,
        sortable: true,
        width: 200,
        resizable: true,
        formatter: AssyrianCellFormatter
    },
    {
        key: "definition_arr",
        name: "Meaning",
        width: 400,
        filterable: true,
        sortable: true,
        resizable: true,
        formatter: DefinitionCellFormatter
    },
    {
        key: "wordform",
        name: "Gender",
        filterable: true,
        width: 120,
        formatter: GenderCellFormatter
    },
    {
        key: "searchkeynum",
        name: "Info",
        filterable: false,
        width: 80,
        formatter: LinkCellFormatter
    }
]
//.map(c => ({ ...c, ...defaultColumnProperties }));



//getRows(rows, filters) {
function getRows(rows, filters) {
        //const rows = this.state.rows
        //const filters = this.state.filters
        return selectors.getRows({ rows, filters });
    }

class Names extends React.Component {
    constructor(props) {
        super(props)

        let originalRows = new Array();
        let rows = originalRows.slice(0);

        this.state = {
            rows,
            originalRows,
            filters: new Array(),
            selectedLetter: null
        }
    }

    componentDidMount() {
        this.queryNames()
    }

    queryNames(){
        const that = this

        fetch('/api/names')
        .then((response) => response.json())
        .then(data => {
            that.setState({
                rows: data,
                originalRows: data
            })
        })
    }

    handleFilterChange(filter){
            const newFilters = { ...this.state.filters };
            if (filter.filterTerm) {
              newFilters[filter.column.key] = filter;
            } else {
              delete newFilters[filter.column.key];
            }
            return newFilters;
    } 

    handleGridSort = (sortColumn, sortDirection) => {
        const comparer = (a, b) => {
          if (sortDirection === 'ASC') {
            return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
          } else if (sortDirection === 'DESC') {
            return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
          }
        };
    
        const rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.state.rows.sort(comparer);
    
        this.setState({ rows, filters: {} });
      }

    handleLetterClick = (letter) => {
        if (this.state.selectedLetter === letter) {
            // Clicking the same letter again clears the filter
            this.setState({ selectedLetter: null });
        } else {
            this.setState({ selectedLetter: letter });
        }
    }

    getAlphabetFilteredRows = (rows) => {
        const { selectedLetter } = this.state;
        if (!selectedLetter) {
            return rows;
        }
        return rows.filter(row => {
            const name = row.english_short || '';
            return name.charAt(0).toUpperCase() === selectedLetter;
        });
    }

    getLetterCounts = () => {
        const { originalRows } = this.state;
        const counts = {};
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        
        alphabet.forEach(letter => {
            counts[letter] = originalRows.filter(row => {
                const name = row.english_short || '';
                return name.charAt(0).toUpperCase() === letter;
            }).length;
        });
        
        return counts;
    }

    renderAlphabetFilter = (filteredRows) => {
        const { selectedLetter } = this.state;
        const letterCounts = this.getLetterCounts();
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const totalCount = filteredRows.length;

        return (
            <AlphabetFilterContainer>
                <AlphabetButtons>
                    <LetterButton
                        onClick={() => this.handleLetterClick(null)}
                        active={selectedLetter === null}
                    >
                        All
                    </LetterButton>
                    {alphabet.map(letter => (
                        <LetterButton
                            key={letter}
                            onClick={() => this.handleLetterClick(letter)}
                            active={selectedLetter === letter}
                            disabled={letterCounts[letter] === 0}
                            title={`${letterCounts[letter]} name${letterCounts[letter] !== 1 ? 's' : ''} starting with ${letter}`}
                        >
                            {letter}
                        </LetterButton>
                    ))}
                </AlphabetButtons>
                <FilterInfo>
                    {selectedLetter 
                        ? `Showing ${totalCount} name${totalCount !== 1 ? 's' : ''} starting with "${selectedLetter}"`
                        : `Showing all ${totalCount} names`
                    }
                </FilterInfo>
            </AlphabetFilterContainer>
        );
    }

    render(){
        
        if (this.state == null || this.state.rows == null || this.state.rows.length < 1) { return (<div />); }

        const filters = this.state.filters;
        const filteredRows = getRows(this.state.rows, filters);
        const alphabetFilteredRows = this.getAlphabetFilteredRows(filteredRows);

        return (
            <NamesPageContainer>
                <br /><br /><br />
                {<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />}
                {<link rel="stylesheet" href="https://bootswatch.com/3/cosmo/bootstrap.min.css"/>}
                <h1>Assyrian Names</h1>
                <Container fluid>
                    <Row>
                        <Col></Col>
                        <Col></Col>
                    </Row>
                    <Row>
                        <Col>
                            <GridContainer>
                                {this.renderAlphabetFilter(alphabetFilteredRows)}
                                <ReactDataGrid
                                    columns={columns}
                                    rowGetter={i => alphabetFilteredRows[i]}
                                    rowsCount={alphabetFilteredRows.length}
                                    minHeight={600}
                                    enableCellSelect={true}
                                    toolbar={<Toolbar enableFilter={true} />}
                                    onGridSort={this.handleGridSort}
                                    onAddFilter={filter => this.setState(
                                        {
                                            filters: this.handleFilterChange(filter)
                                        }
                                    )}
                                    onClearFilters={() => this.setState(
                                        {
                                            filters: {},
                                            rows: this.state.originalRows
                                        }
                                    )}
                                />
                            </GridContainer>
                        </Col>
                    </Row>
                </Container>
            </NamesPageContainer>
        )
    }
}

export default Names