import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { SearchIcon, MenuVerticalIcon, LoadingCircle } from "./Icons";
import useOutsideClick from "../hooks/useOutsideClick";
import { useOrbis, User, UserPopup } from "@orbisclub/components";
import LeftSidebar from './LeftSidebar';

function Header() {
  const { orbis, user, connecting, setConnectModalVis } = useOrbis();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full z-30 bg-white shadow-sm fixed">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Open menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>

            {/* Center - Search */}
            <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
              <SearchBar />
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center">
              {!user ? (
                <button
                  className="ml-4 px-4 py-2 text-sm font-medium text-white bg-[var(--brand-color)] rounded-lg hover:bg-[var(--brand-color-hover)] transition-colors"
                  onClick={() => setConnectModalVis(true)}
                >
                  {connecting ? (
                    <div className="flex items-center">
                      <LoadingCircle />
                      <span className="ml-2">Connecting</span>
                    </div>
                  ) : (
                    "Connect"
                  )}
                </button>
              ) : (
                <div className="flex items-center space-x-4">
                  <User details={user} height={32} />
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <MenuVerticalIcon />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Sidebar menu */}
          <div className="fixed inset-y-0 left-0 flex max-w-xs w-full bg-white">
            <div className="w-full">
              {/* Close button */}
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Reuse LeftSidebar component */}
              <LeftSidebar />
            </div>
          </div>
        </div>
      )}

      {showUserMenu && <UserMenuVertical hide={() => setShowUserMenu(false)} />}
    </>
  );
}

// SearchBar Component
function SearchBar() {
  const { orbis } = useOrbis();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const searchRef = useRef(null);

  useOutsideClick(searchRef, () => {
    setSearch("");
    setResults([]);
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search.length > 2) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  async function performSearch() {
    setLoading(true);
    let { data, error } = await orbis.getPosts({
      context: global.orbis_context,
      term: search
    });
    if (data) {
      setResults(data.slice(0, 5));
    }
    setLoading(false);
  }

  return (
    <div className="relative flex-1 max-w-lg" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:border-transparent"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Search Results Dropdown */}
      {search.length > 2 && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          {loading ? (
            <div className="p-4 text-center">
              <LoadingCircle />
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {results.map((result) => (
                <Link
                  key={result.stream_id}
                  href={`/post/${result.stream_id}`}
                  className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setSearch("");
                    setResults([]);
                  }}
                >
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {result.content.title || result.content.body.substring(0, 60)}
                  </h4>
                  {result.content.body && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {result.content.body.substring(0, 100)}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// UserMenuVertical Component
function UserMenuVertical({ hide }) {
  const { orbis, user, setUser } = useOrbis();
  const [showUserPopup, setShowUserPopup] = useState(false);
  const menuRef = useRef(null);

  useOutsideClick(menuRef, hide);

  async function logout() {
    await orbis.logout();
    setUser(null);
    hide();
  }

  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50" ref={menuRef}>
      <div className="px-4 py-3">
        <p className="text-sm text-gray-900 font-medium truncate">
          {user?.details?.profile?.username || 'Anonymous'}
        </p>
        <p className="text-xs text-gray-500 truncate mt-1">
          {user?.details?.metadata?.address}
        </p>
      </div>
      
      <div className="border-t border-gray-100">
        <button
          onClick={() => setShowUserPopup(true)}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Profile Setting
        </button>
        <button
          onClick={logout}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Sign Out
        </button>
      </div>

      {showUserPopup && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowUserPopup(false)}></div>
            <div className="relative bg-white rounded-lg max-w-md w-full">
              <UserPopup details={user} hide={() => setShowUserPopup(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;