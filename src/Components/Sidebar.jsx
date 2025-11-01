import React from 'react';
import { FaPlus, FaRegComment } from 'react-icons/fa';
import { IoLogOutOutline } from 'react-icons/io5';
import UserIcon from './UserIcon'; // Updated import

const Sidebar = ({ user, onSignOut, isSidebarOpen }) => {
    return (
        <aside className={`sidebar ${isSidebarOpen ? 'sidebar--open' : ''}`}>
            <button className="new-chat-button">
                <FaPlus />
                <span>New Chat</span>
            </button>
            <div className="chat-history">
                <a href="#" className="chat-history-item">
                    <FaRegComment />
                    <span>Summarize recent emails...</span>
                </a>
            </div>
            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar">
                       <UserIcon email={user?.email}/>
                    </div>
                    <span className="user-email">{user?.email}</span>
                     <button onClick={onSignOut} className="logout-button" aria-label="Sign out">
                        <IoLogOutOutline size={20}/>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;