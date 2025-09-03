import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
});

type FormValues = z.infer<typeof schema>;

const Login: React.FC = () => {
  const { login, initialized } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (_data: FormValues) => {
    // Vamos deixar Keycloak cuidar do fluxo.
    await login({
      redirectUri: `${window.location.origin}/dashboard`,
    });
  };

  const loginWithKeycloak = async () => {
    await login({
      redirectUri: `${window.location.origin}/dashboard`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>Acesse o ShopSense com sua conta</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" placeholder="seu@email.com" {...register('email')} />
              {errors.email && (
                <span className="text-sm text-destructive">{errors.email.message}</span>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={!initialized || isSubmitting}>
              Continuar
            </Button>
          </form>

          <div className="relative flex items-center justify-center text-sm">
            <span className="px-2 text-muted-foreground">ou</span>
          </div>

          <Button variant="secondary" className="w-full" onClick={loginWithKeycloak} disabled={!initialized}>
            Entrar com Keycloak
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">
            Este ambiente utiliza OIDC (Keycloak) e atribuição de roles (Admin, Manager, User).
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
