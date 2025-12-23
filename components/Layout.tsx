import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

// Icons
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const ScriptIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>;
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>;
const LearnIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;

const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  // Hide nav on onboarding
  if (currentView === AppView.ONBOARDING) {
    return <div className="min-h-screen bg-scout-dark text-white">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-scout-dark text-white flex flex-col max-w-md mx-auto relative border-x border-zinc-800 shadow-2xl">
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-zinc-900 border-t border-zinc-800 z-50 pb-safe">
        <div className="flex justify-around items-center p-2">
          <NavButton 
            active={currentView === AppView.HOME} 
            onClick={() => onChangeView(AppView.HOME)} 
            icon={<HomeIcon />} 
            label="Home" 
          />
          <NavButton 
            active={currentView === AppView.SCRIPT_ANALYZER} 
            onClick={() => onChangeView(AppView.SCRIPT_ANALYZER)} 
            icon={<ScriptIcon />} 
            label="Script" 
          />
          <NavButton 
            active={currentView === AppView.VIDEO_ANALYZER} 
            onClick={() => onChangeView(AppView.VIDEO_ANALYZER)} 
            icon={<VideoIcon />} 
            label="Video" 
          />
          <NavButton 
            active={currentView === AppView.LEARN} 
            onClick={() => onChangeView(AppView.LEARN)} 
            icon={<LearnIcon />} 
            label="Learn" 
          />
        </div>
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-zinc-800 text-scout-red border-2 border-zinc-700 -translate-y-2 shadow-lg' 
        : 'text-zinc-500 hover:bg-zinc-800/50'
    }`}
  >
    <div className={active ? 'scale-110 transition-transform' : ''}>{icon}</div>
    <span className="text-[10px] font-bold mt-1">{label}</span>
  </button>
);

export default Layout;
