import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { TasksPage } from '../pages/TasksPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ProjectDetailPage } from '../pages/ProjectDetailPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { DailyLogPage } from '../pages/DailyLogPage';
import { SettingsPage } from '../pages/SettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Auth Pages & Guards
import { AuthLayout } from '../components/auth/AuthLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from '../pages/auth/VerifyEmailPage';
import { ProtectedRoute, PublicRoute } from '../components/auth/RouteGuards';

export const router = createBrowserRouter([
  // Public Auth Routes
  {
    path: '/',
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />
      },
      {
        path: 'verify-email',
        element: <VerifyEmailPage />
      }
    ]
  },

  // Protected Application Routes
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'tasks',
        element: <TasksPage />
      },
      {
        path: 'projects',
        element: <ProjectsPage />
      },
      {
        path: 'projects/:id',
        element: <ProjectDetailPage />
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />
      },
      {
        path: 'daily-log',
        element: <DailyLogPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);
