import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import type { SignInFlow } from '../types';

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <Card className="size-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>Use your email or another service to continue.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input disabled={false} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
          <Input
            disabled={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Input
            disabled={false}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            type="password"
            required
          />

          <Button type="submit" className="w-full" size="lg" disabled={false}>
            Continue
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <Button disabled={false} onClick={() => {}} variant="outline" size="lg" className="w-full relative">
            <FcGoogle className="size-5 absolute left-2.5 top-3" />
            Continue with Google
          </Button>

          <Button disabled={false} onClick={() => {}} variant="outline" size="lg" className="w-full relative">
            <FaGithub className="size-5 absolute left-2.5 top-3" />
            Continue with GitHub
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Already have an account?{' '}
          <button disabled={false} onClick={() => setState('signIn')} className="text-sky-700 font-medium hover:underline cursor-pointer">
            Sign in
          </button>
        </p>
      </CardContent>
    </Card>
  );
};
