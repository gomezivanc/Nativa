import React from 'react';

export default function SmallButton(props) {
    const { type = 'button', children, onClick, className = '' } = props;
    return (
        <button
            className={`bg-primary hover:bg-primary-light font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className}`}
            type={type}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
