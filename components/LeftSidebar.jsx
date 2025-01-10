import React, { useState } from 'react';
import Link from 'next/link';
import { useOrbis, User } from "@orbisclub/components";

export default function LeftSidebar() {
  const { user } = useOrbis();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-full">
        <div className="flex flex-col h-full">
          {/* Menu Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-4 px-4">Menu</h3>
            <nav>
              <Link href="/" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                All Posts
              </Link>
              <Link href="/favorites" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Favorites
              </Link>
            </nav>
          </div>

          {/* Inbox Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-4 px-4">Inbox</h3>
            <nav>
              <Link href="/notifications" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notifications
              </Link>
              <Link href="/messages" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Messages
              </Link>
            </nav>
          </div>

          {/* Categories Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-4 px-4">Categories</h3>
            <nav>
              <Link href="/category/personal" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                <div className="w-4 h-4 rounded bg-cyan-200 mr-3"></div>
                Personal
              </Link>
              <Link href="/category/entertainment" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                <div className="w-4 h-4 rounded bg-blue-200 mr-3"></div>
                Entertainment
              </Link>
              <Link href="/category/shopping" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                <div className="w-4 h-4 rounded bg-purple-200 mr-3"></div>
                Shopping
              </Link>
            </nav>
          </div>

          {/* Settings Section */}
          <div className="mt-auto">
            <nav>
              <Link href="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
              <Link href="/help" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help
              </Link>
            </nav>

            {/* User Profile Section */}
            {user && (
              <div className="flex items-center mt-8 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                <User details={user} height={32} />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.details?.profile?.username || 'Anonymous'}</p>
                  <p className="text-xs text-gray-500">{user?.details?.metadata?.email || ''}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button - Only visible on mobile */}
      <button 
        className="md:hidden fixed bottom-4 right-4 bg-brand text-white p-3 rounded-full shadow-lg z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="h-full overflow-y-auto">
              {/* Mobile menu content - same as desktop but with close button */}
              <div className="flex justify-end p-4">
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Rest of the sidebar content */}
              <div className="px-4">
                {/* Copy the same content structure as desktop sidebar */}
                {/* ... */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}