import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import api from '../lib/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Sign in to IssueBoard</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                  placeholder="Your password"
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
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-4 text-sm text-center text-base-content/70 space-y-2">
              <p>
                New here?{' '}
                <Link to="/register" className="link link-primary">
                  Create an account
                </Link>
              </p>
              <p>
                <Link to="/reset-password" className="link link-info">
                  Reset password with recovery code
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
