import React from 'react';
import {useAuth} from '../../hooks/useAuth';
import {Link} from 'react-router-dom';
import {useLanguage} from '../../context/LanguageContext';

const Navbar = () => {
  const {user,loginWithGoogle,logout} = useAuth();
  const {language,toggleLanguage,t} = useLanguage();

  return (
    <nav className="w-full bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold text-emerald-500 tracking-wide flex items-center gap-2">
          <span className="text-2xl">📽️</span> {t('appTitle')}
        </Link>
        <button
          onClick={toggleLanguage}
          className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-gray-700 font-mono"
        >
          {language === 'en' ? '🇺🇸 EN' : '🇸🇦 AR'}
        </button>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition mr-2 hidden md:block">
              {t('myCreations')}
            </Link>
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-8 h-8 rounded-full border border-gray-600"
              />
            )}
            <span className="text-sm text-gray-300 hidden md:block">{user.displayName}</span>
            <button
              onClick={logout}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 px-3 py-1 rounded transition"
            >
              {t('logout')}
            </button>
          </div>
        ) : (
          <button
            onClick={loginWithGoogle}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
            </svg>
            {t('signInGoogle')}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
