import React from 'react'
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data, Filters } from "react-data-grid-addons";
import {Container, Row, Col} from 'react-bootstrap';
import styled from 'styled-components'
import { isSupporterUnlocked, setupMemberful, CHECKOUT_URL } from '../../utils/supporter';

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

const SupportBanner = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    padding: 12px 16px;
    margin: 0 16px 12px 16px;
    font-size: 13px;
    color: #1e40af;
    flex-wrap: wrap;
`

const SupportBannerText = styled.span`
    flex: 1;
    min-width: 200px;
`

const SupportBannerActions = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
`

const SupportBannerButton = styled.a`
    padding: 5px 14px;
    background: #2563eb;
    color: white !important;
    border-radius: 6px;
    font-size: 13px;
    text-decoration: none !important;
    white-space: nowrap;
    &:hover { background: #1d4ed8; }
`

const DismissButton = styled.button`
    background: none;
    border: none;
    color: #93c5fd;
    font-size: 18px;
    cursor: pointer;
    line-height: 1;
    padding: 0 2px;
    &:hover { color: #60a5fa; }
`

const BANNER_DISMISS_KEY = 'nameBannerDismissed';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

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
        const definition_arr = this.props.value.slice(1).map(p => p.replace(/&quot;/g, "'"));
        const isNumbered = definition_arr.length > 1 && /^\d+\./.test(definition_arr[0]);

        if (isNumbered) {
            return (
                <StyledDiv>
                    {definition_arr.map((meaning, i) => (
                        <p key={i} style={{marginBottom: 2}}>{meaning}</p>
                    ))}
                </StyledDiv>
            );
        }
        return (
            <StyledDiv>
                <p>{definition_arr.join(" ")}</p>
            </StyledDiv>
        );
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
        const { value } = this.props;
        if (Array.isArray(value)) {
            return (
                <div>
                    {value.map(link => (
                        <span key={link.key} style={{marginRight: 6}}>
                            <a href={`/searchkey/${link.key}`}>{link.num}</a>
                        </span>
                    ))}
                </div>
            );
        }
        return (
            <div>
                <a href={`/searchkey/${value}`}>Info</a>
            </div>
        );
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

        const dismissedAt = localStorage.getItem(BANNER_DISMISS_KEY);
        const bannerDismissed = dismissedAt && (Date.now() - parseInt(dismissedAt, 10)) < THIRTY_DAYS_MS;

        this.state = {
            rows,
            originalRows,
            filters: new Array(),
            selectedLetter: null,
            bannerDismissed: !!bannerDismissed
        }
    }

    componentDidMount() {
        this.queryNames();
        setupMemberful();
    }

    queryNames(){
        const that = this

        fetch('/api/names')
        .then((response) => response.json())
        .then(data => {
            const deduped = that.deduplicateRows(data);
            that.setState({
                rows: deduped,
                originalRows: deduped
            }, setupMemberful)
        })
    }

    deduplicateRows(data) {
        const getMeaningText = (row) => {
            const def = row.definition_arr || [];
            return def.slice(1).join(" ").replace(/&quot;/g, "'");
        };

        // Map of groupKey -> { resultIndex, meanings: [{prefix, row}] }
        const seen = new Map();
        const result = [];

        data.forEach(row => {
            const nameKey = (row.english_short || '').toLowerCase().trim();
            const assyrianKey = (row.east || '').trim();
            const groupKey = `${nameKey}|||${assyrianKey}`;
            const meaning = getMeaningText(row);
            const meaningPrefix = meaning.substring(0, 20);

            if (!seen.has(groupKey)) {
                seen.set(groupKey, {
                    resultIndex: result.length,
                    meanings: [{ prefix: meaningPrefix, row }]
                });
                result.push({ ...row });
            } else {
                const entry = seen.get(groupKey);
                const alreadySeen = entry.meanings.some(m => m.prefix === meaningPrefix);

                if (alreadySeen) {
                    // Exact duplicate — discard
                    return;
                }

                // Different meaning — merge into existing row
                entry.meanings.push({ prefix: meaningPrefix, row });
                const mergedRow = result[entry.resultIndex];
                const allMeanings = entry.meanings;

                const header = (mergedRow.definition_arr || [])[0];
                mergedRow.definition_arr = [
                    header,
                    ...allMeanings.map((m, i) => `${i + 1}. ${getMeaningText(m.row)}`)
                ];

                if (!Array.isArray(mergedRow.searchkeynum)) {
                    mergedRow.searchkeynum = [
                        { num: 1, key: allMeanings[0].row.searchkeynum }
                    ];
                }
                mergedRow.searchkeynum.push({
                    num: allMeanings.length,
                    key: row.searchkeynum
                });
            }
        });

        return result;
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

    handleBannerDismiss = () => {
        localStorage.setItem(BANNER_DISMISS_KEY, Date.now().toString());
        this.setState({ bannerDismissed: true });
    }

    renderSupportBanner = () => {
        if (isSupporterUnlocked() || this.state.bannerDismissed) return null;
        return (
            <SupportBanner>
                <SupportBannerText>
                    Enjoying Assyrian Names? sargonsays is free because of community contributions.
                </SupportBannerText>
                <SupportBannerActions>
                    <SupportBannerButton href={CHECKOUT_URL}>
                        &#9825; Keep Assyrian Alive
                    </SupportBannerButton>
                    <DismissButton onClick={this.handleBannerDismiss} title="Dismiss for 30 days">
                        &times;
                    </DismissButton>
                </SupportBannerActions>
            </SupportBanner>
        );
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
                                {this.renderSupportBanner()}
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