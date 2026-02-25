import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { MapPin, Clock, Phone } from 'lucide-react'
import { api } from '../api/client'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await api.createContact({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        message: form.message,
      })
      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Ошибка отправки')
    }
  }

  return (
    <>
      <Helmet>
        <title>Контакты — Kwen | Кафе в Махачкале</title>
        <meta name="description" content="Свяжитесь с кафе Kwen. Адрес: проспект Казбекова, 102, Махачкала. Телефон: +7 (988) 293-62-62. Режим работы: 9:00–23:00." />
      </Helmet>

      <div className="page-container" style={{ maxWidth: 800, margin: '0 auto' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3rem)', textAlign: 'center', marginBottom: '2rem' }}
        >
          Контакты
        </motion.h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem',
          }}
          className="contact-grid"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: '#FFFFFF',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Как нас найти</h3>
            <a
              href="https://yandex.ru/maps/?text=проспект+Казбекова+102+Махачкала"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'inherit', marginBottom: '1rem' }}
            >
              <MapPin size={22} style={{ flexShrink: 0, color: 'var(--color-secondary)' }} />
              <span>проспект Казбекова, 102, Махачкала, Республика Дагестан</span>
            </a>
            <a href="tel:+79882936262" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'inherit', marginBottom: '1rem' }}>
              <Phone size={22} style={{ flexShrink: 0, color: 'var(--color-secondary)' }} />
              <span>+7 (988) 293-62-62</span>
            </a>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Clock size={22} style={{ flexShrink: 0, color: 'var(--color-secondary)' }} />
              <span>Ежедневно с 9:00 до 23:00</span>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            style={{
              background: '#FFFFFF',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-soft)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Напишите нам</h3>
            <input
              type="text"
              placeholder="Имя *"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-cream-dark)',
                fontSize: '1rem',
              }}
            />
            <input
              type="email"
              placeholder="Email *"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-cream-dark)',
                fontSize: '1rem',
              }}
            />
            <input
              type="tel"
              placeholder="Телефон"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-cream-dark)',
                fontSize: '1rem',
              }}
            />
            <textarea
              placeholder="Сообщение *"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              required
              rows={4}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-cream-dark)',
                fontSize: '1rem',
                resize: 'vertical',
              }}
            />
            {status === 'success' && (
              <p style={{ color: 'var(--color-sage)' }}>Сообщение отправлено. Мы свяжемся с вами.</p>
            )}
            {status === 'error' && <p style={{ color: 'var(--color-secondary)' }}>{errorMsg}</p>}
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                padding: '0.875rem 1.5rem',
                background: 'var(--color-secondary)',
                color: 'white',
                borderRadius: 'var(--radius-full)',
                fontWeight: 500,
                alignSelf: 'flex-start',
              }}
            >
              {status === 'loading' ? 'Отправка...' : 'Отправить'}
            </button>
          </motion.form>
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .contact-grid { grid-template-columns: 1fr 1.2fr; }
        }
      `}</style>
    </>
  )
}
