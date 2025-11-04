import React from 'react'
import { Accordion, Button, OverlayTrigger, Card, Tooltip } from 'react-bootstrap';
import GoogleAd from './GoogleAd.js';
import ReactAudioPlayer from 'react-audio-player'
import AudioHelperString from '../util/AudioHelper.js'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import styled from 'styled-components'

const PhrasesPageContainer = styled.div`
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

const PhrasesGrid = styled.div`
    margin-top: 24px;
    
    .accordion {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
        
        @media (min-width: 768px) {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }
        
        @media (min-width: 1200px) {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
        }
    }
`

const PhraseCard = styled(Card)`
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid #e5e7eb;
    overflow: hidden;
    transition: all 0.2s ease-in-out;
    margin-bottom: 0;
    
    &:hover {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        transform: translateY(-2px);
    }
    
    @media (max-width: 768px) {
        border-radius: 8px;
    }
    
    .card-header {
        background: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
        padding: 16px 20px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        
        &:hover {
            background: #f3f4f6;
        }
        
        button {
            background: none;
            border: none;
            width: 100%;
            text-align: left;
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            padding: 0;
            cursor: pointer;
            
            &:hover {
                color: #2563eb;
            }
        }
    }
    
    .card-body {
        padding: 20px;
    }
`

const HeaderSubtitle = styled.div`
    font-size: 14px;
    font-weight: 400;
    color: #6b7280;
    margin-top: 4px;
    font-style: italic;
`

const PageTitle = styled.h1`
    font-size: 32px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0;
    
    @media (max-width: 768px) {
        font-size: 28px;
    }
`

const ActionButtons = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
`

const AramaicText = styled.div`
    text-align: center;
    padding: 20px 0;
    margin-bottom: 16px;
    
    h4 {
        margin: 0;
        font-size: 32px;
        
        @media (max-width: 768px) {
            font-size: 28px;
        }
    }
`

