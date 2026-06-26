import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { PlusIcon, PaletteIcon } from 'lucide-react';

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

  useEffect(() => {
    // Sets the global theme directly on the document root
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <header className="bg-base-300 border-b border-base-content/10 shadow-sm">
      <div className="mx-auto max-w-screen-2xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tighter">
            IssueBoard
          </h1>

          <div className="flex items-center gap-3">
            {/* Theme Selector Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-sm gap-2"
              >
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

            <Link to={'/create'} className="btn btn-primary btn-sm gap-1">
              <PlusIcon className="size-5" />
              <span>New Issue</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
