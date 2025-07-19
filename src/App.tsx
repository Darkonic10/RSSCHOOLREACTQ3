import React from 'react';
import HeaderComponent from './components/header/header.component.tsx';
import ErrorBoundary from './components/error-boundary/error-boundary.component.tsx';
import { Outlet } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HeaderComponent />
      <Outlet />
    </ErrorBoundary>
  );
};

export default App;
