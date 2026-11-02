import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, MobileDrawer } from './Sidebar';
import { Topbar } from './Topbar';
import { TaskModal } from '../tasks/TaskForm';
import { ToastContainer } from '../ui/Toast';

export function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F7F8FA] dark:bg-[#111215] text-[#20242C] dark:text-[#F3F4F6]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Task Creation Modal */}
      <TaskModal />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

