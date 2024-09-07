import { useAuthActions } from '@convex-dev/auth/react';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import type { SignInFlow } from '../types';

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);

  const handleOAuthSignIn = (value: 'github' | 'google') => {
    setPending(true);
    signIn(value).finally(() => setPending(false));
  };

  return (
    <Card className="size-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>Use your email or another service to continue.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input disabled={pending} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />

          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            Continue
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <Button disabled={pending} onClick={() => handleOAuthSignIn('google')} variant="outline" size="lg" className="w-full relative">
            <FcGoogle className="size-5 absolute left-2.5 top-3" />
            Continue with Google
          </Button>

          <Button disabled={pending} onClick={() => handleOAuthSignIn('github')} variant="outline" size="lg" className="w-full relative">
            <FaGithub className="size-5 absolute left-2.5 top-3" />
            Continue with GitHub
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Don&apos;t have an account?{' '}
          <button disabled={pending} onClick={() => setState('signUp')} className="text-sky-700 font-medium hover:underline cursor-pointer">
            Sign up
          </button>
        </p>
      </CardContent>
    </Card>
  );
};
