import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/menu', label: 'Меню' },
  { to: '/about', label: 'О нас' },
  { to: '/contact', label: 'Контакты' },
  { to: '/reservations', label: 'Бронирование' },
  { to: '/admin', label: 'Админ' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <header
      className="site-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(131, 86, 45, 0.15)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link to="/" className="header-logo" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/images/kwen.png" alt="Kwen" style={{ height: '6.5rem', width: 'auto', objectFit: 'contain' }} />
        </Link>

        <nav
          style={{
            display: 'none',
            gap: '2.25rem',
            alignItems: 'center',
          }}
          className="desktop-nav"
        >
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="nav-link"
              style={{
                fontSize: '1.1rem',
                fontWeight: 500,
                color: location.pathname === to ? 'var(--color-secondary-light)' : 'rgba(255, 255, 255, 0.95)',
                position: 'relative',
              }}
            >
              {label}
              {location.pathname === to && (
                <motion.span
                  layoutId="nav-underline"
                  style={{
                    position: 'absolute',
                    bottom: -6,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: 'var(--color-secondary)',
                    borderRadius: 1,
                  }}
                />
              )}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-menu-btn"
          style={{ padding: 10 }}
          aria-label="Меню"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              overflow: 'hidden',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'rgba(0, 0, 0, 0.1)',
            }}
            className="mobile-nav"
          >
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 500,
                    color: location.pathname === to ? 'var(--color-secondary-light)' : '#FFFFFF',
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <style>{`
        .site-header {
          backdrop-filter: blur(16px);
        }
        .header-logo:hover {
          opacity: 0.95;
        }
        .nav-link:hover {
          color: var(--color-secondary-light) !important;
        }
        .mobile-menu-btn {
          color: #FFFFFF;
        }
        .mobile-menu-btn:hover {
          opacity: 0.9;
        }
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .mobile-nav { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </header>
  )
}
