import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import api from '../lib/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        username,
        email,
        password,
        inviteCode,
      });
      login(res.data);
      setRecoveryCode(res.data.recoveryCode || '');
      toast.success(
        'Account created successfully. Copy your recovery code now.'
      );
    } catch (error) {
      console.error(
        'Registration failed:',
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Create an account</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  placeholder="Your username"
                  className="input input-bordered"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Choose a password"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Invite Code</span>
                </label>
                <input
                  type="text"
                  placeholder="Invite code"
                  className="input input-bordered"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Register'}
              </button>
            </form>

            {recoveryCode && (
              <div className="alert mt-4 break-words">
                <div>
                  <h3 className="font-semibold">Recovery code</h3>
                  <p className="text-sm text-base-content/80 mt-2">
                    Save this code now. You will need it to reset your password
                    in the future.
                  </p>
                  <pre className="mt-3 rounded-md bg-base-300 p-3 text-sm font-mono">
                    {recoveryCode}
                  </pre>
                </div>
              </div>
            )}

            <div className="mt-4 text-sm text-center text-base-content/70">
              Already have an account?{' '}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
