// ** Icons Import
import { Home, Circle } from 'react-feather'

export default [
    {
        id: 'dashboards',
        title: 'Dashboards',
        icon: <Home size={20} />,
        badge: 'light-warning',
        badgeText: '3',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                icon: <Circle size={12} />,
                navLink: '/dashboards/dashboard'
            },
            {
                id: 'realtimeDash',
                title: 'Real Time',
                icon: <Circle size={12} />,
                navLink: '/dashboards/real-time'
            },
            {
                id: 'brandCodeDash',
                title: 'Brand Code',
                icon: <Circle size={12} />,
                navLink: '/dashboards/brand-code'
            }
        ]
    }
]
