import React from 'react';
import styled from 'styled-components';
import { unlockSupporter, isSupporterUnlocked, resetSupporter } from '../utils/supporter';

const Wrapper = styled.div`
    margin: 16px 0;
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #f9fafb;
    max-width: 420px;
`;

const Title = styled.p`
    font-size: 13px;
    color: #6b7280;
    margin: 0 0 10px 0;
`;

const InputRow = styled.div`
    display: flex;
    gap: 8px;
`;

const CodeInput = styled.input`
    flex: 1;
    padding: 7px 10px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    outline: none;
    &:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
    }
`;

const UnlockButton = styled.button`
    padding: 7px 16px;
    background: #4f46e5;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    white-space: nowrap;
    &:hover { background: #4338ca; }
    &:disabled { background: #a5b4fc; cursor: not-allowed; }
`;

const Message = styled.p`
    margin: 8px 0 0 0;
    font-size: 13px;
    color: ${props => props.error ? '#dc2626' : '#16a34a'};
`;

const ActiveRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
`;

const ActiveText = styled.p`
    margin: 0;
    font-size: 13px;
    color: #16a34a;
    font-weight: 500;
`;

const ResetLink = styled.button`
    background: none;
    border: none;
    color: #9ca3af;
    font-size: 12px;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
    &:hover { color: #6b7280; }
`;

class SupporterCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            status: null, // null | 'success' | 'error'
            unlocked: isSupporterUnlocked()
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const success = unlockSupporter(this.state.code);
        if (success) {
            this.setState({ status: 'success', unlocked: true, code: '' });
        } else {
            this.setState({ status: 'error' });
        }
    }

    handleReset = () => {
        resetSupporter();
        this.setState({ unlocked: false, status: null, code: '' });
    }

    render() {
        const { unlocked, status, code } = this.state;

        if (unlocked) {
            return (
                <Wrapper>
                    <ActiveRow>
                        <ActiveText>Supporter mode is active. Ads and support prompts are hidden.</ActiveText>
                        <ResetLink onClick={this.handleReset}>Reset</ResetLink>
                    </ActiveRow>
                </Wrapper>
            );
        }

        return (
            <Wrapper>
                <Title>Already a supporter? Enter your code to remove ads and support prompts.</Title>
                <form onSubmit={this.handleSubmit}>
                    <InputRow>
                        <CodeInput
                            type="text"
                            placeholder="Enter supporter code"
                            value={code}
                            onChange={e => this.setState({ code: e.target.value, status: null })}
                        />
                        <UnlockButton type="submit" disabled={!code.trim()}>
                            Unlock
                        </UnlockButton>
                    </InputRow>
                </form>
                {status === 'success' && (
                    <Message>Supporter mode activated! Ads and support prompts are now hidden. Thank you.</Message>
                )}
                {status === 'error' && (
                    <Message error>Code not recognized. Check your supporter email for the code.</Message>
                )}
            </Wrapper>
        );
    }
}

export default SupporterCode;
