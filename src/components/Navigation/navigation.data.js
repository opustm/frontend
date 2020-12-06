import React from 'react'

import * as Icon from 'react-icons/fi';

export const SidebarApps = [
    {
        title: 'Dashboard',
        path:'/',
        icon: <Icon.FiHome/>,
        cName:'sb-text'
    },
    {
        title: 'Calendar',
        path:'/calendar',
        icon: <Icon.FiCalendar/>,
        cName:'sb-text'
    },
    {
        title: 'Teams',
        path:'/teams',
        icon: <Icon.FiTarget/>,
        cName:'sb-text'
    },
    {
        title: 'Chat',
        path:'/chat',
        icon: <Icon.FiMessageSquare/>,
        cName:'sb-text'
    },
    {
        title: 'Contacts',
        path:'/contacts',
        icon: <Icon.FiBook/>,
        cName:'sb-text'
    },
    {
        title: 'Announcements',
        path:'/announcements',
        icon: <Icon.FiRss/>,
        cName:'sb-text'
    },
]

export const SidebarTeams = [
]