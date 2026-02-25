import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: 'calc(100vh - 180px)' }}>
        {children ?? <Outlet />}
      </main>
      <Footer />
    </>
  )
}
