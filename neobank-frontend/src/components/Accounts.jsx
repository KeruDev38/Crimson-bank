import { useState, useEffect } from 'react';
import { Plus, CreditCard } from 'lucide-react';
import axios from 'axios';

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('/api/accounts');
      setAccounts(response.data);
    } catch (err) {
      setError('Failed to load accounts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async () => {
    setCreating(true);
    try {
      await axios.post('/api/accounts');
      await fetchAccounts(); // Refresh the list
    } catch (err) {
      setError('Failed to create account');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <section className="space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
          <p className="text-center text-slate-300">Loading accounts...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white">Your Accounts</h2>
            <p className="mt-2 text-slate-300">Manage your bank accounts and view balances.</p>
          </div>
          <button
            onClick={createAccount}
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-full bg-crimson-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-crimson-500 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {creating ? 'Creating...' : 'Create Account'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-[2rem] border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-glow ring-1 ring-white/10"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-crimson-600/10">
                <CreditCard className="h-6 w-6 text-crimson-300" />
              </div>
              <div>
                <p className="font-semibold text-white">{account.accountNumber}</p>
                <p className="text-sm text-slate-400">{account.type} Account</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-400">Balance</p>
                <p className="text-2xl font-semibold text-white">
                  ${parseFloat(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Available</p>
                  <p className="font-semibold text-white">
                    ${parseFloat(account.availableBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Status</p>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    account.status === 'ACTIVE'
                      ? 'bg-green-500/10 text-green-200'
                      : 'bg-red-500/10 text-red-200'
                  }`}>
                    {account.status}
                  </span>
                </div>
              </div>

              {account.nickname && (
                <div>
                  <p className="text-sm text-slate-400">Nickname</p>
                  <p className="font-semibold text-white">{account.nickname}</p>
                </div>
              )}

              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-slate-500">
                  Last activity: {new Date(account.lastActivityAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {accounts.length === 0 && !loading && (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10 text-center">
          <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-300">No accounts found. Create your first account to get started.</p>
        </div>
      )}
    </section>
  );
}

export default Accounts;
