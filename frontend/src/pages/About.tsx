import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <>
      <Helmet>
        <title>О нас — Kwen | Кафе в Махачкале</title>
        <meta name="description" content="Kwen — кафе в Махачкале. Узнайте больше о нашем месте и философии." />
      </Helmet>

      <section
        className="about-hero"
        style={{
          minHeight: '40vh',
          display: 'flex',
          alignItems: 'center',
          background: 'var(--color-cream)',
          padding: '3rem 1rem',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem', color: 'var(--color-text-on-light)' }}
          >
            О Kwen
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: '1.1rem', color: 'var(--color-text-on-light-muted)', lineHeight: 1.8 }}
          >
            Kwen — это уютное кафе в центре Махачкалы. Мы находимся на проспекте Казбекова и создаём тёплое пространство для тех, кто ценит качественный кофе, вкусные завтраки и приятную атмосферу.
          </motion.p>
        </div>
      </section>

      <section className="page-container" style={{ maxWidth: 900, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem',
          }}
          className="about-grid"
        >
          <div
            style={{
              background: '#FFFFFF',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-secondary-dark)' }}>
              Наша философия
            </h3>
            <p style={{ color: 'var(--color-text-on-light-muted)', lineHeight: 1.7 }}>
              Мы верим в простые вещи: свежий кофе, честные продукты и внимание к деталям. Каждая чашка — это результат тщательного отбора зёрен и мастерства бариста.
            </p>
          </div>
          <div
            style={{
              background: '#FFFFFF',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-secondary-dark)' }}>
              Меню
            </h3>
            <p style={{ color: 'var(--color-text-on-light-muted)', lineHeight: 1.7 }}>
              Завтраки с авокадо и лососем, омлеты с креветками, классический кофе и авторские напитки — мы готовим то, что хочется есть и пить каждый день.
            </p>
            <Link
              to="/menu"
              style={{
                display: 'inline-block',
                marginTop: '1rem',
                color: 'var(--color-secondary)',
                fontWeight: 500,
              }}
            >
              Смотреть меню →
            </Link>
          </div>
        </motion.div>
      </section>

      <style>{`
        @media (min-width: 641px) {
          .about-hero { padding: 4rem 1.5rem !important; }
        }
        @media (min-width: 640px) {
          .about-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </>
  )
}
