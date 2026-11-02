import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AppProvider } from '../context/AppContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
