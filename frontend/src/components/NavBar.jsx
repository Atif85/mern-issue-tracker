import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { PlusIcon, PaletteIcon, LogOutIcon, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const THEMES = [
  'light',
  'dark',
  'dim',
  'black',
  'synthwave',
  'cupcake',
  'cyberpunk',
];

const NavBar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dim');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Sets the global theme directly on the document root
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleDeleteAccount = async () => {
    const password = window.prompt(
      'Enter your password to confirm account deletion:'
    );
    if (!password) return;

    setIsDeleting(true);
    try {
      await api.delete('/auth/delete-account', { data: { password } });
      toast.success('Account deleted successfully');
      logout();
      navigate('/login');
    } catch (error) {
      console.error(
        'Delete account failed:',
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || 'Account deletion failed');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <header className="bg-base-300 border-b border-base-content/10 shadow-sm">
      <div className="mx-auto max-w-screen-2xl p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-primary font-mono tracking-tighter">
              IssueBoard
            </h1>
            {user && (
              <div className="text-sm text-base-content/70">
                Signed in as{' '}
                <span className="font-semibold">{user.username}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user && (
              <button
                type="button"
                className="btn btn-primary btn-sm gap-2"
                onClick={() => navigate('/create')}
              >
                <PlusIcon className="size-5" />
                <span>New Issue</span>
              </button>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-sm gap-2">
                  <PaletteIcon className="size-4" />
                  <span className="capitalize hidden sm:inline">{theme}</span>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[50] menu p-2 shadow-xl bg-base-200 rounded-box w-48 mt-2 border border-base-content/10"
                >
                  {THEMES.map((t) => (
                    <li key={t}>
                      <button
                        type="button"
                        className={`capitalize ${theme === t ? 'active' : ''}`}
                        onClick={() => setTheme(t)}
                      >
                        {t}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {user ? (
              <>
                <div className="dropdown dropdown-end">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm gap-2"
                  >
                    <LogOutIcon className="size-5" />
                    Account
                  </button>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[50] menu p-2 shadow-xl bg-base-200 rounded-box w-48 mt-2 border border-base-content/10"
                  >
                    <li>
                      <button type="button" onClick={() => logout()}>
                        Sign Out
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="text-error"
                        disabled={isDeleting}
                        onClick={handleDeleteAccount}
                      >
                        <Trash2 className="size-4 inline-block mr-2" />
                        Delete Account
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
