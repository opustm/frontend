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

// export const SidebarTeams = [
//     {
//         title:'Senior Project',
//         path:'#',
//         photo: 'https://via.placeholder.com/40/F2C94C?text=D',
//         cName:'nav-text team',
//         groups:['Comedy','Drama']
//     },
//     {
//         title:'LutherCS',
//         path:'#',
//         photo: 'https://via.placeholder.com/40/6FCF97?text=M',
//         cName:'nav-text team',
//         groups: ['Sales','Marketing','Food']
//     },
//     {
//         title:'LutherBands',
//         path:'#',
//         photo: 'https://via.placeholder.com/40/2F80ED?text=L',
//         cName:'nav-text team',
//         groups:['Biology','Physics']
//     },
//     {
//         title:'Track-Team',
//         path:'#',
//         photo: 'https://via.placeholder.com/40/2F80ED?text=T',
//         cName:'nav-text team',
//         groups:['Biology','Physics']
//     },
//     {
//         title:'Photography-Club',
//         path:'#',
//         photo: 'https://via.placeholder.com/40/D9740F?text=PC',
//         cName:'nav-text team',
//         groups:['Biology','Physics']
//     },
//     {
//         title:'Math-Study-Group',
//         path:'#',
//         photo: 'https://via.placeholder.com/40/D62741?text=M',
//         cName:'nav-text team',
//         groups:['Biology','Physics']
//     },
//     {
//         title:'Prarie Houses',
//         path:'#',
//         photo: 'https://via.placeholder.com/40/2F80ED?text=PH',
//         cName:'nav-text team',
//         groups:['Biology','Physics']
//     },
// ]