import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Menu from './pages/Menu'
import About from './pages/About'
import Contact from './pages/Contact'
import Reservations from './pages/Reservations'
import Admin from './pages/Admin'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/*" element={
          <Layout>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/reservations" element={<Reservations />} />
              </Routes>
            </AnimatePresence>
          </Layout>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App
