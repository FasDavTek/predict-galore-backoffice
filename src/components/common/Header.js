// components/common/Header.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  IconButton, 
  InputBase, 
  Badge,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  AccountCircle as ProfileIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

const Header = ({user}) => {
  
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);
  const [activeMatch, setActiveMatch] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const searchTimeoutRef = useRef(null);
  
  // Safe user data extraction with fallbacks
  const userName = user?.firstName || 'User';

  const userRole = user?.role || 'User';

  const userInitials = (
    (user?.firstName?.charAt(0) ?? '') + 
    (user?.lastName?.charAt(0) ?? '')
  ).toUpperCase() || 'US';

  const userEmail = user?.email || '';

  // Highlight text in page
  const highlightText = (query) => {
    // Remove previous highlights first
    removeHighlights();
    
    if (!query) {
      setTotalMatches(0);
      setActiveMatch(0);
      return;
    }

    const textNodes = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while (node = walker.nextNode()) {
      if (node.nodeValue.trim() && node.parentNode.nodeName !== 'SCRIPT' && node.parentNode.nodeName !== 'STYLE') {
        textNodes.push(node);
      }
    }

    let matchCount = 0;
    const regex = new RegExp(query, 'gi');

    textNodes.forEach((node) => {
      const parent = node.parentNode;
      if (parent.nodeName === 'MARK') return;

      const text = node.nodeValue;
      const matches = text.match(regex);
      if (!matches) return;

      matchCount += matches.length;
      const newText = text.replace(regex, (match) => 
        `<mark style="background-color: #ffeb3b; color: #000; padding: 0 2px;">${match}</mark>`
      );

      const newElement = document.createElement('span');
      newElement.innerHTML = newText;
      parent.replaceChild(newElement, node);
    });

    setTotalMatches(matchCount);
    setActiveMatch(matchCount > 0 ? 1 : 0);
    scrollToHighlight(1);
  };

  const removeHighlights = () => {
    const marks = document.querySelectorAll('mark');
    marks.forEach((mark) => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  };

  const scrollToHighlight = (index) => {
    const marks = document.querySelectorAll('mark');
    if (marks.length === 0) return;

    const adjustedIndex = Math.min(Math.max(index, 1), marks.length) - 1;
    marks[adjustedIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    // Highlight the active match
    marks.forEach((mark, i) => {
      mark.style.backgroundColor = i === adjustedIndex ? '#ff5722' : '#ffeb3b';
    });
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Debounce the search to improve performance
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      highlightText(query);
    }, 300);
  };

  const clearSearch = () => {
    setSearchQuery('');
    removeHighlights();
    setTotalMatches(0);
    setActiveMatch(0);
  };

  const navigateMatches = (direction) => {
    const newIndex = activeMatch + direction;
    if (newIndex > 0 && newIndex <= totalMatches) {
      setActiveMatch(newIndex);
      scrollToHighlight(newIndex);
    }
  };

  // User menu handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  // Clean up highlights when component unmounts
  useEffect(() => {
    return () => {
      removeHighlights();
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 4,
      py: 2,
      backgroundColor: 'background.paper',
      borderBottom: '1px solid',
      borderColor: 'divider',
      height: 72
    }}>
      {/* Search Bar */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Box 
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            highlightText(searchQuery);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1,
            width: { xs: 240, sm: 360, md: 480 },
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.default',
            '&:hover': {
              borderColor: 'primary.main'
            }
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase
            placeholder="Search on this page..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ flex: 1, fontSize: 14 }}
            inputProps={{ 'aria-label': 'search' }}
          />
          {searchQuery && (
            <IconButton size="small" onClick={clearSearch}>
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Search navigation controls */}
        {totalMatches > 0 && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: 'text.secondary',
            fontSize: '0.875rem'
          }}>
            <Tooltip title="Previous match">
              <IconButton 
                size="small" 
                onClick={() => navigateMatches(-1)}
                disabled={activeMatch <= 1}
              >
                <ArrowDropDownIcon sx={{ transform: 'rotate(90deg)' }} />
              </IconButton>
            </Tooltip>
            <span>{activeMatch} of {totalMatches}</span>
            <Tooltip title="Next match">
              <IconButton 
                size="small" 
                onClick={() => navigateMatches(1)}
                disabled={activeMatch >= totalMatches}
              >
                <ArrowDropDownIcon sx={{ transform: 'rotate(-90deg)' }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* User Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Notification Badge */}
        <IconButton sx={{ 
          backgroundColor: 'background.default',
          '&:hover': { backgroundColor: 'action.hover' }
        }}>
          <Badge badgeContent={notificationCount} color="error" max={9}>
            <NotificationsIcon sx={{ color: 'text.secondary' }} />
          </Badge>
        </IconButton>

        {/* User Profile */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          pl: 2,
          borderLeft: '1px solid',
          borderColor: 'divider'
        }}>
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36,
              bgcolor: 'primary.light',
              color: 'primary.main',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={handleMenuOpen}
          >
            {userInitials}
          </Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {userName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {userRole}
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={handleMenuOpen}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            <ArrowDropDownIcon sx={{ color: 'text.secondary' }} />
          </IconButton>

          {/* User Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                mt: 1.5,
                minWidth: 220,
                borderRadius: 1,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {userName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {userEmail}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={() => router.push('/settings')}>
              <SettingsIcon sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} />
              Settings
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;