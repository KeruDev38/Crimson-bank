import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess('');
    const result = await registerUser(data.username, data.password, data.email, data.firstName, data.lastName);
    setLoading(false);
    if (result.success) {
      setSuccess('Registration successful! Please log in.');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.error);
    }
  };

  return (
    <section className="mx-auto max-w-md space-y-8">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">Create your account</h2>
            <p className="mt-2 text-slate-400">Fill in your details to get started.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'Username must be at least 3 characters' } })}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-400 focus:border-crimson-500 focus:outline-none focus:ring-1 focus:ring-crimson-500"
                placeholder="Enter your username"
              />
              {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-400 focus:border-crimson-500 focus:outline-none focus:ring-1 focus:ring-crimson-500"
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-300">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                {...register('firstName', { required: 'First name is required' })}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-400 focus:border-crimson-500 focus:outline-none focus:ring-1 focus:ring-crimson-500"
                placeholder="Enter your first name"
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-400">{errors.firstName.message}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-300">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                {...register('lastName', { required: 'Last name is required' })}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-400 focus:border-crimson-500 focus:outline-none focus:ring-1 focus:ring-crimson-500"
                placeholder="Enter your last name"
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
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
            {success && <p className="text-sm text-green-400">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-crimson-600 px-4 py-2 text-white hover:bg-crimson-500 focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <a href="/login" className="text-crimson-400 hover:text-crimson-300">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;
