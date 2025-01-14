import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineShoppingCart,
	HiOutlineUsers,
	HiOutlineDocumentText,
	HiOutlineAnnotation,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog,
	HiServer,
	HiWifi,
	HiStatusOnline
} from 'react-icons/hi'

import {
	MdOutlineManageAccounts
} from 'react-icons/md'

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/',
		icon: <HiOutlineViewGrid />,
		subkeys: []
	},
	{
		key: 'ip',
		label: 'IP',
		path: '/products',
		icon: <HiStatusOnline />,
		subkeys: [
			{
				key: 'pool',
				label: 'Pool',
				path: '/pool',
			},
			{
				key: 'addresses',
				label: 'Addresses',
				path: '/addresses',
			},
		]
	},
	{
		key: 'ppp',
		label: 'PPP',
		path: '/ppp',
		icon: <MdOutlineManageAccounts />,
		subkeys: [
		{
			key: 'pppServer',
			label: 'PPP Server',
			path: '/ppp-server',
		},
		{
			key: 'pppProfile',
			label: 'Profiles',
			path: '/ppp/profiles',
		}
	]
	},
	{
		key: 'dhcp',
		label: 'DHCP',
		path: '/dhcp',
		icon: <HiOutlineCube />,
		subkeys: [
			{
				key: 'dhcp-packages',
				label: 'Packages',
				path: '/dhcp/packages',
			},
			{
				key: 'dhcp-server',
				label: 'Server',
				path: '/dhcp/server',
			},
			{
				key: 'dhcp-network',
				label: 'Network',
				path: '/dhcp/network',
			},
		]
	},
	{
		key: 'hotspot',
		label: 'Hotspot',
		path: '/hotspot',
		icon: <HiWifi />,
		subkeys: [
		{
			key: 'packages',
			label: 'Packages',
			path: '/packages',
		},
		{
			key: 'access-points',
			label: 'Access Points',
			path: '/access-points',
		},
		{
			key: 'devices',
			label: 'Clients',
			path: '/devices',
		},
		{
			key: 'events',
			label: 'Events',
			path: '/events',
		},
		{
			key: 'staticPage',
			label: 'Static Page',
			path: '/guest/s/default',
		}
	]
	},
	{
		key: 'customers',
		label: 'Customers',
		path: '/customers',
		icon: <HiOutlineUsers />,
		subkeys: [
			{
				key: 'all',
				label: 'All',
				path: '/customers',
			},
			{
				key: 'pppoeClients',
				label: 'PPPoE',
				path: '/customers/ppp',
			},
			{
				key: 'staticClients',
				label: 'Static',
				path: '/customers/static',
			},
		]
	},
	{
		key: 'transactions',
		label: 'Transactions',
		path: '/transactions',
		icon: <HiOutlineDocumentText />,
		subkeys: [
			{
				key: 'payments',
				label: 'Hotspot',
				path: '/payments',
			},
		]
	},
	{
		key: 'messages',
		label: 'Messages',
		path: '/messages',
		icon: <HiOutlineAnnotation />,
		subkeys: [{
			key: 'sent_sms',
			label: 'SMS',
			path: '/sent-sms',
		},
		{
			key: 'sent_emails',
			label: 'Emails',
			path: '/sent-emails',
		},
	]
	},
	{
		key: 'reports',
		label: 'Reports',
		path: '/reports',
		icon: <HiServer />,
		subkeys: [
			{
				key: 'connections',
				label: 'Hotspot',
				path: '/connections',
			},
		]
	},
	{
		key: 'settings',
		label: 'Settings',
		path: '/settings',
		icon: <HiOutlineCog />,
		subkeys: [{
			key: 'router',
			label: 'Router',
			path: '/router',
		},
		{
			key: 'sms',
			label: 'SMS',
			path: '/sms',
		},
		{
			key: 'mpesa',
			label: 'M-Pesa',
			path: '/mpesa',
		},
		{
			key: 'hotspot',
			label: 'Hotspot',
			path: '/unifi',
		},
		{
			key: 'mpesa-express',
			label: 'M-Pesa Express',
			path: '/mpesa-express',
		},
		{
			key: 'email',
			label: 'Email',
			path: '/email',
		}
	]
	},
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'support',
		label: 'Help & Support',
		path: '/support',
		icon: <HiOutlineQuestionMarkCircle />
	}
]
