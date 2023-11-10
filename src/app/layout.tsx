import Providers from '@/components/Providers/providers'
import './globals.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import 'react-toastify/dist/ReactToastify.css';
import { Web3Modal } from "../context/Web3Modal";

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children, 
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Web3Modal>
          <Providers>
            <Navbar />
            <w3m-button />
            {children}
            <Footer />
          </Providers>
        </Web3Modal>
        {/* Footer shouldn't be on all pages, but I put it here for testing purposes */}
	  </body>
    </html>
  )
}
