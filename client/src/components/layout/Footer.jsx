import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-inner mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-purple-100 text-center md:text-left">
            © {new Date().getFullYear()}{' '}
            <span className="font-semibold text-white">Invoice App</span>. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2 text-sm">
            <a href="#" className="text-purple-200 hover:text-white transition duration-200">
              Terms
            </a>
            <a href="#" className="text-purple-200 hover:text-white transition duration-200">
              Privacy
            </a>
            <a href="#" className="text-purple-200 hover:text-white transition duration-200">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
