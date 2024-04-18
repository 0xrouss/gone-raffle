"use client";

import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="bg-gone text-white py-4">
        <div className="container mx-auto flex justify-center">
          <p>&copy; 2024 Goneffle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;