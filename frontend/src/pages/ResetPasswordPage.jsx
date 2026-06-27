import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import api from '../lib/axios.js';

const ResetPasswordPage = () => {
  const [recoveryCode, setRecoveryCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/reset-password', { recoveryCode, password });
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (error) {
      console.error('Reset failed:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Reset password</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Recovery code</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your recovery code"
                  className="input input-bordered"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">New password</span>
                </label>
                <input
                  type="password"
                  placeholder="New password"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <div className="mt-4 text-sm text-center text-base-content/70">
              <Link to="/login" className="link link-info">
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
