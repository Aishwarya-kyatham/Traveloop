import React from 'react';
import Container from '../ui/Container';

const AppShell = ({ children, className = '', contained = true }) => (
  <div className="app-shell">
    <div className="relative z-10 pt-24 pb-16">
      {contained ? <Container className={className}>{children}</Container> : children}
    </div>
  </div>
);

export default AppShell;
