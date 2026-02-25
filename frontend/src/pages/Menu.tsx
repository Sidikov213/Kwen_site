import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

import { api } from '../api/client'

const API_ORIGIN = ''

type Category = { id: number; name: string; slug: string; description: string | null; sort_order: number }
type MenuItem = { id: number; name: string; description: string | null; price: number; image_url: string | null; category_id: number }

function getImageUrl(url: string | null): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${API_ORIGIN}${url}`
}

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getCategories(), api.getMenuItems()])
      .then(([cats, menuItems]) => {
        setCategories(cats)
        setItems(menuItems)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const grouped = categories
    .map((cat) => ({
      ...cat,
      items: items.filter((i) => i.category_id === cat.id),
    }))
    .filter((g) => g.items.length > 0)
    .filter((g) => !selectedCategory || g.id === selectedCategory)

  return (
    <>
      <Helmet>
        <title>Меню — Kwen | Кафе в Махачкале</title>
        <meta name="description" content="Меню кафе Kwen: кофе, завтраки, основные блюда, горячие напитки." />
      </Helmet>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.25rem, 5vw, 3.25rem)',
            textAlign: 'center',
            marginBottom: '0.5rem',
            color: 'var(--color-text-on-light)',
          }}
        >
          Меню
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', color: 'var(--color-text-on-light-muted)', marginBottom: '2.5rem', fontSize: '1.05rem' }}
        >
          Свежий кофе, завтраки и блюда на любой вкус
        </motion.p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div
              style={{
                width: 40,
                height: 40,
                margin: '0 auto 1rem',
                border: '3px solid var(--color-primary-light)',
                borderTopColor: 'var(--color-secondary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <p style={{ color: 'var(--color-text-on-light-muted)' }}>Загрузка меню...</p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginBottom: '3rem',
              }}
            >
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: 'var(--radius-full)',
                  background: selectedCategory === null ? 'var(--color-secondary)' : '#FFFFFF',
                  color: selectedCategory === null ? '#FFFFFF' : 'var(--color-text-on-light)',
                  fontWeight: 500,
                  boxShadow: selectedCategory === null ? 'var(--shadow-soft)' : 'none',
                  border: '1px solid transparent',
                  transition: 'var(--transition)',
                }}
              >
                Всё меню
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.6rem 1.5rem',
                    borderRadius: 'var(--radius-full)',
                    background: selectedCategory === cat.id ? 'var(--color-secondary)' : '#FFFFFF',
                    color: selectedCategory === cat.id ? '#FFFFFF' : 'var(--color-text-on-light)',
                    fontWeight: 500,
                    boxShadow: selectedCategory === cat.id ? 'var(--shadow-soft)' : 'none',
                    border: '1px solid rgba(139, 115, 85, 0.2)',
                    transition: 'var(--transition)',
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {grouped.map((group, gi) => (
                <motion.section
                  key={group.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.08 }}
                >
                  <h2
                    style={{
                      fontSize: '1.75rem',
                      marginBottom: '0.25rem',
                      color: 'var(--color-secondary-dark)',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {group.name}
                  </h2>
                  {group.description && (
                    <p style={{ fontSize: '0.95rem', color: 'var(--color-text-on-light-muted)', marginBottom: '1.5rem' }}>
                      {group.description}
                    </p>
                  )}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: '1.5rem',
                    }}
                  >
                    {group.items.map((item, ii) => (
                      <motion.article
                        key={item.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: gi * 0.08 + ii * 0.05 }}
                        style={{
                          background: '#FFFFFF',
                          borderRadius: 'var(--radius-lg)',
                          overflow: 'hidden',
                          boxShadow: 'var(--shadow-soft)',
                          transition: 'transform var(--transition), box-shadow var(--transition)',
                        }}
                        className="menu-card"
                      >
                        <div
                          style={{
                            aspectRatio: '4/3',
                            background: 'var(--color-primary-light)',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          {item.image_url ? (
                            <img
                              src={getImageUrl(item.image_url)}
                              alt={item.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                              loading="lazy"
                            />
                          ) : (
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-secondary)',
                                opacity: 0.4,
                                fontSize: '2.5rem',
                              }}
                            >
                              ☕
                            </div>
                          )}
                        </div>
                        <div style={{ padding: '1.25rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, flex: 1 }}>{item.name}</h3>
                            <span style={{ fontWeight: 600, color: 'var(--color-secondary)', whiteSpace: 'nowrap' }}>
                              {item.price} ₽
                            </span>
                          </div>
                          {item.description && (
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-on-light-muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </motion.section>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .menu-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-medium);
        }
      `}</style>
    </>
  )
}
