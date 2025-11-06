import React from 'react'
import { Accordion, Card, ListGroup} from 'react-bootstrap';

class FinanceTable extends React.Component {
    render() {
        const items = [
            { type: 'revenue', amount: '$25.00', period: 'per month', description: 'Advertising Revenue on Google Adsense (I want to remove ads to make it a clean site)' },
            { type: 'volunteer', amount: 'Volunteer', period: '', description: 'Linguistic Researchers and community members who keep the language data pristine and correct (30 hours a month)' },
            { type: 'volunteer', amount: 'Volunteer', period: '', description: 'Software Development Time and Energy (20 hours a month)' },
            { type: 'expense', amount: '$25.00', period: 'per month', description: 'Cloud Hosting for web app on Microsoft Azure and domain on DreamHost' },
            { type: 'expense', amount: '$22.00', period: 'per month', description: 'Software Development tools (Cursor IDE)' },
            { type: 'expense', amount: '$10.00', period: 'per month', description: 'Cloud Hosting App Container and Database Server' }
        ];

        // Calculate totals
        const totalRevenue = 25.00;
        const totalExpenses = 25.00 + 22.00 + 10.00; // 57.00
        const net = totalRevenue - totalExpenses; // -32.00

        return (
            <div className="finance-table-wrapper">
                <Accordion>
                    <Card className="finance-card">
                        <Card.Header className="finance-card-header">
                            <Accordion.Toggle as="div" variant="link" eventKey="0" className="finance-toggle">
                                <div className="finance-header-content">
                                    <span className="finance-header-icon">💰</span>
                                    <span className="finance-header-text">Cost and Revenue Streams</span>
                                    <span className="finance-header-arrow">▼</span>
                                </div>
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body className="finance-card-body">
                                <div className="finance-summary">
                                    <div className="finance-summary-item revenue">
                                        <span className="finance-summary-label">Revenue</span>
                                        <span className="finance-summary-amount">${totalRevenue.toFixed(2)}/mo</span>
                                    </div>
                                    <div className="finance-summary-item expense">
                                        <span className="finance-summary-label">Expenses</span>
                                        <span className="finance-summary-amount">${totalExpenses.toFixed(2)}/mo</span>
                                    </div>
                                    <div className="finance-summary-item net">
                                        <span className="finance-summary-label">Net</span>
                                        <span className="finance-summary-amount">${net.toFixed(2)}/mo</span>
                                    </div>
                                </div>
                                <ListGroup className="finance-list">
                                    {items.map((item, index) => (
                                        <ListGroup.Item 
                                            key={index} 
                                            className={`finance-item finance-item-${item.type}`}
                                        >
                                            <div className="finance-item-header">
                                                <span className="finance-item-amount">
                                                    {item.amount} {item.period && <span className="finance-item-period">{item.period}</span>}
                                                </span>
                                                <span className={`finance-item-badge finance-badge-${item.type}`}>
                                                    {item.type === 'revenue' ? 'Revenue' : item.type === 'expense' ? 'Expense' : 'Volunteer'}
                                                </span>
                                            </div>
                                            <p className="finance-item-description">{item.description}</p>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div>
        )
    }
}

export default FinanceTable
