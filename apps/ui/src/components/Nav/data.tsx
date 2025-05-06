import { 
  Home,
  Receipt,
  AccountBalance,
  Person,
  Store,
} from "@mui/icons-material"

// ----------------------------------------------------------------------

export const NAV_ITEMS = [
  {
    items: [
      {
        title: 'Dashboard',
        path: '/',
        icon: <Home />,
      },
      {
        title: 'Transactions',
        path: '/transactions',
        icon: <Receipt />,
      },
      {
        title: 'Merchants',
        path: '/merchants',
        icon: <Store />,
      },
    ],
  },
  {
    subheader: 'Settings',
    items: [
      {
        title: 'My Accounts',
        path: '/accounts',
        icon: <AccountBalance />,
      },
      {
        title: 'Profile',
        path: '/profile',
        icon: <Person />,
      },
    ],
  },
];
