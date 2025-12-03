// src/app/(dashboard)/users/features/components/UsersTable.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Tooltip,
  Typography,
  Button,
  Chip,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Popover,
  Divider,
  Pagination,
  useMediaQuery,
  PaginationItem,
  PaginationRenderItemParams,
  Menu,
  useTheme,
  alpha,
  SelectChangeEvent,
} from "@mui/material";
import {
  Add as AddIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  // Refresh as RefreshIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowLeft as PreviousIcon,
  KeyboardArrowRight as NextIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { User } from "../types/user.types";



// Types
export type UserStatus = "active" | "inactive" | "suspended" | "pending";
export type SubscriptionPlan = "free" | "basic" | "premium" | "enterprise";
export type UserRole = "user" | "admin" | "moderator";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FiltersState {
  status?: UserStatus;
  plan?: SubscriptionPlan;
  role?: UserRole;
}

interface UsersTableProps {
  // Data
  users: User[]; // Use imported User type
  pagination?: PaginationMeta;
  isLoading?: boolean;
  hasError?: boolean;

  // Filters
  currentFilters: FiltersState;
  localSearch: string;

  // Selection
  selectedUsers: User[]; // Use imported User type
  selectedUserIds: string[];

  // Handlers
  onUserSelect: (user: User) => void; // Use imported User type
  onUserEdit: (user: User) => void; // Use imported User type
  onUserDelete: (user: User) => Promise<boolean> | Promise<void> | void;
  onAddUser: () => void;
  onExportUsers: () => Promise<boolean> | Promise<void> | (() => void);
  onRefresh: () => void;
  onSearchChange: (search: string) => void;
  onFilterChange: (filters: Partial<FiltersState>) => void;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onToggleSelection: (userId: string) => void;
  onSelectAll: (users: User[]) => void; // Use imported User type
  onClearAllSelection: () => void;
  onRemoveFromSelection: (userId: string) => void;

  // States
  isExporting?: boolean;
  isRefreshing?: boolean;
}

// ==================== CONSTANTS & UTILS ====================

const STATUS_COLORS: Record<UserStatus, string> = {
  active: "success.main",
  inactive: "error.main",
  suspended: "warning.main",
  pending: "text.secondary",
} as const;

const PLAN_COLORS: Record<SubscriptionPlan, string> = {
  free: "info.main",
  basic: "secondary.main",
  premium: "warning.main",
  enterprise: "primary.main",
} as const;

const ROLE_COLORS: Record<UserRole, string> = {
  user: "info.main",
  admin: "error.main",
  moderator: "warning.main",
} as const;

const formatUserRole = (role: UserRole): string => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const formatUserStatus = (status: UserStatus): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// ==================== REUSABLE COMPONENTS ====================

const StatusBadge: React.FC<{ status?: UserStatus }> = ({ status }) => {
  const theme = useTheme();
  if (!status) return null;

  return (
    <Typography
      variant="body2"
      sx={{
        color: STATUS_COLORS[status] || theme.palette.text.secondary,
        fontWeight: 500,
      }}
    >
      {formatUserStatus(status)}
    </Typography>
  );
};

const PlanBadge: React.FC<{ plan?: SubscriptionPlan }> = ({ plan }) => {
  const theme = useTheme();
  if (!plan) return null;

  return (
    <Typography
      variant="body2"
      sx={{
        color: PLAN_COLORS[plan] || theme.palette.text.secondary,
        fontWeight: 500,
      }}
    >
      {plan}
    </Typography>
  );
};

const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  const theme = useTheme();

  return (
    <Typography
      variant="body2"
      sx={{
        color: ROLE_COLORS[role] || theme.palette.text.secondary,
        fontWeight: 500,
        textTransform: "capitalize",
      }}
    >
      {formatUserRole(role)}
    </Typography>
  );
};

