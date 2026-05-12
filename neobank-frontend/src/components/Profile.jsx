import { useState, useEffect } from 'react';
import { User, Shield, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchProfile();
    fetchAuditLogs();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/compliance/profile');
      setProfile(response.data);
      reset({
        dateOfBirth: response.data.dateOfBirth ? new Date(response.data.dateOfBirth).toISOString().split('T')[0] : '',
        taxIdHash: response.data.taxIdHash || '',
        addressLine1: response.data.addressLine1 || '',
        addressLine2: response.data.addressLine2 || '',
        city: response.data.city || '',
        stateProvince: response.data.stateProvince || '',
        postalCode: response.data.postalCode || '',
        country: response.data.country || '',
      });
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await axios.get('/api/compliance/audit-logs');
      setAuditLogs(response.data);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (data) => {
    setUpdating(true);
    try {
      const updateData = {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : null,
      };
      await axios.put('/api/compliance/profile', updateData);
      await fetchProfile();
      setError('');
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleVerifyProfile = async () => {
    setVerifying(true);
    try {
      await axios.post('/api/compliance/profile/verify');
      await fetchProfile();
      setError('');
    } catch (err) {
      setError('Failed to verify profile');
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <section className="space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
          <p className="text-center text-slate-300">Loading profile...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white">Compliance Profile</h2>
            <p className="mt-2 text-slate-300">Manage your KYC information and compliance status.</p>
          </div>
          {profile && (
            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                profile.kycStatus === 'VERIFIED'
                  ? 'bg-green-500/10 text-green-200'
                  : profile.kycStatus === 'PENDING'
                  ? 'bg-yellow-500/10 text-yellow-200'
                  : 'bg-red-500/10 text-red-200'
              }`}>
                <Shield className="h-4 w-4" />
                KYC: {profile.kycStatus}
              </span>
              {profile.kycStatus !== 'VERIFIED' && (
                <button
                  onClick={handleVerifyProfile}
                  disabled={verifying}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" />
                  {verifying ? 'Verifying...' : 'Verify Profile'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-[2rem] border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
          <h3 className="text-xl font-semibold text-white mb-6">Profile Information</h3>
          <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300">Date of Birth</label>
                <input
                  type="date"
                  {...register('dateOfBirth')}
                  className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Tax ID Hash</label>
                <input
                  type="text"
                  {...register('taxIdHash')}
                  className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                  placeholder="Tax ID hash"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Address Line 1</label>
              <input
                type="text"
                {...register('addressLine1')}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                placeholder="Street address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Address Line 2</label>
              <input
                type="text"
                {...register('addressLine2')}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                placeholder="Apartment, suite, etc."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-slate-300">City</label>
                <input
                  type="text"
                  {...register('city')}
                  className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">State/Province</label>
                <input
                  type="text"
                  {...register('stateProvince')}
                  className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                  placeholder="State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Postal Code</label>
                <input
                  type="text"
                  {...register('postalCode')}
                  className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                  placeholder="Postal code"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Country</label>
              <input
                type="text"
                {...register('country')}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                placeholder="Country code (e.g., US)"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full rounded-lg bg-crimson-600 px-4 py-2 text-white hover:bg-crimson-500 disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
            <h3 className="text-xl font-semibold text-white mb-6">Profile Status</h3>
            {profile && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">KYC Status</span>
                  <span className={`font-semibold ${
                    profile.kycStatus === 'VERIFIED' ? 'text-green-400' :
                    profile.kycStatus === 'PENDING' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {profile.kycStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Risk Rating</span>
                  <span className="font-semibold text-white">{profile.riskRating}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Sanctions Screened</span>
                  <span className={`font-semibold ${profile.sanctionsScreened ? 'text-green-400' : 'text-red-400'}`}>
                    {profile.sanctionsScreened ? 'Yes' : 'No'}
                  </span>
                </div>
                {profile.verifiedAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Verified At</span>
                    <span className="font-semibold text-white">
                      {new Date(profile.verifiedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10">
            <h3 className="text-xl font-semibold text-white mb-6">Recent Audit Logs</h3>
            <div className="space-y-3">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                  <div>
                    <p className="text-sm font-semibold text-white">{log.action}</p>
                    <p className="text-xs text-slate-400">{log.resourceType}: {log.resourceId}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      log.outcome === 'SUCCESS' ? 'bg-green-500/10 text-green-200' : 'bg-red-500/10 text-red-200'
                    }`}>
                      {log.outcome}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {auditLogs.length === 0 && (
                <p className="text-center text-slate-400 py-4">No audit logs found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
