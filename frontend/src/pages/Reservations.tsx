import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { api } from '../api/client'

export default function Reservations() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: 2,
    comment: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await api.createReservation({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        date: form.date,
        time: form.time,
        guests: form.guests,
        comment: form.comment || undefined,
      })
      setStatus('success')
      setForm({ name: '', phone: '', email: '', date: '', time: '', guests: 2, comment: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Ошибка бронирования')
    }
  }

  return (
    <>
      <Helmet>
        <title>Бронирование столика — Kwen | Кафе в Махачкале</title>
        <meta name="description" content="Забронируйте столик в кафе Kwen. Проспект Казбекова, 102, Махачкала." />
      </Helmet>

      <div className="page-container" style={{ maxWidth: 560, margin: '0 auto' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3rem)', textAlign: 'center', marginBottom: '0.5rem' }}
        >
          Бронирование
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', color: 'var(--color-text-on-light-muted)', marginBottom: '2rem' }}
        >
          Забронируйте столик в Kwen
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
          <input
            type="text"
            placeholder="Имя *"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            minLength={2}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-cream-dark)',
              fontSize: '1rem',
            }}
          />
          <input
            type="tel"
            placeholder="Телефон *"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            required
            minLength={10}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-cream-dark)',
              fontSize: '1rem',
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-cream-dark)',
              fontSize: '1rem',
            }}
          />
          <div className="reservation-datetime" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input
              type="date"
              placeholder="Дата"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              required
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-cream-dark)',
                fontSize: '1rem',
              }}
            />
            <input
              type="time"
              placeholder="Время"
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              required
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-cream-dark)',
                fontSize: '1rem',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Количество гостей
            </label>
            <select
              value={form.guests}
              onChange={(e) => setForm((f) => ({ ...f, guests: +e.target.value }))}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-cream-dark)',
                fontSize: '1rem',
                width: '100%',
              }}
            >
              {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? 'гость' : n < 5 ? 'гостя' : 'гостей'}</option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Пожелания (необязательно)"
            value={form.comment}
            onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
            rows={3}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-cream-dark)',
              fontSize: '1rem',
              resize: 'vertical',
            }}
          />
          {status === 'success' && (
            <p style={{ color: 'var(--color-sage)' }}>Заявка отправлена. Мы свяжемся с вами для подтверждения.</p>
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
            }}
          >
            {status === 'loading' ? 'Отправка...' : 'Забронировать'}
          </button>
        </motion.form>
      </div>

      <style>{`
        @media (max-width: 360px) {
          .reservation-datetime { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
