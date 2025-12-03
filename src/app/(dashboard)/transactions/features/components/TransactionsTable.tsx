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
  Download as DownloadIcon,
  FilterList as FilterIcon,
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
import withAuth from "@/hoc/withAuth";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store/store";
import { Transaction, TransactionStatus, PaymentMethod, TransactionType, PaginationMeta } from "../types/transaction.types";
import { formatCurrency, formatPaymentMethod, formatTransactionStatus } from "../utils/transactionTransformers";
import { useTransactions } from "../hooks/useTransactions";
import { useTransactionActions } from "../hooks/useTransactionActions";

// Types
interface FiltersState {
  status?: TransactionStatus;
  paymentMethod?: PaymentMethod;
  type?: TransactionType;
}

interface TransactionsTableProps {
  // Data
  transactions: Transaction[];
  pagination?: PaginationMeta;
  isLoading?: boolean;
  hasError?: boolean;

  // Filters
  currentFilters: FiltersState;
  localSearch: string;

  // Selection
  selectedTransactions: Transaction[];
  selectedTransactionIds: string[];

  // Handlers
  onTransactionSelect: (transaction: Transaction) => void;
  onTransactionEdit: (transaction: Transaction) => void;
  onTransactionDelete: (transaction: Transaction) => Promise<boolean> | Promise<void> | void;
  onExportTransactions: () => Promise<boolean> | Promise<void> | (() => void);
  onRefresh: () => void;
  onSearchChange: (search: string) => void;
  onFilterChange: (filters: Partial<FiltersState>) => void;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onToggleSelection: (transactionId: string) => void;
  onSelectAll: (transactions: Transaction[]) => void;
  onClearAllSelection: () => void;
  onRemoveFromSelection: (transactionId: string) => void;

  // States
  isExporting?: boolean;
  isRefreshing?: boolean;
}

// ==================== CONSTANTS & UTILS ====================

const STATUS_COLORS: Record<TransactionStatus, string> = {
  Successful: "success.main",
  Pending: "warning.main",
  Failed: "error.main",
  Cancelled: "text.secondary",
  Refunded: "info.main",
} as const;

const PAYMENT_METHOD_COLORS: Record<PaymentMethod, string> = {
  Paystack: "primary.main",
  credit_card: "primary.main",
  paypal: "info.main",
  bank_transfer: "secondary.main",
  crypto: "warning.main",
  wallet: "success.main",
} as const;

// ==================== REUSABLE COMPONENTS ====================

const StatusBadge: React.FC<{ status?: TransactionStatus }> = ({ status }) => {
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
      {formatTransactionStatus(status)}
    </Typography>
  );
};

const PaymentMethodBadge: React.FC<{ method: PaymentMethod }> = ({ method }) => {
  const theme = useTheme();

  return (
    <Typography
      variant="body2"
      sx={{
        color: PAYMENT_METHOD_COLORS[method] || theme.palette.text.secondary,
        fontWeight: 500,
      }}
    >
      {formatPaymentMethod(method)}
    </Typography>
  );
};

// ==================== SUB-COMPONENTS ====================

