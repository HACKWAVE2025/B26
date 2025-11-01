import React from 'react';
import { FiSun } from 'react-icons/fi';

const ExamplePrompt = ({ title, onClick }) => (
    <button onClick={onClick} className="prompt-button">
        <h3>{title}</h3>
    </button>
);

const ChatEmptyState = ({ setInput, handleSend }) => {
    const prompts = [
        "What are my events today?",
        "Draft a follow-up email to the marketing team",
        "Summarize my unread emails from this morning",
        "Are there any urgent tasks due today?"
    ];
    
    const handlePromptClick = (prompt) => {
        setInput(prompt);
        setTimeout(() => handleSend(prompt), 0);
    }

    return (
        <div className="empty-state">
             <div className="empty-state-icon-wrapper">
                <FiSun />
            </div>
            <h1 className="empty-state-title">How can I help you today?</h1>
            <div className="prompt-grid">
                {prompts.map(p => <ExamplePrompt key={p} title={p} onClick={() => handlePromptClick(p)} />)}
            </div>
        </div>
    );
}

export default ChatEmptyState;