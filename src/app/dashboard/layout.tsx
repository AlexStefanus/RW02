"use client";

import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "@/component/common/Sidebar";
import ProtectedRoute from "@/component/ProtectedRoute";
import useStorageRefreshInitializer from "@/hooks/useStorageRefreshInitializer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useStorageRefreshInitializer();

  return (
    <ProtectedRoute requireAuth={true} requireAdmin={true}>
      <div className="dashboard-layout flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="dashboard-main flex-grow lg:ml-0 w-full min-w-0 flex flex-col overflow-hidden">
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2.5 animate-slide-in-left flex-shrink-0">
            <div className="flex items-center justify-between max-w-full">
              <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-gray-900 smooth-transition p-1 -ml-1 hover:scale-110 active:scale-95 hover:bg-gray-100 rounded-lg" aria-label="Open menu">
                <FiMenu size={20} />
              </button>
              <h1 className="font-semibold text-gray-900 text-sm truncate px-2 animate-fade-in">Dashboard</h1>
              <div className="w-5"></div>
            </div>
          </div>

          <div className="dashboard-content flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