// ==================== SUB-COMPONENTS ====================
const SelectedUserPreview: React.FC<{
  selectedUsers: User[];
  onUserSelect: (user: User) => void;
  onUserEdit: (user: User) => void;
  onUserDelete: (user: User) => void;
  onClearSelection: () => void;
  onRemoveUser?: (userId: string) => void;
}> = ({ 
  selectedUsers, 
  onUserSelect, 
  onUserEdit, 
  onUserDelete, 
  onClearSelection 
}) => {
  const theme = useTheme();
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  if (selectedUsers.length === 0) {
    return null;
  }

  // Handler Functions
  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    event.stopPropagation();
    setActionMenuAnchor(event.currentTarget);
    setSelectedUser(user);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedUser(null);
  };

  const handleEdit = () => {
    if (selectedUser) {
      onUserEdit(selectedUser);
    }
    handleActionMenuClose();
  };

  const handleDelete = () => {
    if (selectedUser) {
      onUserDelete(selectedUser);
    }
    handleActionMenuClose();
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Main Selection Card */}
      <Card
        sx={{
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  flexShrink: 0,
                }}
              >
                {selectedUsers.length}
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Selected Users
                </Typography>
              </Box>
            </Box>

            <Tooltip title="Clear selection">
              <IconButton
                size="small"
                onClick={onClearSelection}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main',
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Users List */}
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {selectedUsers.map((user) => (
              <Box
                key={user.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  mb: 1,
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    transform: 'translateX(4px)',
                  },
                }}
                onClick={() => onUserSelect(user)}
              >
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                      {user.fullName}
                    </Typography>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: 
                          user.status === 'active' ? alpha(theme.palette.success.main, 0.1) :
                          user.status === 'inactive' ? alpha(theme.palette.error.main, 0.1) :
                          alpha(theme.palette.warning.main, 0.1),
                        color:
                          user.status === 'active' ? theme.palette.success.main :
                          user.status === 'inactive' ? theme.palette.error.main :
                          theme.palette.warning.main,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {user.status}
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {user.email}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Typography variant="body2" fontWeight={600} color="primary.main">
                      {user.plan}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.role}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {user.id.slice(0, 8)}...
                    </Typography>
                  </Box>
                </Box>

                <Tooltip title="More actions">
                  <IconButton
                    size="small"
                    onClick={(e) => handleActionMenuOpen(e, user)}
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Box>

        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 240,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            overflow: 'visible',
            mt: 1,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              backgroundColor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              boxShadow: '-2px -2px 5px rgba(0, 0, 0, 0.05)',
            },
          },
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        {selectedUser && (
          <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
            <Typography variant="subtitle2" fontWeight={600} noWrap>
              {selectedUser.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {selectedUser.email}
            </Typography>
          </Box>
        )}

        <MenuItem 
          onClick={handleEdit}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <EditIcon sx={{ color: 'primary.main' }} />
            <Box>
              <Typography variant="body2">Edit User</Typography>
              <Typography variant="caption" color="text.secondary">
                Modify user information
              </Typography>
            </Box>
          </Box>
        </MenuItem>
        
        <Divider sx={{ my: 1 }} />

        <MenuItem 
          onClick={handleDelete}
          sx={{
            py: 1.5,
            color: 'error.main',
            '&:hover': {
              backgroundColor: alpha(theme.palette.error.main, 0.08),
              color: 'error.dark',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <DeleteIcon />
            <Box>
              <Typography variant="body2">Delete User</Typography>
              <Typography variant="caption" color="error.main">
                Permanent action
              </Typography>
            </Box>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};

const Toolbar: React.FC<{
  selectedCount: number;
  onAddUser: () => void;
  onExport?: () => Promise<boolean> | Promise<void> | (() => void);
  onRefresh?: () => void;
  isExporting?: boolean;
  isLoading?: boolean;
}> = ({
  selectedCount,
  onAddUser,
  onExport,
  // onRefresh,
  isExporting = false,
  // isLoading = false,
}) => {
  const theme = useTheme();

  const handleExport = async () => {
    if (onExport) {
      try {
        await onExport();
      } catch (error) {
        console.error("Export failed:", error);
      }
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
      >
        {selectedCount > 0 && (
          <Typography variant="body2" color="text.secondary">
            {selectedCount} user{selectedCount !== 1 ? "s" : ""} selected
          </Typography>
        )}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          {/* {onRefresh && (
            <Tooltip title="Refresh users">
              <Button
                startIcon={<RefreshIcon />}
                onClick={onRefresh}
                variant="outlined"
                size="medium"
                disabled={isLoading}
                sx={{ borderRadius: 2, minWidth: "auto", px: 2 }}
              >
                Refresh
              </Button>
            </Tooltip>
          )} */}

          {onExport && (
            <Tooltip title="Export users data to CSV">
              <LoadingButton
                startIcon={<DownloadIcon />}
                onClick={handleExport}
                loading={isExporting}
                loadingPosition="start"
                variant="outlined"
                size="medium"
                sx={{ borderRadius: 1, minWidth: "auto", px: 2 }}
              >
                {isExporting ? "Exporting..." : "Export"}
              </LoadingButton>
            </Tooltip>
          )}

          <Button
            startIcon={<AddIcon />}
            onClick={onAddUser}
            variant="contained"
            size="medium"
            sx={{
              borderRadius: 1,
              minWidth: "auto",
              px: 3,
              fontWeight: 600,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              "&:hover": {
                boxShadow: `0 6px 20px ${alpha(
                  theme.palette.primary.main,
                  0.4
                )}`,
                transform: "translateY(-1px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Add User
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

const FilterComponent: React.FC<{
  searchTerm: string;
  statusFilter?: UserStatus;
  planFilter?: SubscriptionPlan;
  roleFilter?: UserRole;
  onSearchChange: (search: string) => void;
  onStatusChange: (status?: UserStatus) => void;
  onPlanChange: (plan?: SubscriptionPlan) => void;
  onRoleChange: (role?: UserRole) => void;
  onClearFilters: () => void;
}> = (props) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const hasActiveFilters = Boolean(
    props.searchTerm ||
      props.statusFilter ||
      props.planFilter ||
      props.roleFilter
  );

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) =>
    setFilterAnchorEl(event.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);

  const filterOptions = [
    {
      label: "Status",
      value: props.statusFilter || "",
      onChange: (value: string) => {
        props.onStatusChange((value as UserStatus) || undefined);
        handleFilterClose();
      },
      options: ["", "active", "inactive", "suspended", "pending"],
    },
    {
      label: "Plan",
      value: props.planFilter || "",
      onChange: (value: string) => {
        props.onPlanChange((value as SubscriptionPlan) || undefined);
        handleFilterClose();
      },
      options: ["", "free", "basic", "premium", "enterprise"],
    },
    {
      label: "Role",
      value: props.roleFilter || "",
      onChange: (value: string) => {
        props.onRoleChange((value as UserRole) || undefined);
        handleFilterClose();
      },
      options: ["", "user", "admin", "moderator"],
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          placeholder="Search users..."
          value={props.searchTerm}
          onChange={(e) => props.onSearchChange(e.target.value)}
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
            ),
          }}
        />

        <Button
          variant={hasActiveFilters ? "contained" : "outlined"}
          color={hasActiveFilters ? "primary" : "inherit"}
          startIcon={<FilterIcon />}
          endIcon={<ExpandMoreIcon />}
          onClick={handleFilterClick}
          size="medium"
          sx={{
            borderRadius: 1,
            minWidth: "auto",
            px: 2,
            borderColor: hasActiveFilters ? "primary.main" : "divider",
          }}
        >
          Filters
          {hasActiveFilters && (
            <Chip
              label="On"
              size="small"
              color="primary"
              sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
            />
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={props.onClearFilters}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Clear
          </Button>
        )}
      </Stack>

      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: { width: 320, maxHeight: 400, borderRadius: 2, p: 2, mt: 1 },
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Filter Users
        </Typography>

        <Stack spacing={2}>
          {filterOptions.map(({ label, value, onChange, options }) => (
            <FormControl key={label} fullWidth size="small">
              <InputLabel>{label}</InputLabel>
              <Select
                value={value}
                label={label}
                onChange={(e) => onChange(e.target.value)}
              >
                <MenuItem value="">All {label}s</MenuItem>
                {options.slice(1).map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
          <Divider />
        </Stack>
      </Popover>

      {hasActiveFilters && (
        <Box sx={{ mt: 2 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
          >
            <FilterIcon fontSize="small" color="action" />
            {props.searchTerm && (
              <Chip
                label={`Search: "${props.searchTerm}"`}
                size="small"
                onDelete={() => props.onSearchChange("")}
              />
            )}
            {props.statusFilter && (
              <Chip
                label={`Status: ${props.statusFilter}`}
                size="small"
                onDelete={() => props.onStatusChange(undefined)}
              />
            )}
            {props.planFilter && (
              <Chip
                label={`Plan: ${props.planFilter}`}
                size="small"
                onDelete={() => props.onPlanChange(undefined)}
              />
            )}
            {props.roleFilter && (
              <Chip
                label={`Role: ${props.roleFilter}`}
                size="small"
                onDelete={() => props.onRoleChange(undefined)}
              />
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

const PaginationComponent: React.FC<{
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}> = ({ pagination, onPageChange, onPageSizeChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { page, limit, total, totalPages } = pagination;

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newSize = Number(event.target.value);
    onPageSizeChange?.(newSize);
    onPageChange(1);
  };

  const getDisplayRange = () => {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    return { start, end };
  };

  const { start, end } = getDisplayRange();
  if (total === 0) return null;

  // Fix: Use the proper MUI type for pagination item
  const renderPaginationItem = (item: PaginationRenderItemParams) => {
    if (isMobile && item.type === "page") return null;
    if (item.type === "previous" || item.type === "next") {
      return (
        <IconButton
          onClick={item.onClick}
          disabled={item.disabled}
          sx={{ borderRadius: 1, "&.Mui-disabled": { opacity: 0.5 } }}
        >
          {item.type === "previous" ? <PreviousIcon /> : <NextIcon />}
        </IconButton>
      );
    }
    return <PaginationItem {...item} component="button" />;
  };

  return (
    <Box sx={{ py: 3 }}>
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={isMobile ? 2 : 0}
        justifyContent="space-between"
        alignItems={isMobile ? "stretch" : "center"}
      >
        <Box>
          <Typography variant="body2" color="text.secondary">
            Showing{" "}
            <Typography
              component="span"
              variant="body2"
              fontWeight="bold"
              color="text.primary"
            >
              {start}-{end}
            </Typography>{" "}
            of{" "}
            <Typography
              component="span"
              variant="body2"
              fontWeight="bold"
              color="text.primary"
            >
              {total.toLocaleString()}
            </Typography>{" "}
            users
          </Typography>
        </Box>

        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={2}
          alignItems={isMobile ? "stretch" : "center"}
        >
          {onPageSizeChange && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rows per page</InputLabel>
              <Select
                value={limit}
                label="Rows per page"
                onChange={handlePageSizeChange}
              >
                {[10, 25, 50, 100].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option} per page
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => onPageChange(newPage)}
            color="primary"
            size={isMobile ? "small" : "medium"}
            showFirstButton
            showLastButton
            siblingCount={isMobile ? 0 : 1}
            boundaryCount={isMobile ? 1 : 2}
            renderItem={renderPaginationItem}
            sx={{
              "& .MuiPaginationItem-root": { fontWeight: 600, borderRadius: 2 },
              "& .MuiPaginationItem-page.Mui-selected": {
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": { backgroundColor: "primary.dark" },
              },
            }}
          />
        </Stack>
      </Stack>

      {isMobile && (
        <Box sx={{ textAlign: "center", mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Page {page} of {totalPages}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const TableComponent: React.FC<{
  users: User[]; // Use imported User type
  selectedUserIds: string[];
  onUserSelect: (user: User) => void; // Use imported User type
  onUserEdit: (user: User) => void; // Use imported User type
  onUserDelete: (user: User) => void; // Use imported User type
  onToggleSelection: (userId: string) => void;
  onSelectAll: (users: User[]) => void; // Use imported User type
  isLoading?: boolean;
  hasError?: boolean;
}> = ({
  users,
  selectedUserIds,
  onUserSelect,
  onUserEdit,
  onUserDelete,
  onToggleSelection,
  onSelectAll,
  isLoading = false,
  hasError = false,
}) => {
  const theme = useTheme();
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const isEmpty = users.length === 0;

  const handleSelectAll = () => onSelectAll(users);

  const handleActionMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    user: User
  ) => {
    event.stopPropagation();
    setActionMenuAnchor(event.currentTarget);
    setSelectedUser(user);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedUser(null);
  };

  const handleEdit = () => {
    if (selectedUser) {
      onUserEdit(selectedUser);
    }
    handleActionMenuClose();
  };

  const handleDelete = () => {
    if (selectedUser) {
      onUserDelete(selectedUser);
    }
    handleActionMenuClose();
  };

  const handleView = () => {
    if (selectedUser) {
      onUserSelect(selectedUser);
    }
    handleActionMenuClose();
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Loading users...
        </Typography>
      </Box>
    );
  }

  const renderTableRows = () => {
    if (hasError) return renderErrorState();
    if (isEmpty) return renderEmptyState();
    return users.map(renderUserRow);
  };

  const renderErrorState = () => (
    <TableRow>
      <TableCell colSpan={7} sx={{ textAlign: "center", py: 8 }}>
        <WarningIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
        <Typography variant="h6" color="error.main" gutterBottom>
          Unable to Load Users
        </Typography>
        <Typography variant="body2" color="text.secondary">
          There was an error loading the users data
        </Typography>
      </TableCell>
    </TableRow>
  );

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={7} sx={{ textAlign: "center", py: 8 }}>
        <WarningIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Users Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Users will appear here once they register on the platform
        </Typography>
      </TableCell>
    </TableRow>
  );

  const renderUserRow = (user: User) => (
    <TableRow
      key={user.id}
      hover
      sx={{ cursor: "pointer" }}
      onClick={() => onUserSelect(user)}
    >
      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={selectedUserIds.includes(user.id)}
          onChange={() => onToggleSelection(user.id)}
        />
      </TableCell>
      <TableCell>
        <Typography fontWeight="medium">{user.fullName}</Typography>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <PlanBadge plan={user.plan} />
      </TableCell>
      <TableCell>
        <StatusBadge status={user.status} />
      </TableCell>
      <TableCell>
        <RoleBadge role={user.role} />
      </TableCell>
      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
        <Tooltip title="Actions">
          <IconButton
            size="small"
            onClick={(e) => handleActionMenuOpen(e, user)}
            sx={{
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedUserIds.length > 0 &&
                    selectedUserIds.length < users.length
                  }
                  checked={
                    users.length > 0 && selectedUserIds.length === users.length
                  }
                  onChange={handleSelectAll}
                  disabled={isEmpty || hasError}
                />
              </TableCell>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderTableRows()}</TableBody>
        </Table>
      </TableContainer>

      {!hasError && !isEmpty && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Showing {users.length} user{users.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 160,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MenuItem onClick={handleView}>
          <ViewIcon sx={{ mr: 2, fontSize: 20, color: "text.secondary" }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 2, fontSize: 20, color: "text.secondary" }} />
          Edit User
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 2, fontSize: 20 }} />
          Delete User
        </MenuItem>
      </Menu>
    </>
  );
};

// ==================== MAIN COMPONENT ====================

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  pagination,
  isLoading = false,
  hasError = false,
  currentFilters,
  localSearch,
  selectedUsers,
  selectedUserIds,
  onUserSelect,
  onUserEdit,
  onUserDelete,
  onAddUser,
  onExportUsers,
  onRefresh,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  onPageChange,
  onPageSizeChange,
  onToggleSelection,
  onSelectAll,
  onClearAllSelection,
  onRemoveFromSelection,
  isExporting = false,
  isRefreshing = false,
}) => {
  // Check if there are active filters
  const hasActiveFilters = Boolean(
    localSearch ||
      currentFilters.status ||
      currentFilters.plan ||
      currentFilters.role
  );
  const isEmptyState = users.length === 0 && !isLoading;

  return (
    <Box className="flex flex-col gap-3">
      {/* Selected Users Preview */}
      <SelectedUserPreview
        selectedUsers={selectedUsers}
        onUserSelect={onUserSelect}
        onUserEdit={onUserEdit}
        onUserDelete={onUserDelete}
        onClearSelection={onClearAllSelection}
        onRemoveUser={onRemoveFromSelection}
      />

      {/* Filters and Toolbar */}
      <Box className="flex flex-row justify-between">
        {/* Filters */}
        <FilterComponent
          searchTerm={localSearch}
          statusFilter={currentFilters.status}
          planFilter={currentFilters.plan}
          roleFilter={currentFilters.role}
          onSearchChange={onSearchChange}
          onStatusChange={(status) => onFilterChange({ status })}
          onPlanChange={(plan) => onFilterChange({ plan })}
          onRoleChange={(role) => onFilterChange({ role })}
          onClearFilters={onClearFilters}
        />

        {/* Toolbar */}
        <Toolbar
          selectedCount={selectedUsers.length}
          onAddUser={onAddUser}
          onExport={onExportUsers}
          onRefresh={onRefresh}
          isExporting={isExporting}
          isLoading={isLoading || isRefreshing}
        />
      </Box>

      {/* Content Area */}
      {isEmptyState ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <WarningIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {hasActiveFilters ? "No Users Found" : "No Users Yet"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {hasActiveFilters
              ? "Try adjusting your search criteria or filters to find what you're looking for."
              : "Get started by adding your first user to the platform."}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddUser}
            sx={{ mr: hasActiveFilters ? 2 : 0 }}
          >
            Add User
          </Button>
          {hasActiveFilters && (
            <Button variant="outlined" onClick={onClearFilters}>
              Clear Filters
            </Button>
          )}
        </Box>
      ) : (
        <>
          {/* Users Table */}
          <TableComponent
            users={users}
            selectedUserIds={selectedUserIds}
            onUserSelect={onUserSelect}
            onUserEdit={onUserEdit}
            onUserDelete={onUserDelete}
            onToggleSelection={onToggleSelection}
            onSelectAll={onSelectAll}
            isLoading={isLoading || isRefreshing}
            hasError={hasError}
          />

          {/* Pagination */}
          {pagination && pagination.total > 0 && (
            <PaginationComponent
              pagination={pagination}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          )}
        </>
      )}
    </Box>
  );
};
