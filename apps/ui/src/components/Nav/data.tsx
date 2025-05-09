import { urls } from "@budgeting/ui/utils/urls";
import { 
  Home,
  Receipt,
  AccountBalance,
  Person,
  Store,
  Category,
} from "@mui/icons-material"

// ----------------------------------------------------------------------

export const NAV_ITEMS = [
  {
    items: [
      {
        title: 'Dashboard',
        path: urls.home,
        icon: <Home />,
      },
      {
        title: 'Transactions',
        path: urls.transactions,
        icon: <Receipt />,
      },
      {
        title: 'Merchants',
        path: urls.merchants,
        icon: <Store />,
      },
      {
        title: 'Categories',
        path: urls.categories,
        icon: <Category />,
      },
    ],
  },
  {
    subheader: 'Settings',
    items: [
      {
        title: 'My Accounts',
        path: urls.accounts,
        icon: <AccountBalance />,
      },
      {
        title: 'Profile',
        path: urls.profile,
        icon: <Person />,
      },
    ],
  },
];
