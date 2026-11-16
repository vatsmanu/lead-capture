import type { ReactNode } from 'react';

export type LayoutItem = {
  key: string;
  span: 'half' | 'full';
  node: ReactNode;
};

export type LayoutProps = {
  items: LayoutItem[];
};
