'use client';

import type { PropsWithChildren } from 'react';

import { Toolbar } from './toolbar';

const WorkspaceIdLayout = ({ children }: Readonly<PropsWithChildren>) => {
  return (
    <div className="h-full">
      <Toolbar />

      {children}
    </div>
  );
};

export default WorkspaceIdLayout;
