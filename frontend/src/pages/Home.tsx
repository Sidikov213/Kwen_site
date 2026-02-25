import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Coffee, UtensilsCrossed, MapPin, ChevronDown } from 'lucide-react'
import { api } from '../api/client'

type Banner = { id: number; title: string; discount_text: string | null; description: string | null; image_url: string | null; link: string | null }

export default function Home() {
  const [banners, setBanners] = useState<Banner[]>([])

  useEffect(() => {
    api.getBanners().then(setBanners).catch(() => {})
  }, [])
  return (
    <>
      <Helmet>
        <title>Kwen — Кафе в Махачкале | Республика Дагестан</title>
        <meta name="description" content="Kwen — кафе в Махачкале. Свежий кофе, завтраки и уютная атмосфера. Открыто с 9:00 до 23:00." />
      </Helmet>

      {/* Hero — премиальный full-screen */}
      <section className="hero-premium">
        {/* Фоновые слои */}
        <div className="hero-bg-layer hero-bg-image" />
        <div className="hero-bg-layer hero-bg-gradient" />
        <div className="hero-bg-layer hero-bg-mesh" />
        <div className="hero-bg-layer hero-bg-vignette" />
        <div className="hero-grain" />

        {/* Декоративные плавающие элементы */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-line hero-line-1" />
        <div className="hero-line hero-line-2" />

        {/* Контент */}
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hero-badge"
          >
            <span className="hero-badge-dot" />
            проспект Казбекова, 102 · Махачкала
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="hero-title"
          >
            <img src="/images/kwen.png" alt="Kwen" className="hero-title-main hero-title-logo" />
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="hero-divider"
          />

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="hero-subtitle"
          >
            Трендовое кафе на районе,<br />
            куда едут из центра
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="hero-cta"
          >
            <Link to="/menu" className="hero-btn hero-btn-primary">
              Смотреть меню
            </Link>
            <Link to="/reservations" className="hero-btn hero-btn-outline">
              Забронировать
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="hero-scroll"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={24} />
          </motion.div>
        </motion.div>
      </section>

      {/* Акции / Баннеры */}
      {banners.length > 0 && (
        <section className="home-banners">
          <div className="banners-container">
            {banners.map((banner, i) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to={banner.link || '/menu'}
                  className="banner-card"
                >
                  {banner.image_url && (
                    <div className="banner-image">
                      <img src={banner.image_url} alt={banner.title} />
                    </div>
                  )}
                  <div className="banner-content">
                    {banner.discount_text && (
                      <span className="banner-discount">{banner.discount_text}</span>
                    )}
                    <h3 className="banner-title">{banner.title}</h3>
                    {banner.description && (
                      <p className="banner-desc">{banner.description}</p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      <section className="home-gallery">
        <div className="gallery-grid">
          {['hero', 'interior', 'coffee', 'food'].map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="gallery-item"
            >
              <img
                src={`/images/${name}.jpg`}
                alt={`Kwen ${name}`}
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="home-features">
        {[
          { icon: Coffee, title: 'Свежий кофе', text: 'Собственная обжарка и альтернативная заварка' },
          { icon: UtensilsCrossed, title: 'Завтраки до 14:00', text: 'Омлеты, тосты, датский завтрак с лососем' },
          { icon: MapPin, title: 'Проспект Казбекова, 102', text: 'Уютное место в центре Махачкалы' },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="feature-card"
          >
            <div className="feature-icon-wrap">
              <item.icon size={28} className="feature-icon" />
            </div>
            <h3 className="feature-title">{item.title}</h3>
            <p className="feature-text">{item.text}</p>
          </motion.div>
        ))}
      </section>

      {/* CTA */}
      <section className="home-cta">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="cta-title"
        >
          Ждём вас
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="cta-subtitle"
        >
          пр. Казбекова, 102 · Ежедневно с 9:00 до 23:00
        </motion.p>
        <Link to="/reservations" className="cta-btn">
          Забронировать
        </Link>
      </section>

      <style>{`
        .hero-premium {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-bg-layer {
          position: absolute;
          inset: 0;
        }

        .hero-bg-image {
          background: url(/images/hero.jpg) center/cover no-repeat;
          opacity: 0.2;
        }

        .hero-bg-gradient {
          background: linear-gradient(165deg,
            #4A4752 0%,
            #63606B 25%,
            #5a5768 50%,
            #4A4752 100%);
        }

        .hero-bg-mesh {
          background: radial-gradient(ellipse 80% 50% at 50% 20%, rgba(131, 86, 45, 0.15) 0%, transparent 50%),
                    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(131, 86, 45, 0.08) 0%, transparent 50%),
                    radial-gradient(ellipse 50% 30% at 20% 70%, rgba(131, 86, 45, 0.06) 0%, transparent 50%);
        }

        .hero-bg-vignette {
          background: radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%);
        }

        .hero-grain {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          animation: hero-orb-float 20s ease-in-out infinite;
        }

        .hero-orb-1 {
          width: 400px;
          height: 400px;
          background: rgba(131, 86, 45, 0.3);
          top: -10%;
          right: -5%;
          animation-delay: 0s;
        }

        .hero-orb-2 {
          width: 300px;
          height: 300px;
          background: rgba(131, 86, 45, 0.2);
          bottom: -5%;
          left: -5%;
          animation-delay: -7s;
        }

        .hero-orb-3 {
          width: 200px;
          height: 200px;
          background: rgba(131, 86, 45, 0.15);
          top: 50%;
          left: 10%;
          animation-delay: -14s;
        }

        .hero-line {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          opacity: 0.5;
        }

        .hero-line-1 {
          width: 40%;
          top: 25%;
          left: 0;
          transform: rotate(-15deg);
        }

        .hero-line-2 {
          width: 30%;
          bottom: 30%;
          right: 0;
          transform: rotate(10deg);
        }

        @keyframes hero-orb-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 30px) scale(0.95); }
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 1.25rem 1rem;
          max-width: 720px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.85);
          margin-bottom: 1.25rem;
          font-weight: 500;
        }

        .hero-badge-dot {
          width: 6px;
          height: 6px;
          background: var(--color-secondary);
          border-radius: 50%;
          animation: hero-badge-pulse 2s ease-in-out infinite;
        }

        @keyframes hero-badge-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }

        .hero-title-main.hero-title-logo {
          display: block;
          width: clamp(14rem, 88vw, 48rem);
          height: auto;
          max-height: clamp(8rem, 45vw, 24rem);
          object-fit: contain;
          filter: drop-shadow(0 2px 12px rgba(0,0,0,0.3)) drop-shadow(0 0 40px rgba(131, 86, 45, 0.2));
        }

        .hero-divider {
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--color-secondary), transparent);
          margin: 1.5rem auto;
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          color: rgba(255,255,255,0.9);
          line-height: 1.7;
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        .hero-cta {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 2rem;
        }

        .hero-btn {
          display: inline-block;
          padding: 1rem 1.75rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 100px;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          letter-spacing: 0.02em;
        }

        .hero-btn-primary {
          background: var(--color-secondary);
          color: #FFFFFF;
          box-shadow: 0 8px 32px rgba(131, 86, 45, 0.4);
        }

        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(131, 86, 45, 0.5);
        }

        .hero-btn-outline {
          border: 2px solid rgba(255,255,255,0.8);
          color: #FFFFFF;
        }

        .hero-btn-outline:hover {
          background: rgba(255,255,255,0.1);
          border-color: #FFFFFF;
        }

        .hero-scroll {
          position: absolute;
          bottom: max(1rem, env(safe-area-inset-bottom));
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.6);
        }

        .home-banners {
          background: var(--color-cream);
          padding: 3rem 1.5rem;
        }

        .banners-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .banner-card {
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          border: 1px solid rgba(99, 96, 107, 0.06);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          color: inherit;
        }

        .banner-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.12);
        }

        .banner-image {
          aspect-ratio: 16/9;
          overflow: hidden;
          background: var(--color-cream-dark);
        }

        .banner-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .banner-content {
          padding: 1.5rem;
          position: relative;
        }

        .banner-discount {
          display: inline-block;
          background: var(--color-secondary);
          color: #FFFFFF;
          font-size: 1.25rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          margin-bottom: 0.75rem;
        }

        .banner-title {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-text-on-light);
          margin-bottom: 0.25rem;
        }

        .banner-desc {
          color: var(--color-text-on-light-muted);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .home-gallery {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 1.5rem;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1rem;
        }

        .gallery-item {
          aspect-ratio: 4/3;
          border-radius: 16px;
          overflow: hidden;
          background: var(--color-cream-dark);
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .home-features {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 1.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          padding: 2.5rem;
          background: #FFFFFF;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.06);
          border: 1px solid rgba(99, 96, 107, 0.06);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.1);
        }

        .feature-icon-wrap {
          width: 64px;
          height: 64px;
          margin: 0 auto 1.5rem;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(131, 86, 45, 0.12) 0%, rgba(131, 86, 45, 0.06) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-icon {
          color: var(--color-secondary);
        }

        .feature-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--color-text-on-light);
          margin-bottom: 0.5rem;
        }

        .feature-text {
          color: var(--color-text-on-light-muted);
          font-size: 1.05rem;
          line-height: 1.65;
        }

        .home-cta {
          background: linear-gradient(165deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: #FFFFFF;
          padding: 5rem 1.5rem;
          text-align: center;
        }

        .cta-title {
          font-family: var(--font-heading);
          font-size: clamp(2rem, 5vw, 3rem);
          margin-bottom: 0.5rem;
        }

        .cta-subtitle {
          font-size: 1.1rem;
          opacity: 0.95;
          margin-bottom: 1.5rem;
        }

        .cta-btn {
          display: inline-block;
          padding: 1rem 2rem;
          background: var(--color-secondary);
          color: #FFFFFF;
          border-radius: 100px;
          font-weight: 600;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(131, 86, 45, 0.4);
        }

        @media (max-width: 480px) {
          .hero-cta { flex-direction: column; align-items: stretch; }
          .hero-btn { width: 100%; text-align: center; }
        }

        @media (min-width: 641px) {
          .hero-content { padding: 2rem; }
          .hero-badge { font-size: 0.85rem; letter-spacing: 0.25em; margin-bottom: 1.5rem; }
          .hero-cta { margin-top: 2.5rem; gap: 1rem; }
          .hero-btn { padding: 1.1rem 2.25rem; }
        }

        @media (max-width: 640px) {
          .home-banners { padding: 2rem 1rem; }
          .banners-container { grid-template-columns: 1fr; }
          .home-gallery { padding: 2rem 1rem; }
          .gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
          .home-features { padding: 2rem 1rem; gap: 1.5rem; }
          .feature-card { padding: 1.5rem; }
          .home-cta { padding: 3rem 1rem; }
        }
      `}</style>
    </>
  )
}
