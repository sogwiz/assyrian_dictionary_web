import React from 'react'
import {Accordion, Button, Card, OverlayTrigger, Popover, Tooltip, Collapse} from 'react-bootstrap';
import GoogleAd from './GoogleAd.js';
import { toast } from 'react-toastify';
import styled from 'styled-components'

const ProverbsPageContainer = styled.div`
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

const ProverbsGrid = styled.div`
    margin-top: 24px;
    
    .accordion {
        display: block;
    }
    
    /* Disable Bootstrap collapse animations to prevent Chrome jitter */
    .collapse {
        transition: none !important;
    }
    
    .collapsing {
        transition: none !important;
        height: auto !important;
    }
    
    /* Force instant show/hide without height calculations */
    .collapse.show {
        display: block !important;
    }
    
    .collapse:not(.show) {
        display: none !important;
    }
    
    .accordion > * {
        margin-bottom: 16px;
        
        @media (min-width: 768px) {
            display: inline-block;
            width: calc(50% - 10px);
            margin-right: 20px;
            margin-bottom: 20px;
            vertical-align: top;
        }
        
        @media (min-width: 1200px) {
            width: calc(33.333% - 16px);
            margin-right: 24px;
            margin-bottom: 24px;
        }
    }
    
    @media (min-width: 768px) {
        .accordion > *:nth-child(2n) {
            margin-right: 0;
        }
    }
    
    @media (min-width: 1200px) {
        .accordion > *:nth-child(2n) {
            margin-right: 24px;
        }
        .accordion > *:nth-child(3n) {
            margin-right: 0;
        }
    }
`

const ProverbCard = styled(Card)`
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid #e5e7eb;
    overflow: hidden;
    margin-bottom: 0;
    contain: layout style paint;
    transform: translateZ(0);
    backface-visibility: hidden;
    
    @media (max-width: 768px) {
        border-radius: 8px;
    }
    
    .card-header {
        background: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
        padding: 16px 20px;
        cursor: pointer;
        
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

const ProverbTitle = styled.h2`
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 12px;
    
    @media (max-width: 768px) {
        font-size: 20px;
    }
`

const ProverbMeaning = styled.p`
    font-size: 16px;
    color: #4b5563;
    line-height: 1.6;
    margin-bottom: 16px;
`

const MeaningFooter = styled.div`
    font-size: 14px;
    color: #6b7280;
    font-style: italic;
    line-height: 1.5;
    
    strong {
        color: #4b5563;
        font-style: normal;
    }
`

class Proverbs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: new Array(),
            activeKey: -1
        };
    }
    

    handleSelect(activeKey) {
        // Don't update state for accordion - let it be uncontrolled
        // this.setState({ activeKey });
      }

    queryProverbs() {
        const that = this;
        
        fetch('/api/proverb')
        .then((response) => response.json())
        .then (data => {
            /*let searches = data.map((singleWord => {
                return (
                <li><a href={"/word/"+singleWord.word}>{singleWord.word}</a></li>
                )
            }))*/
            that.setState({
                rows: data
            })
        })
        /*
        query.find({
            success: function (results) {
                that.setState({
                    rows: results
                })
            },
            error: function (error) {
                that.setState({
                    error: true,
                    errorObj: error,
                    rows: []
                })
            }
        })
        */
    }

    componentDidMount(){
        this.queryProverbs();
    }

    render(){
        if (this.state == null || this.state.rows == null || this.state.rows.length < 1) { return (<div><h1>Proverbs</h1></div>); }

        var entries = [];

        for(var i = 0 ; i < this.state.rows.length; i++){
            const entry = this.state.rows[i];

            var donate = "";
            var gad = ""

            if(i%5==0){
                donate = (
                    <a href="https://sargonsays.memberful.com/checkout?plan=23192"><Button variant="info">Support sargonsays for $2/month.</Button></a>
                )
            }else if(i%6==0){
                gad = (<GoogleAd 
                    client="ca-pub-4439019971526085" 
                    slot="8013892948" 
                    format="fluid" 
                  />)
            }

            entries.push(
                <div key={entry['b2dynamicentityid']}>
                    <ProverbCard>
                        <Card.Header>
                            <Accordion.Toggle as={Card.Header} eventKey={entry['b2dynamicentityid']}>
                                <div>
                                    {entry['text']}
                                    {entry['title'] && (
                                        <HeaderSubtitle>{entry['title']}</HeaderSubtitle>
                                    )}
                                </div>
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={entry['b2dynamicentityid']}>
                            <Card.Body>
                                <ProverbTitle>{entry['title']}</ProverbTitle>
                                <ActionButtons>
                                    {entry['subtext'] && (
                                        <MeaningFooter>
                                            <strong>Meaning:</strong> {entry['subtext']}
                                        </MeaningFooter>
                                    )}
                                    {donate}
                                </ActionButtons>
                            </Card.Body>
                        </Accordion.Collapse>
                    </ProverbCard>
                    {gad}
                </div>
            );
        }
        
        const popoverHoverFocuss = (
            <Popover id="popover-trigger-click" title="Literal and idiomatic translation">
            of Assyrian quotes and proverbs as well as the underlying meaning of the <strong>idiomatic expressions / phrases</strong></Popover>
        )
        const popoverHoverFocus = (
            <Tooltip placement="bottom" className="in" id="tooltip-right">
            <strong>Literal and idiomatic translation</strong> of Assyrian quotes and proverbs as well as the underlying meaning of the idiomatic expressions / phrases
          </Tooltip>
            
        )
        return (
            <ProverbsPageContainer>
                {<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />}
                {<link rel="stylesheet" href="https://bootswatch.com/3/cosmo/bootstrap.min.css"/>}
                <br /><br /><br />
                <OverlayTrigger placement="bottom" overlay={popoverHoverFocus}>
                    <PageTitle>Proverbs + Quotes</PageTitle>
                </OverlayTrigger>
                <ProverbsGrid>
                    <Accordion defaultActiveKey="">
                        {entries}
                    </Accordion>
                </ProverbsGrid>
            </ProverbsPageContainer>
        );
    }

}

export default Proverbs