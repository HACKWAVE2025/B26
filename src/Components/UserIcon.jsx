import React from 'react';

const UserIcon = ({ email }) => (
    <span>{email ? email.charAt(0).toUpperCase() : 'U'}</span>
);

export default UserIcon;