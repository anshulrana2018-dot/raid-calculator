import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, HardDrive, Cpu, ShieldAlert, FileText, Info } from 'lucide-react';

const NavLink = ({ to, children, icon: Icon, onClick }: any) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary-50 text-primary-700 font-semibold'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon size={18} />
      <span>{children}</span>
    </Link>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg text-white">
              <HardDrive size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
              RAID Master
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={Cpu}>Calculator</NavLink>
            <NavLink to="/compare" icon={FileText}>Compare</NavLink>
            <NavLink to="/fault-tolerance" icon={ShieldAlert}>Fault Tolerance</NavLink>
            <NavLink to="/about" icon={Info}>About & AI</NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-4 space-y-2 absolute w-full shadow-lg">
            <NavLink to="/" icon={Cpu} onClick={() => setIsMenuOpen(false)}>Calculator</NavLink>
            <NavLink to="/compare" icon={FileText} onClick={() => setIsMenuOpen(false)}>Compare</NavLink>
            <NavLink to="/fault-tolerance" icon={ShieldAlert} onClick={() => setIsMenuOpen(false)}>Fault Tolerance</NavLink>
            <NavLink to="/about" icon={Info} onClick={() => setIsMenuOpen(false)}>About & AI</NavLink>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <HardDrive size={20} />
              <span className="font-bold">RAID Master</span>
            </div>
            <p className="text-sm">
              The world's best RAID calculation and comparison tool. Built for professionals, hobbyists, and data hoarders.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">RAID Calculator</Link></li>
              <li><Link to="/compare" className="hover:text-white transition">RAID Comparison</Link></li>
              <li><Link to="/fault-tolerance" className="hover:text-white transition">Fault Tolerance</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link to="/raid-levels" className="hover:text-white transition">RAID Levels Explained</Link></li>
              <li><Link to="/about" className="hover:text-white transition">AI Disclosure</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-white transition">Disclaimer</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          © {new Date().getFullYear()} RAID Master. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
