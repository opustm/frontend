import React from 'react';
import {Link} from 'react-router-dom';
import NavigationBar from './navbar.component';

export default function Home(props) {  
    return (
        <div>
            {/* <NavigationBar loggedIn={props.loggedIn} onLoggedInChange={props.onLoggedInChange}></NavigationBar> */}
            <div className="container-fluid">
                <div className="row">
                {/* <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                    <div className="sidebar-sticky pt-3">
                    <ul className="nav flex-column">
                        <li className="nav-link">
                            <Link className="nav-link" to='/'>Dashboard</Link>
                        </li>
                        <li className="nav-link">
                            <Link className="nav-link" to='/teams'>Teams</Link>
                        </li>
                        <li className="nav-link">
                            <Link className="nav-link" to='/about'>About</Link>
                        </li>
                    </ul>
            
                    <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                        <span>Saved reports</span>
                        <a className="d-flex align-items-center text-muted" href="https://google.com" aria-label="Add a new report">
                        <span data-feather="plus-circle"></span>
                        </a>
                    </h6>
                    <ul className="nav flex-column mb-2">
                        <li className="nav-item">
                        <a className="nav-link" href="https://google.com">
                            <span data-feather="file-text"></span>
                            Current month
                        </a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="https://google.com">
                            <span data-feather="file-text"></span>
                            Last quarter
                        </a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="https://google.com">
                            <span data-feather="file-text"></span>
                            Social engagement
                        </a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="https://google.com">
                            <span data-feather="file-text"></span>
                            Year-end sale
                        </a>
                        </li>
                    </ul>
                    </div>
                </nav>
             */}
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Dashboard</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="btn-group mr-2">
                        <button type="button" className="btn btn-sm btn-outline-secondary">Share</button>
                        <button type="button" className="btn btn-sm btn-outline-secondary">Export</button>
                        </div>
                        <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                        <span data-feather="calendar"></span>
                        This week
                        </button>
                    </div>
                    </div>
                </main>
                </div>
            </div>
        </div>

    
    )
}
