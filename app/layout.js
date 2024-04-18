import { Inter } from 'next/font/google';
import './globals.css';
import { Web3Provider } from './components/Web3Provider';
import Layout from './components/Layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Goneffle',
  description: 'A decentralized raffle platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          <Layout>{children}</Layout>
        </Web3Provider>
      </body>
    </html>
  );
}