const PhoneticRow = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
    padding: 12px;
    background: #f9fafb;
    border-radius: 8px;
    
    &:last-child {
        margin-bottom: 0;
    }
    
    @media (min-width: 640px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
`

const PhoneticLabel = styled.div`
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
    
    @media (min-width: 640px) {
        margin-bottom: 0;
        margin-right: 16px;
    }
`

const PhoneticValue = styled.h4`
    margin: 8px 0;
    font-size: 18px;
    font-weight: 500;
    color: #1f2937;
    
    @media (min-width: 640px) {
        margin: 0;
        flex: 1;
    }
`

const AudioWrapper = styled.div`
    flex-shrink: 0;
    margin-top: 8px;
    
    @media (min-width: 640px) {
        margin-top: 0;
    }
`

const StyledButton = styled(Button)`
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s ease-in-out;
    
    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
`

const CopyButton = styled(Button)`
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 18px;
    background: none;
    border: none;
    color: #6b7280;
    transition: all 0.2s ease-in-out;
    
    &:hover {
        color: #2563eb;
        background: #eff6ff;
        transform: translateY(-1px);
    }
`

class LinkCellFormatter extends React.Component {
    static propTypes = {
        //value: React.PropTypes.number.isRequired
    };

    render() {
        const term = this.props.value;
        const urlTerm = "http://sargonsays.com/searchkey/" + term;
        return (
            <div>
                <a href={urlTerm}>{term}</a>
            </div>);
    }
}

class Phrases extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: new Array(),
            activeKey: -1,
            value: '',
            copied: false,
        };
        this._columns = [
            {
                key: 'searchkeynum',
                name: 'id',
                formatter: LinkCellFormatter,
                editable: false
            },
            {
                key: 'english',
                name: 'phrase',
                editable: false
            },
            {
                key: 'phonetic',
                name: 'phonetic_east',
                editable: false
            },
            {
                key: 'partofspeech',
                name: 'type',
                editable: false
            }
        ];

        this.queryPhrases();
    }
    handleSelect(activeKey) {
        this.setState({ activeKey });
    }

    queryPhrases() {

        const that = this;
        fetch('/api/phrases')
            .then((response) => response.json())
            .then (data => {
                that.setState({
                    rows: data
                })
            })
    }

    rowGetter(i) {
        //console.log('in rowgetter ' + i)

        if (this.state == null) {
            console.log('state is null')
            return;
        }

        if (this.state.rows != null && this.state.rows.length > 0) {
            var listitem = this.state.rows[i];
            return listitem;
        }
        return "invalid";

    }

    render() {
        if (this.state == null || this.state.rows == null || this.state.rows.length < 1) { return (<div />); }

        var entries = [];
        for (var i = 0; i < this.state.rows.length; i++) {
            const entry = this.state.rows[i];
            var donate = "";
            const tooltip = (
                <Tooltip id={entry['searchkeynum']}><strong>Click</strong> to see details about the spelling, audio, origin, and more about this phrase</Tooltip>
            );
            const tooltipCopy = (
                <Tooltip><strong>Click</strong> to copy full details for this phrase to your clipboard</Tooltip>
            );

            if (i % 6 == 0) {
                donate = (<GoogleAd
                    client="ca-pub-4439019971526085"
                    slot="8013892948"
                    format="fluid"
                />)
            }

            entries.push(
                <div key={entry['searchkeynum']}>
                    <PhraseCard>
                        <Card.Header>
                            <Accordion.Toggle as={Card.Header} eventKey={entry['searchkeynum']}>
                                <div>
                                    {entry['english']}
                                    {entry['phonetic'] && (
                                        <HeaderSubtitle>{entry['phonetic']}</HeaderSubtitle>
                                    )}
                                </div>
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={entry['searchkeynum']}>
                            <Card.Body>
                                <AramaicText>
                                    <h4>
                                        <span className="east-syriac-qasha">{entry['east']}</span>
                                    </h4>
                                </AramaicText>
                                
                                <PhoneticRow>
                                    <div style={{ flex: 1 }}>
                                        <PhoneticLabel>Phonetic - East</PhoneticLabel>
                                        <PhoneticValue>{entry['phonetic']}</PhoneticValue>
                                    </div>
                                    <AudioWrapper>
                                        <ReactAudioPlayer 
                                            src={AudioHelperString(entry['audio'], 'e', entry['searchkeynum'])} 
                                            controls 
                                            style={{ width: '100%', minWidth: '200px' }}
                                        />
                                    </AudioWrapper>
                                </PhoneticRow>
                                
                                <PhoneticRow>
                                    <div style={{ flex: 1 }}>
                                        <PhoneticLabel>Phonetic - West</PhoneticLabel>
                                        <PhoneticValue>{entry['phonetic_west']}</PhoneticValue>
                                    </div>
                                    <AudioWrapper>
                                        <ReactAudioPlayer 
                                            src={AudioHelperString(entry['audio_west'], 'w', entry['searchkeynum'])} 
                                            controls 
                                            style={{ width: '100%', minWidth: '200px' }}
                                        />
                                    </AudioWrapper>
                                </PhoneticRow>
                                
                                <ActionButtons>
                                    <CopyToClipboard 
                                        text={entry['english'] + " \n Assyrian phonetic: " + entry['phonetic'] + " \n http://sargonsays.com/phrases"}
                                        onCopy={() => toast("Copied phrase details for " + entry['english'])}
                                    >
                                        <OverlayTrigger placement="bottom" overlay={tooltipCopy}>
                                            <CopyButton variant="link">📋</CopyButton>
                                        </OverlayTrigger>
                                    </CopyToClipboard>
                                    <OverlayTrigger placement="bottom" overlay={tooltip}>
                                        <a href={"/searchkey/" + entry['searchkeynum']}>
                                            <StyledButton variant="primary">Learn more</StyledButton>
                                        </a>
                                    </OverlayTrigger>
                                </ActionButtons>
                            </Card.Body>
                        </Accordion.Collapse>
                    </PhraseCard>
                    {donate}
                </div>
            );
        }

        return (
            <PhrasesPageContainer>
                {<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />}
                {<link rel="stylesheet" href="https://bootswatch.com/3/cosmo/bootstrap.min.css" />}
                <br /><br /><br />
                <PageTitle>Phrases</PageTitle>
                <PhrasesGrid>
                    <Accordion>
                        {entries}
                    </Accordion>
                </PhrasesGrid>
            </PhrasesPageContainer>
        );
    }
}

export default Phrases