const SelectedTransactionPreview: React.FC<{
  selectedTransactions: Transaction[];
  onTransactionSelect: (transaction: Transaction) => void;
  onTransactionEdit: (transaction: Transaction) => void;
  onTransactionDelete: (transaction: Transaction) => void;
  onClearSelection: () => void;
  onRemoveTransaction?: (transactionId: string) => void;
}> = ({
  selectedTransactions,
  onTransactionSelect,
  onTransactionDelete,
  onClearSelection,
}) => {
  const theme = useTheme();
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  if (selectedTransactions.length === 0) {
    return null;
  }


  // Handler Functions
  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, transaction: Transaction) => {
    event.stopPropagation();
    setActionMenuAnchor(event.currentTarget);
    setSelectedTransaction(transaction);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedTransaction(null);
  };

  const handleDelete = () => {
    if (selectedTransaction) {
      onTransactionDelete(selectedTransaction);
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
                {selectedTransactions.length}
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Selected Transactions
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


          {/* Transactions List */}
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {selectedTransactions.map((transaction) => (
              <Box
                key={transaction.id}
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
                onClick={() => onTransactionSelect(transaction)}
              >
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                      #{transaction.reference}
                    </Typography>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: 
                          transaction.status === 'Successful' ? alpha(theme.palette.success.main, 0.1) :
                          transaction.status === 'Pending' ? alpha(theme.palette.warning.main, 0.1) :
                          alpha(theme.palette.error.main, 0.1),
                        color:
                          transaction.status === 'Successful' ? theme.palette.success.main :
                          transaction.status === 'Pending' ? theme.palette.warning.main :
                          theme.palette.error.main,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {transaction.status}
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {transaction.customerName}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Typography variant="body2" fontWeight={600} color="primary.main">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatPaymentMethod(transaction.paymentMethod)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                <Tooltip title="More actions">
                  <IconButton
                    size="small"
                    onClick={(e) => handleActionMenuOpen(e, transaction)}
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
        {selectedTransaction && (
          <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
            <Typography variant="subtitle2" fontWeight={600} noWrap>
              Transaction #{selectedTransaction.reference}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
            </Typography>
          </Box>
        )}

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
              <Typography variant="body2">Delete Transaction</Typography>
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
  onExport?: () => Promise<boolean> | Promise<void> | (() => void);
  isExporting?: boolean;
  isLoading?: boolean;
}> = ({
  selectedCount,
  onExport,
  isExporting = false,
}) => {


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
            {selectedCount} transaction{selectedCount !== 1 ? "s" : ""} selected
          </Typography>
        )}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          {onExport && (
            <Tooltip title="Export transactions data to CSV">
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
        </Stack>
      </Stack>
    </Box>
  );
};

const FilterComponent: React.FC<{
  searchTerm: string;
  statusFilter?: TransactionStatus;
  paymentMethodFilter?: PaymentMethod;
  typeFilter?: TransactionType;
  onSearchChange: (search: string) => void;
  onStatusChange: (status?: TransactionStatus) => void;
  onPaymentMethodChange: (method?: PaymentMethod) => void;
  onTypeChange: (type?: TransactionType) => void;
  onClearFilters: () => void;
}> = (props) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const hasActiveFilters = Boolean(
    props.searchTerm ||
      props.statusFilter ||
      props.paymentMethodFilter ||
      props.typeFilter
  );

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) =>
    setFilterAnchorEl(event.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);

  const filterOptions = [
    {
      label: "Status",
      value: props.statusFilter || "",
      onChange: (value: string) => {
        props.onStatusChange((value as TransactionStatus) || undefined);
        handleFilterClose();
      },
      options: ["", "Successful", "Pending", "Failed", "Cancelled", "Refunded"],
    },
    {
      label: "Payment Method",
      value: props.paymentMethodFilter || "",
      onChange: (value: string) => {
        props.onPaymentMethodChange((value as PaymentMethod) || undefined);
        handleFilterClose();
      },
      options: ["", "Paystack", "credit_card", "paypal", "bank_transfer", "crypto", "wallet"],
    },
    {
      label: "Type",
      value: props.typeFilter || "",
      onChange: (value: string) => {
        props.onTypeChange((value as TransactionType) || undefined);
        handleFilterClose();
      },
      options: ["", "payment", "withdrawal", "deposit"],
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          placeholder="Search transactions..."
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
          Filter Transactions
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
                    {option.replace('_', ' ')}
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
            {props.paymentMethodFilter && (
              <Chip
                label={`Method: ${props.paymentMethodFilter}`}
                size="small"
                onDelete={() => props.onPaymentMethodChange(undefined)}
              />
            )}
            {props.typeFilter && (
              <Chip
                label={`Type: ${props.typeFilter}`}
                size="small"
                onDelete={() => props.onTypeChange(undefined)}
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
  const { page, pageSize, total, totalPages } = pagination;

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newSize = Number(event.target.value);
    onPageSizeChange?.(newSize);
    onPageChange(1);
  };

  const getDisplayRange = () => {
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    return { start, end };
  };

  const { start, end } = getDisplayRange();
  if (total === 0) return null;

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
            transactions
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
                value={pageSize}
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
  transactions: Transaction[];
  selectedTransactionIds: string[];
  onTransactionSelect: (transaction: Transaction) => void;
  onTransactionEdit: (transaction: Transaction) => void;
  onTransactionDelete: (transaction: Transaction) => void;
  onToggleSelection: (transactionId: string) => void;
  onSelectAll: (transactions: Transaction[]) => void;
  isLoading?: boolean;
  hasError?: boolean;
}> = ({
  transactions,
  selectedTransactionIds,
  onTransactionSelect,
  onTransactionEdit,
  onTransactionDelete,
  onToggleSelection,
  onSelectAll,
  isLoading = false,
  hasError = false,
}) => {
  const theme = useTheme();
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const isEmpty = transactions.length === 0;

  const handleSelectAll = () => onSelectAll(transactions);

  const handleActionMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    transaction: Transaction
  ) => {
    event.stopPropagation();
    setActionMenuAnchor(event.currentTarget);
    setSelectedTransaction(transaction);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedTransaction(null);
  };

  const handleEdit = () => {
    if (selectedTransaction) {
      onTransactionEdit(selectedTransaction);
    }
    handleActionMenuClose();
  };

  const handleDelete = () => {
    if (selectedTransaction) {
      onTransactionDelete(selectedTransaction);
    }
    handleActionMenuClose();
  };

  const handleView = () => {
    if (selectedTransaction) {
      onTransactionSelect(selectedTransaction);
    }
    handleActionMenuClose();
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Loading transactions...
        </Typography>
      </Box>
    );
  }

  const renderTableRows = () => {
    if (hasError) return renderErrorState();
    if (isEmpty) return renderEmptyState();
    return transactions.map(renderTransactionRow);
  };

  const renderErrorState = () => (
    <TableRow>
      <TableCell colSpan={8} sx={{ textAlign: "center", py: 8 }}>
        <WarningIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
        <Typography variant="h6" color="error.main" gutterBottom>
          Unable to Load Transactions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          There was an error loading the transactions data
        </Typography>
      </TableCell>
    </TableRow>
  );

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={8} sx={{ textAlign: "center", py: 8 }}>
        <WarningIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Transactions Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Transactions will appear here once they are processed
        </Typography>
      </TableCell>
    </TableRow>
  );

  const renderTransactionRow = (transaction: Transaction) => (
    <TableRow
      key={transaction.id}
      hover
      sx={{ cursor: "pointer" }}
      onClick={() => onTransactionSelect(transaction)}
    >
      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={selectedTransactionIds.includes(transaction.id)}
          onChange={() => onToggleSelection(transaction.id)}
        />
      </TableCell>
      <TableCell>
        <Typography fontWeight="medium">#{transaction.reference}</Typography>
      </TableCell>
      <TableCell>
        <Typography fontWeight="medium">{transaction.customerName}</Typography>
        <Typography variant="caption" color="text.secondary">
          {transaction.customerEmail}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography fontWeight="medium">
          {formatCurrency(transaction.amount, transaction.currency)}
        </Typography>
      </TableCell>
      <TableCell>
        <PaymentMethodBadge method={transaction.paymentMethod} />
      </TableCell>
      <TableCell>
        <StatusBadge status={transaction.status} />
      </TableCell>
      <TableCell>
        {new Date(transaction.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
        <Tooltip title="Actions">
          <IconButton
            size="small"
            onClick={(e) => handleActionMenuOpen(e, transaction)}
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
                    selectedTransactionIds.length > 0 &&
                    selectedTransactionIds.length < transactions.length
                  }
                  checked={
                    transactions.length > 0 && selectedTransactionIds.length === transactions.length
                  }
                  onChange={handleSelectAll}
                  disabled={isEmpty || hasError}
                />
              </TableCell>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderTableRows()}</TableBody>
        </Table>
      </TableContainer>

      {!hasError && !isEmpty && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Showing {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
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
          Edit Transaction
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 2, fontSize: 20 }} />
          Delete Transaction
        </MenuItem>
      </Menu>
    </>
  );
};

// ==================== CUSTOM HOOK ====================

const useTransactionsTableHook = () => {
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success"
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const transactionData = useTransactions();
  const { handleTransactionAction: performTransactionAction } = useTransactionActions();

  const selectedTransactionIds = selectedTransactions.map(t => t.id);

  const handleRefresh = () => {
    setSelectedTransactions([]);
    transactionData.refetchTransactions();
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTransactionSelect = (transaction: Transaction) => {
    console.log('Selected transaction:', transaction);
  };

  const handleTransactionEdit = (transaction: Transaction) => {
    showSnackbar(`Edit transaction ${transaction.reference}`, "success");
  };

  const handleTransactionAction = async (transaction: Transaction, action: string) => {
    const success = await performTransactionAction(transaction, action);

    if (success) {
      showSnackbar(`Transaction ${action} successful`, "success");
      handleRefresh();
    } else {
      showSnackbar(`Failed to ${action} transaction`, "error");
    }
  };

  const handleTransactionDelete = async (transaction: Transaction) => {
    return handleTransactionAction(transaction, "delete");
  };

  const handleToggleSelection = (transactionId: string) => {
    const transaction = transactionData.transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    setSelectedTransactions(prev =>
      prev.some(t => t.id === transactionId)
        ? prev.filter(t => t.id !== transactionId)
        : [...prev, transaction]
    );
  };

  const handleSelectAll = (transactionsToSelect: Transaction[]) => {
    setSelectedTransactions(transactionsToSelect);
  };

  const handleClearAllSelection = () => setSelectedTransactions([]);
  const handleRemoveFromSelection = (transactionId: string) => {
    setSelectedTransactions(prev => prev.filter(t => t.id !== transactionId));
  };

  const closeSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  return {
    ...transactionData,
    user,
    selectedTransactions,
    selectedTransactionIds,
    snackbar,
    showSnackbar,
    handleRefresh,
    handleTransactionSelect,
    handleTransactionEdit,
    handleTransactionDelete,
    handleTransactionAction,
    handleToggleSelection,
    handleSelectAll,
    handleClearAllSelection,
    handleRemoveFromSelection,
    closeSnackbar,
  };
};

// ==================== MAIN COMPONENT ====================

export const TransactionsTableComponent: React.FC<TransactionsTableProps> = ({
  transactions,
  pagination,
  isLoading = false,
  hasError = false,
  currentFilters,
  localSearch,
  selectedTransactions,
  selectedTransactionIds,
  onTransactionSelect,
  onTransactionEdit,
  onTransactionDelete,
  onExportTransactions,
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
      currentFilters.paymentMethod ||
      currentFilters.type
  );
  const isEmptyState = transactions.length === 0 && !isLoading;

  return (
    <Box className="flex flex-col gap-3">
      {/* Selected Transactions Preview */}
      <SelectedTransactionPreview
        selectedTransactions={selectedTransactions}
        onTransactionSelect={onTransactionSelect}
        onTransactionEdit={onTransactionEdit}
        onTransactionDelete={onTransactionDelete}
        onClearSelection={onClearAllSelection}
        onRemoveTransaction={onRemoveFromSelection}
      />

      {/* Filters and Toolbar */}
      <Box className="flex flex-row justify-between">
        {/* Filters */}
        <FilterComponent
          searchTerm={localSearch}
          statusFilter={currentFilters.status}
          paymentMethodFilter={currentFilters.paymentMethod}
          typeFilter={currentFilters.type}
          onSearchChange={onSearchChange}
          onStatusChange={(status) => onFilterChange({ status })}
          onPaymentMethodChange={(paymentMethod) => onFilterChange({ paymentMethod })}
          onTypeChange={(type) => onFilterChange({ type })}
          onClearFilters={onClearFilters}
        />

        {/* Toolbar */}
        <Toolbar
          selectedCount={selectedTransactions.length}
          onExport={onExportTransactions}
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
            {hasActiveFilters ? "No Transactions Found" : "No Transactions Yet"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {hasActiveFilters
              ? "Try adjusting your search criteria or filters to find what you're looking for."
              : "Transactions will appear here once they are processed on the platform."}
          </Typography>
          {hasActiveFilters && (
            <Button variant="outlined" onClick={onClearFilters}>
              Clear Filters
            </Button>
          )}
        </Box>
      ) : (
        <>
          {/* Transactions Table */}
          <TableComponent
            transactions={transactions}
            selectedTransactionIds={selectedTransactionIds}
            onTransactionSelect={onTransactionSelect}
            onTransactionEdit={onTransactionEdit}
            onTransactionDelete={onTransactionDelete}
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

// Default export with auth
const TransactionsTable: React.FC = () => {
  const {
    transactions,
    pagination,
    isLoading,
    error,
    currentFilters,
    localSearch,
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleExportTransactions,
    selectedTransactions,
    selectedTransactionIds,
    handleTransactionSelect,
    handleTransactionEdit,
    handleTransactionDelete,
    handleToggleSelection,
    handleSelectAll,
    handleClearAllSelection,
    handleRemoveFromSelection,
  } = useTransactionsTableHook();

  return (
    <TransactionsTableComponent
      transactions={transactions}
      pagination={pagination}
      isLoading={isLoading}
      hasError={!!error}
      currentFilters={currentFilters}
      localSearch={localSearch}
      selectedTransactions={selectedTransactions}
      selectedTransactionIds={selectedTransactionIds}
      onTransactionSelect={handleTransactionSelect}
      onTransactionEdit={handleTransactionEdit}
      onTransactionDelete={handleTransactionDelete}
      onExportTransactions={handleExportTransactions}
      onRefresh={() => {}} // Remove refresh handler
      onSearchChange={handleSearchChange}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      onPageChange={handlePageChange}
      onToggleSelection={handleToggleSelection}
      onSelectAll={handleSelectAll}
      onClearAllSelection={handleClearAllSelection}
      onRemoveFromSelection={handleRemoveFromSelection}
      isExporting={false}
      isRefreshing={false}
    />
  );
};

export default withAuth(TransactionsTable);