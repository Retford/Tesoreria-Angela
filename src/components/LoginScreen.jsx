import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Landmark } from 'lucide-react';

export default function LoginScreen({ onLogin, onRegister }) {
  const [mode, setMode] = useState('login'); // login | register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await onLogin(email.trim(), password);
      } else {
        await onRegister(email.trim(), password);
      }
    } catch (err) {
      setError(traducirError(err?.code));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <Card className='w-full max-w-sm'>
        <CardHeader className='items-center text-center flex flex-col gap-2 pt-6'>
          <div className='h-10 w-10 rounded-full bg-forest-50 flex items-center justify-center text-forest-600'>
            <Landmark className='h-5 w-5' />
          </div>
          <CardTitle>Tesorería de la junta</CardTitle>
          <p className='text-xs text-ink-soft'>
            {mode === 'login'
              ? 'Ingresa con tu cuenta'
              : 'Crea una cuenta para tu junta'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
            <div>
              <Label htmlFor='email'>Correo</Label>
              <Input
                id='email'
                type='email'
                autoComplete='email'
                placeholder='nombre@correo.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor='password'>Contraseña</Label>
              <Input
                id='password'
                type='password'
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                placeholder='Mínimo 6 caracteres'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className='text-xs text-red-600'>{error}</p>}
            <Button type='submit' disabled={submitting} className='mt-1'>
              {submitting
                ? 'Un momento...'
                : mode === 'login'
                  ? 'Ingresar'
                  : 'Crear cuenta'}
            </Button>
          </form>
          <button
            type='button'
            className='mt-4 text-xs text-forest-600 hover:underline w-full text-center'
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
          >
            {mode === 'login'
              ? '¿No tienes cuenta? Crear una'
              : '¿Ya tienes cuenta? Ingresar'}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

function traducirError(code) {
  const map = {
    'auth/invalid-email': 'El correo no es válido.',
    'auth/user-not-found': 'No existe una cuenta con ese correo.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
    'auth/weak-password': 'La contraseña es demasiado débil.',
    'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
  };
  return map[code] || 'Ocurrió un error. Intenta de nuevo.';
}
