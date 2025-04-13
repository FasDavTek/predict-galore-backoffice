import React from 'react';
import { Box, IconButton, InputBase } from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

const Header = () => {
  return (
    <Box className="flex items-center justify-between px-9 py-4 bg-shadewhite">
      <Box className="flex items-center gap-2 px-4 py-3.5 w-[629px] rounded-lg border border-[#d9d9de]">
        <SearchIcon className="text-gray-400" />
        <InputBase
          className="flex-1 ml-2"
          placeholder="Search here..."
          inputProps={{ 'aria-label': 'search' }}
        />
      </Box>

      <Box className="flex items-center justify-end gap-3">
        <IconButton className="w-10 h-10 bg-gray-100">
          <NotificationsIcon />
        </IconButton>

        <Box className="relative w-10 h-10 bg-green-50 rounded-[200px] border-[1.5px] border-[#42a605] flex items-center justify-center">
          <span className="font-paragraph-medium-semibold text-grey-900 text-center">
            AS
          </span>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;