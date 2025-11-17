import { useRef, useEffect } from "react";
import { Box, IconButton, Badge } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import NotificationPanel from "./NotificationPanel";
import { useGetNotificationStatsQuery } from "../../../api/notificationApi";

interface NotificationBellProps {
  openNotifs: boolean;
  setOpenNotifs: (open: boolean) => void;
}

const NotificationBell = ({ openNotifs, setOpenNotifs }: NotificationBellProps) => {
  const { data: statsData } = useGetNotificationStatsQuery();
  const unreadCount = statsData?.unreadCount || 0;
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setOpenNotifs(false);
      }
    };

    if (openNotifs) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openNotifs, setOpenNotifs]);

  return (
    <Box sx={{ position: "relative" }} ref={notificationRef}>
      <IconButton
        onClick={() => setOpenNotifs(!openNotifs)}
        sx={{
          backgroundColor: openNotifs ? "rgba(66, 166, 5, 0.08)" : "background.default",
          color: openNotifs ? "primary.main" : "text.secondary",
          "&:hover": { 
            backgroundColor: "rgba(66, 166, 5, 0.12)",
            color: "primary.main",
          },
        }}
      >
        <Badge 
          badgeContent={unreadCount} 
          color="error" 
          overlap="circular"
          max={99}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Notification Panel */}
      {openNotifs && (
        <Box sx={{ position: "absolute", right: 0, top: "100%", mt: 1, zIndex: 50 }}>
          <NotificationPanel onClose={() => setOpenNotifs(false)} />
        </Box>
      )}
    </Box>
  );
};

export default NotificationBell;