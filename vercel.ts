import type { VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
  framework: 'nextjs',
  installCommand: 'bun install',
  ignoreCommand:
    "git diff HEAD^ HEAD --name-only | grep -qEv '(\\.md$|LICENSE$|\\.env\\.example$|^\\.github/|^\\.vscode/|^\\.convex/)' && exit 1 || exit 0",
  trailingSlash: false,
};
