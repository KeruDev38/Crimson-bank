import { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight, Box, ShieldCheck, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsRes, transactionsRes] = await Promise.all([
          axios.get('/api/accounts'),
          axios.get('/api/transactions'),
        ]);
        setAccounts(accountsRes.data);
        setTransactions(transactionsRes.data);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalBalance = accounts.reduce((sum, account) => sum + parseFloat(account.balance), 0);

  const recentTransactions = transactions.slice(0, 4).map(txn => ({
    id: txn.id,
    description: txn.description || 'Transaction',
    date: new Date(txn.transactionDate).toLocaleDateString(),
    category: txn.type,
    amount: `${txn.type === 'DEPOSIT' || txn.type === 'TRANSFER_IN' ? '+' : '-'} $${Math.abs(txn.amount).toFixed(2)}`,
    type: txn.type === 'DEPOSIT' || txn.type === 'TRANSFER_IN' ? 'credit' : 'debit',
  }));

  if (loading) {
    return (
      <section className="space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
          <p className="text-center text-slate-300">Loading...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
          <p className="text-center text-red-400">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Welcome to Crimson</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white">Personal finance dashboard</h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              See your balance and activity in a polished, ruby-lit dashboard built for real-time money management.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/accounts"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:border-crimson-600 hover:bg-slate-900"
            >
              View Accounts
            </Link>
            <Link
              to="/transactions"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:border-crimson-600 hover:bg-slate-900"
            >
              View Transactions
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="inline-flex items-center justify-center rounded-full border border-red-700 bg-red-950 px-5 py-3 text-sm font-semibold text-white transition hover:border-red-600 hover:bg-red-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-400">Balance total</p>
                <p className="mt-3 text-5xl font-semibold tracking-tight text-white">
                  ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="inline-flex rounded-3xl bg-crimson-600/10 p-3 text-crimson-200">
                <Box className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-950/80 p-5">
                <p className="text-sm text-slate-400">Accounts</p>
                <p className="mt-2 text-lg font-semibold text-white">{accounts.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-5">
                <p className="text-sm text-slate-400">Recent Transactions</p>
                <p className="mt-2 text-lg font-semibold text-white">{transactions.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-5">
                <p className="text-sm text-slate-400">Profile Status</p>
                <p className="mt-2 text-lg font-semibold text-white">Active</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Recent activity</p>
                <p className="mt-2 text-sm text-slate-500">Recent account activity summarized clearly and quickly.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm text-slate-300">
                <Sparkles className="h-4 w-4 text-crimson-300" />
                Updated now
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-800">
                      {transaction.type === 'credit' ? (
                        <ArrowUpRight className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <ArrowDownLeft className="h-5 w-5 text-crimson-300" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{transaction.description}</p>
                      <p className="text-sm text-slate-500">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        transaction.type === 'credit'
                          ? 'bg-emerald-500/10 text-emerald-200'
                          : 'bg-crimson-500/10 text-crimson-200'
                      }`}
                    >
                      {transaction.category}
                    </span>
                    <p className={`text-lg font-semibold ${transaction.type === 'credit' ? 'text-emerald-300' : 'text-crimson-300'}`}>
                      {transaction.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-glow ring-1 ring-white/10">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-crimson-300" />
              <div>
                <p className="text-sm text-slate-400">Protection</p>
                <p className="font-semibold text-white">Secure authentication</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Your payments and data are protected with AES-256 encryption and biometric verification.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-glow ring-1 ring-white/10">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Quick actions</p>
            <div className="mt-6 grid gap-3">
              <button
                onClick={() => navigate('/transactions')}
                className="w-full rounded-[1.5rem] border border-white/10 bg-slate-950 px-4 py-3 text-left text-sm font-semibold text-white transition hover:border-crimson-600 hover:bg-slate-900"
              >
                Send money
              </button>
              <button
                onClick={() => navigate('/accounts')}
                className="w-full rounded-[1.5rem] border border-white/10 bg-slate-950 px-4 py-3 text-left text-sm font-semibold text-white transition hover:border-crimson-600 hover:bg-slate-900"
              >
                Create Account
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="w-full rounded-[1.5rem] border border-white/10 bg-slate-950 px-4 py-3 text-left text-sm font-semibold text-white transition hover:border-crimson-600 hover:bg-slate-900"
              >
                Update Profile
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Dashboard;
