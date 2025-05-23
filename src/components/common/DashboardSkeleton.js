import { 
  Box,
  Skeleton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  AppBar,
  Toolbar,
  useTheme
} from "@mui/material";

const DashboardSkeleton = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* AppBar Skeleton */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.default
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Skeleton variant="text" width={120} height={40} />
            <Box sx={{ flexGrow: 1 }} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar Skeleton */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {[1, 2, 3, 4, 5].map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Skeleton variant="circular" width={24} height={24} />
                  </ListItemIcon>
                  <ListItemText>
                    <Skeleton variant="text" width="80%" />
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
      {/* Main Content Skeleton */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        
        {/* Header Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width="40%" height={60} />
          <Skeleton variant="text" width="60%" height={40} />
        </Box>
        
        {/* Stats Skeleton */}
        <Box sx={{ 
          mb: 4, 
          display: "grid", 
          gridTemplateColumns: { 
            xs: "1fr", 
            sm: "repeat(2, 1fr)", 
            md: "repeat(4, 1fr)" 
          }, 
          gap: 3 
        }}>
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} variant="rounded" height={120} />
          ))}
        </Box>
        
        {/* Table Skeleton */}
        <Skeleton variant="rounded" height={400} />
      </Box>
    </Box>
  );
};

export default DashboardSkeleton;