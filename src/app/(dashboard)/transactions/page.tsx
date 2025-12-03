// src/app/(dashboard)/transactions/page.tsx
"use client";

import React from "react";
import { Container, } from "@mui/material";

// Components
import TransactionsPageHeader, { TimeRange } from "./features/components/TransactionsPageHeader";
import { TransactionAnalytics } from "./features/components/TransactionAnalytics";

// Hooks
import { useTransactions } from "./features/hooks/useTransactions";

// HOC
import withAuth from "@/hoc/withAuth";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import TransactionsTable  from "../transactions/features/components/TransactionsTable";

function TransactionsPage() {
  const [globalTimeRange, setGlobalTimeRange] = React.useState<TimeRange>('thisMonth');
  const user = useSelector((state: RootState) => state.auth.user);
  const { refetchTransactions } = useTransactions();

  const handleRefresh = () => {
    refetchTransactions();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <TransactionsPageHeader 
        title="Transaction Management"
        timeRange={globalTimeRange}
        onTimeRangeChange={setGlobalTimeRange}
        onRefresh={handleRefresh}
        user={user}
      />

      {/* Analytics */}
      <TransactionAnalytics />

      {/* Consolidated Table Component */}
      <TransactionsTable />
    </Container>
  );
}

export default withAuth(TransactionsPage);