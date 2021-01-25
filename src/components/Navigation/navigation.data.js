import React from 'react'

import * as Icon from 'react-icons/fi';

export const SidebarApps = [
    {
        title: 'Dashboard',
        path:'/',
        icon: <Icon.FiHome/>,
        cName:'nav-text'
    },
    {
        title: 'Calendar',
        path:'/calendar',
        icon: <Icon.FiCalendar/>,
        cName:'nav-text'
    },
    {
        title: 'Teams',
        path:'/teams',
        icon: <Icon.FiTarget/>,
        cName:'nav-text'
    },
    // {
    //     title: 'Chat',
    //     path:'/chat',
    //     icon: <Icon.FiMessageSquare/>,
    //     cName:'nav-text'
    // },
    {
        title: 'Contacts',
        path:'/contacts',
        icon: <Icon.FiBook/>,
        cName:'nav-text'
    },
    {
        title: 'Announcements',
        path:'/announcements',
        icon: <Icon.FiRss/>,
        cName:'nav-text'
    },
]

export const SidebarTeams = [
    {
        title:'Dunder Mifflin',
        path:'#',
        photo: 'https://via.placeholder.com/40/F2C94C?text=D',
        cName:'nav-text team',
        groups:['Comedy','Drama']
    },
    {
        title:'Pied Piper',
        path:'#',
        photo: 'https://via.placeholder.com/40/6FCF97?text=M',
        cName:'nav-text team',
        groups: ['Sales','Marketing','Food']
    },
    {
        title:'Luther College',
        path:'#',
        photo: 'https://via.placeholder.com/40/2F80ED?text=L',
        cName:'nav-text team',
        groups:['Biology','Physics']
    },
]