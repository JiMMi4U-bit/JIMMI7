
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 glass border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => onViewChange('home')}
            >
              <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">MedSync</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onViewChange('patient')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeView === 'patient' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Patient Portal
              </button>
              <button 
                onClick={() => onViewChange('admin')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeView === 'admin' 
                    ? 'bg-slate-800 text-white shadow-lg' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Admin Panel
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">© 2024 MedSync Hospital Systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
