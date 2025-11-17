"use client";

import React, { useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/header/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
   <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed((prev) => !prev)} 
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
