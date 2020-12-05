import React from 'react';
import * as Icon from 'react-icons/fi';
import {Link} from 'react-router-dom';

function Navigation(props){
    return (
        <>
            <div className="navbar">
                <Link to="#" className="menu-bars">
                    <Icon.FiMenu/>
                </Link>
            </div>
        </>
    );
}

export default Navigation;