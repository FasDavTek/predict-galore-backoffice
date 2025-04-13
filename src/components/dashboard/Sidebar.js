import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  AccountBalanceWallet as WalletIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import Image from 'next/image';

const navigationItems = [
  { icon: <DashboardIcon />, label: 'Dashboard', active: true },
  { icon: <DescriptionIcon />, label: 'Predictions', active: false },
  { icon: <PeopleIcon />, label: 'Users', active: false },
  { icon: <WalletIcon />, label: 'Transactions', active: false },
  { icon: <SettingsIcon />, label: 'Settings', active: false },
];

const Sidebar = () => {
  return (
    <Box className="w-[272px] h-full bg-basic-white border-r border-[#d9d9de] flex flex-col">
      <Box className="flex flex-col items-start gap-6 pt-6">
        <Box className="flex w-full items-center px-6 py-2">
          <Image
            src="/predict-galore-logo.png"
            alt="Predict galore logo"
            width={208}  
            height={40}  
            className="object-contain" 
            priority 
          />
        </Box>
        <List className="w-full">
          {navigationItems.map((item, index) => (
            <ListItem
              key={index}
              className={`flex items-center gap-2 px-4 py-[18px] ${
                item.active ? 'bg-green-50 border-l-4 border-[#3c9705]' : ''
              }`}
            >
              <ListItemIcon className="min-w-0 mr-2">
                {React.cloneElement(item.icon, {
                  className: `w-5 h-5 ${
                    item.active ? 'text-green-600' : 'text-gray-800'
                  }`,
                })}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                className={`${
                  item.active
                    ? 'text-green-600 font-medium'
                    : 'text-gray-800 font-normal'
                }`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;