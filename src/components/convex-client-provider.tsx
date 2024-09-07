'use client';

import { ConvexAuthNextjsProvider } from '@convex-dev/auth/nextjs';
import { ConvexReactClient } from 'convex/react';
import type { PropsWithChildren } from 'react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: PropsWithChildren) {
  return <ConvexAuthNextjsProvider client={convex}>{children}</ConvexAuthNextjsProvider>;
}
