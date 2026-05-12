import { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft, Plus, Minus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [processing, setProcessing] = useState(false);

  const depositForm = useForm();
  const withdrawForm = useForm();
  const transferForm = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, accountsRes] = await Promise.all([
        axios.get('/api/transactions'),
        axios.get('/api/accounts'),
      ]);
      setTransactions(transactionsRes.data);
      setAccounts(accountsRes.data);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (data) => {
    setProcessing(true);
    try {
      await axios.post('/api/transactions/deposit', {
        accountNumber: data.accountNumber,
        amount: parseFloat(data.amount),
        description: data.description,
        idempotencyKey: Date.now().toString(),
      });
      depositForm.reset();
      await fetchData();
      setActiveTab('list');
    } catch (err) {
      setError('Failed to deposit');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async (data) => {
    setProcessing(true);
    try {
      await axios.post('/api/transactions/withdraw', {
        accountNumber: data.accountNumber,
        amount: parseFloat(data.amount),
        description: data.description,
        idempotencyKey: Date.now().toString(),
      });
      withdrawForm.reset();
      await fetchData();
      setActiveTab('list');
    } catch (err) {
      setError('Failed to withdraw');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleTransfer = async (data) => {
    setProcessing(true);
    try {
      await axios.post('/api/transactions/transfer', {
        fromAccountNumber: data.fromAccountNumber,
        toAccountNumber: data.toAccountNumber,
        amount: parseFloat(data.amount),
        description: data.description,
        idempotencyKey: Date.now().toString(),
      });
      transferForm.reset();
      await fetchData();
      setActiveTab('list');
    } catch (err) {
      setError('Failed to transfer');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowUpRight className="h-5 w-5 text-emerald-400" />;
      case 'WITHDRAWAL':
        return <ArrowDownLeft className="h-5 w-5 text-crimson-300" />;
      case 'TRANSFER_OUT':
      case 'TRANSFER_IN':
        return <ArrowRightLeft className="h-5 w-5 text-blue-400" />;
      default:
        return <ArrowRightLeft className="h-5 w-5 text-slate-400" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'DEPOSIT':
      case 'TRANSFER_IN':
        return 'text-emerald-300';
      case 'WITHDRAWAL':
      case 'TRANSFER_OUT':
        return 'text-crimson-300';
      default:
        return 'text-slate-300';
    }
  };

  if (loading) {
    return (
      <section className="space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
          <p className="text-center text-slate-300">Loading transactions...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white">Transactions</h2>
            <p className="mt-2 text-slate-300">View your transaction history and make new transactions.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('deposit')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === 'deposit'
                  ? 'bg-emerald-600 text-white'
                  : 'border border-slate-700 bg-slate-950 text-white hover:border-emerald-600'
              }`}
            >
              <Plus className="h-4 w-4" />
              Deposit
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === 'withdraw'
                  ? 'bg-crimson-600 text-white'
                  : 'border border-slate-700 bg-slate-950 text-white hover:border-crimson-600'
              }`}
            >
              <Minus className="h-4 w-4" />
              Withdraw
            </button>
            <button
              onClick={() => setActiveTab('transfer')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === 'transfer'
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-700 bg-slate-950 text-white hover:border-blue-600'
              }`}
            >
              <ArrowRightLeft className="h-4 w-4" />
              Transfer
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-[2rem] border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
          <h3 className="text-xl font-semibold text-white mb-6">Transaction History</h3>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-800">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{transaction.description || 'Transaction'}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(transaction.transactionDate).toLocaleDateString()} • {transaction.reference}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <span className="rounded-full px-3 py-1 text-sm font-semibold bg-slate-700 text-slate-200">
                    {transaction.type}
                  </span>
                  <p className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'DEPOSIT' || transaction.type === 'TRANSFER_IN' ? '+' : '-'}
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {transactions.length === 0 && (
            <p className="text-center text-slate-400 py-8">No transactions found.</p>
          )}
        </div>
      )}

      {activeTab === 'deposit' && (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
          <h3 className="text-xl font-semibold text-white mb-6">Deposit Money</h3>
          <form onSubmit={depositForm.handleSubmit(handleDeposit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300">Account</label>
              <select
                {...depositForm.register('accountNumber', { required: 'Account is required' })}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
              >
                <option value="">Select account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.accountNumber}>
                    {account.accountNumber} - ${parseFloat(account.balance).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Amount</label>
              <input
                type="number"
                step="0.01"
                {...depositForm.register('amount', { required: 'Amount is required', min: 0.01 })}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Description</label>
              <input
                type="text"
                {...depositForm.register('description')}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                placeholder="Optional description"
              />
            </div>
            <button
              type="submit"
              disabled={processing}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Deposit'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'withdraw' && (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
          <h3 className="text-xl font-semibold text-white mb-6">Withdraw Money</h3>
          <form onSubmit={withdrawForm.handleSubmit(handleWithdraw)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300">Account</label>
              <select
                {...withdrawForm.register('accountNumber', { required: 'Account is required' })}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
              >
                <option value="">Select account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.accountNumber}>
                    {account.accountNumber} - ${parseFloat(account.balance).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Amount</label>
              <input
                type="number"
                step="0.01"
                {...withdrawForm.register('amount', { required: 'Amount is required', min: 0.01 })}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Description</label>
              <input
                type="text"
                {...withdrawForm.register('description')}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                placeholder="Optional description"
              />
            </div>
            <button
              type="submit"
              disabled={processing}
              className="w-full rounded-lg bg-crimson-600 px-4 py-2 text-white hover:bg-crimson-500 disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Withdraw'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'transfer' && (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
          <h3 className="text-xl font-semibold text-white mb-6">Transfer Money</h3>
          <form onSubmit={transferForm.handleSubmit(handleTransfer)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300">From Account</label>
              <select
                {...transferForm.register('fromAccountNumber', { required: 'From account is required' })}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
              >
                <option value="">Select account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.accountNumber}>
                    {account.accountNumber} - ${parseFloat(account.balance).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">To Account Number</label>
              <input
                type="text"
                {...transferForm.register('toAccountNumber', { required: 'To account is required' })}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                placeholder="Enter destination account number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Amount</label>
              <input
                type="number"
                step="0.01"
                {...transferForm.register('amount', { required: 'Amount is required', min: 0.01 })}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Description</label>
              <input
                type="text"
                {...transferForm.register('description')}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                placeholder="Optional description"
              />
            </div>
            <button
              type="submit"
              disabled={processing}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Transfer'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}

export default Transactions;
