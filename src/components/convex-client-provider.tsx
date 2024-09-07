'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import type { PropsWithChildren } from 'react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: PropsWithChildren) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
