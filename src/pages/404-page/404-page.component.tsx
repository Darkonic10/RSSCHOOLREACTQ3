import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>404 — Page not found</h1>
    <Link to="/">Return to the main</Link>
  </div>
);

export default NotFoundPage;
