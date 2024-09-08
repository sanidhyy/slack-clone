import { useAuthActions } from '@convex-dev/auth/react';
import { TriangleAlert } from 'lucide-react';
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
  const { signIn } = useAuthActions();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleOAuthSignUp = (value: 'github' | 'google') => {
    setPending(true);
    signIn(value).finally(() => setPending(false));
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validateEmail = (email: string) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
    };

    const validatePassword = (password: string) => {
      return String(password).match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/);
    };

    if (!validateEmail(email)) return setError('Invalid Email.');
    if (password !== confirmPassword) return setError("Password and Confirm Password doesn't match.");
    if (!validatePassword(password)) return setError('Password must be strong.');

    setPending(true);
    setError('');
    signIn('password', { name, email, password, flow: 'signUp' })
      .catch(() => {
        setError('Something went wrong!');
      })
      .finally(() => setPending(false));
  };

  return (
    <Card className="size-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>Use your email or another service to continue.</CardDescription>
      </CardHeader>

      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}

      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={handleSignUp} className="space-y-2.5">
          <Input
            disabled={pending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            minLength={3}
            maxLength={50}
            required
          />
          <Input disabled={pending} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Input
            disabled={pending}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            type="password"
            required
          />

          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            Continue
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <Button disabled={pending} onClick={() => handleOAuthSignUp('google')} variant="outline" size="lg" className="w-full relative">
            <FcGoogle className="size-5 absolute left-2.5 top-3" />
            Continue with Google
          </Button>

          <Button disabled={pending} onClick={() => handleOAuthSignUp('github')} variant="outline" size="lg" className="w-full relative">
            <FaGithub className="size-5 absolute left-2.5 top-3" />
            Continue with GitHub
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Already have an account?{' '}
          <button disabled={pending} onClick={() => setState('signIn')} className="text-sky-700 font-medium hover:underline cursor-pointer">
            Sign in
          </button>
        </p>
      </CardContent>
    </Card>
  );
};
