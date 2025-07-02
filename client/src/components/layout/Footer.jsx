import React from 'react';
import { Heart, Sparkles, FileText } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full relative overflow-hidden mt-auto">
      {/* Animated background with gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent" />
      
      {/* Floating sparkles */}
      <div className="absolute top-2 left-20 animate-pulse">
        <Sparkles className="w-2 h-2 text-white/30" />
      </div>
      <div className="absolute top-4 right-32 animate-pulse animation-delay-1000">
        <Sparkles className="w-3 h-3 text-fuchsia-200/40" />
      </div>
      
      {/* Main footer content */}
      <div className="relative z-10 backdrop-blur-sm border-t border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Left side - Brand and copyright */}
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-violet-300 via-fuchsia-300 to-purple-300 rounded-lg shadow-lg animate-pulse">
                  <span className="text-violet-900 font-extrabold text-xs">X</span>
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-white via-violet-100 to-fuchsia-100 bg-clip-text text-transparent drop-shadow-sm">
                  Invo<span className="text-fuchsia-200">X</span>
                </span>
              </div>
            </div>

            {/* Center - Copyright */}
            <div className="flex items-center gap-2 text-sm text-violet-100/90">
              <span>© {new Date().getFullYear()}</span>
              <span>•</span>
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>for better invoicing</span>
            </div>
            
            {/* Right side - Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 text-sm">
              <a 
                href="#" 
                className="group text-violet-200 hover:text-white transition-all duration-300 transform hover:scale-110 relative"
              >
                <span className="relative z-10">Terms</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-400 group-hover:w-full transition-all duration-300" />
              </a>
              <a 
                href="#" 
                className="group text-violet-200 hover:text-white transition-all duration-300 transform hover:scale-110 relative"
              >
                <span className="relative z-10">Privacy</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-400 group-hover:w-full transition-all duration-300" />
              </a>
              <a 
                href="#" 
                className="group text-violet-200 hover:text-white transition-all duration-300 transform hover:scale-110 relative"
              >
                <span className="relative z-10">Contact</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-400 group-hover:w-full transition-all duration-300" />
              </a>
            </div>
          </div>

          {/* Additional decorative line */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 text-xs text-violet-200/60">
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span>Next-gen invoicing. Empowering businesses worldwide.</span>
                <Sparkles className="w-3 h-3 animate-pulse animation-delay-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
