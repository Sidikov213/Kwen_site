import { Link } from 'react-router-dom'
import { MapPin, Clock, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--color-primary-dark)',
        color: '#FFFFFF',
        padding: '3rem 1.5rem 2rem',
        marginTop: '4rem',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
        }}
        className="footer-grid"
      >
        <div>
          <Link
            to="/"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: 'inherit',
            }}
          >
            Kwen
          </Link>
          <p style={{ marginTop: '0.75rem', opacity: 0.95, fontSize: '1rem', lineHeight: 1.6 }}>
            Кафе в Махачкале. Свежий кофе, завтраки и уютная атмосфера.
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '1rem' }}>
            Контакты
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a href="https://yandex.ru/maps/?text=проспект+Казбекова+102+Махачкала" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit' }}>
              <MapPin size={18} />
              <span>проспект Казбекова, 102, Махачкала, Республика Дагестан</span>
            </a>
            <a href="tel:+79882936262" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit' }}>
              <Phone size={18} />
              <span>+7 (988) 293-62-62</span>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} />
              <span>Ежедневно с 9:00 до 23:00</span>
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '1rem' }}>
            Навигация
          </h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/menu" style={{ color: 'inherit', opacity: 0.9 }}>Меню</Link>
            <Link to="/about" style={{ color: 'inherit', opacity: 0.9 }}>О нас</Link>
            <Link to="/contact" style={{ color: 'inherit', opacity: 0.9 }}>Контакты</Link>
            <Link to="/reservations" style={{ color: 'inherit', opacity: 0.9 }}>Бронирование</Link>
          </nav>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: '2rem auto 0',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center',
          fontSize: '0.9rem',
          opacity: 0.9,
        }}
      >
        © {new Date().getFullYear()} Kwen. Все права защищены.
      </div>

      <style>{`
        @media (min-width: 640px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 900px) {
          .footer-grid { grid-template-columns: 1.5fr 1fr 1fr; }
        }
      `}</style>
    </footer>
  )
}
