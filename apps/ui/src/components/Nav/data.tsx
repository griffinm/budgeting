import { 
  Home,
  Receipt,
  AccountBalance,
  Person,
} from "@mui/icons-material"

// ----------------------------------------------------------------------

export const NAV_ITEMS = [
  {
    // subheader: 'Marketing',
    items: [
      {
        title: 'Dashboard',
        path: '/Dashboard',
        icon: <Home />,
        // caption: 'Display only admin role',
      },
      {
        title: 'Transactions',
        path: '/Transactions',
        icon: <Receipt />,
      },
      // {
      //   title: 'Blog',
      //   path: '#blog',
      //   icon: <Home />,
      //   children: [
      //     {
      //       title: 'Item 1',
      //       path: '#blog/item-1',
      //       caption: 'Display caption',
      //       info: '+2',
      //     },
      //     { title: 'Item 2', path: '#blog/item-2' },
      //   ],
      // },
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
