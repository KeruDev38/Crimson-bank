import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    const result = await login(data.username, data.password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <section className="mx-auto max-w-md space-y-8">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">Sign in to your account</h2>
            <p className="mt-2 text-slate-400">Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                {...register('username', { required: 'Username is required' })}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-400 focus:border-crimson-500 focus:outline-none focus:ring-1 focus:ring-crimson-500"
                placeholder="Enter your username"
              />
              {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-400 focus:border-crimson-500 focus:outline-none focus:ring-1 focus:ring-crimson-500"
                placeholder="Enter your password"
              />
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                <p className="font-medium text-red-200">{error.message}</p>
                {error.details?.length > 0 && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-red-100/90">
                    {error.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-crimson-600 px-4 py-2 text-white hover:bg-crimson-500 focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <a href="/register" className="text-crimson-400 hover:text-crimson-300">
              Register here
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
