import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import {
  fetchApiWithAuth,
  postApi,
  putApi,
  deleteApi,
  uploadFile,
} from '../api/client'

type Category = { id: number; name: string; slug: string; description: string | null; sort_order: number }
type MenuItem = {
  id: number
  name: string
  description: string | null
  price: number
  image_url: string | null
  category_id: number
  is_available: boolean
}
type Banner = {
  id: number
  title: string
  discount_text: string | null
  description: string | null
  image_url: string | null
  link: string | null
  is_active: boolean
  sort_order: number
}

function getImageUrl(url: string | null): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return url
}

export default function Admin() {
  const { token, login, logout, isAuthenticated } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showAddItem, setShowAddItem] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [banners, setBanners] = useState<Banner[]>([])
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [showAddBanner, setShowAddBanner] = useState(false)

  const loadData = () => {
    if (!token) return
    Promise.all([
      fetchApiWithAuth<Category[]>('/admin/categories', token),
      fetchApiWithAuth<MenuItem[]>('/admin/menu/items', token),
      fetchApiWithAuth<Banner[]>('/admin/banners', token),
    ])
      .then(([cats, menuItems, b]) => {
        setCategories(cats)
        setItems(menuItems)
        setBanners(b)
      })
      .catch(console.error)
  }

  useEffect(() => {
    if (token) loadData()
  }, [token])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoading(true)
    try {
      const res = await postApi<{ access_token: string }>('/admin/login', { username, password })
      login(res.access_token)
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        <Helmet><title>Вход — Kwen Admin</title></Helmet>
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleLogin}
            style={{
              background: '#FFFFFF',
              padding: '2.5rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-medium)',
              width: '100%',
              maxWidth: 360,
            }}
          >
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '1.5rem' }}>
              Вход в админ-панель
            </h1>
            <input
              type="text"
              placeholder="Логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-cream-dark)',
                fontSize: '1rem',
              }}
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-cream-dark)',
                fontSize: '1rem',
              }}
            />
            {loginError && <p style={{ color: 'var(--color-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>{loginError}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: 'var(--color-secondary)',
                color: 'white',
                borderRadius: 'var(--radius-full)',
                fontWeight: 500,
              }}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </motion.form>
        </div>
      </>
    )
  }

  const handleSaveItem = async (data: Partial<MenuItem>) => {
    if (!token) return
    try {
      if (editingItem) {
        await putApi(`/admin/menu/items/${editingItem.id}`, data, token)
        setEditingItem(null)
      } else if (showAddItem) {
        await postApi('/admin/menu/items', { ...data, category_id: data.category_id || categories[0]?.id }, token)
        setShowAddItem(false)
      }
      loadData()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка')
    }
  }

  const handleDeleteItem = async (id: number) => {
    if (!token || !confirm('Удалить позицию?')) return
    try {
      await deleteApi(`/admin/menu/items/${id}`, token)
      loadData()
      setEditingItem(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка')
    }
  }

  const handleImageUpload = async (itemId: number, file: File) => {
    if (!token) return
    try {
      const { url } = await uploadFile(file, token)
      await putApi(`/admin/menu/items/${itemId}`, { image_url: url }, token)
      loadData()
      setEditingItem((prev) => (prev?.id === itemId ? { ...prev, image_url: url } : prev))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка загрузки')
    }
  }

  const handleSaveCategory = async (data: Partial<Category>) => {
    if (!token) return
    try {
      if (editingCategory) {
        await putApi(`/admin/categories/${editingCategory.id}`, data, token)
        setEditingCategory(null)
      } else if (showAddCategory) {
        await postApi('/admin/categories', data, token)
        setShowAddCategory(false)
      }
      loadData()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка')
    }
  }

  const handleDeleteCategory = async (id: number) => {
    if (!token || !confirm('Удалить категорию? Позиции тоже удалятся.')) return
    try {
      await deleteApi(`/admin/categories/${id}`, token)
      loadData()
      setEditingCategory(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка')
    }
  }

  const handleSaveBanner = async (data: Partial<Banner>) => {
    if (!token) return
    try {
      if (editingBanner) {
        await putApi(`/admin/banners/${editingBanner.id}`, data, token)
        setEditingBanner(null)
      } else if (showAddBanner) {
        await postApi('/admin/banners', data, token)
        setShowAddBanner(false)
      }
      loadData()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка')
    }
  }

  const handleDeleteBanner = async (id: number) => {
    if (!token || !confirm('Удалить баннер?')) return
    try {
      await deleteApi(`/admin/banners/${id}`, token)
      loadData()
      setEditingBanner(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка')
    }
  }

  const handleBannerImageUpload = async (bannerId: number, file: File) => {
    if (!token) return
    try {
      const { url } = await uploadFile(file, token)
      await putApi(`/admin/banners/${bannerId}`, { image_url: url }, token)
      loadData()
      setEditingBanner((prev) => (prev?.id === bannerId ? { ...prev, image_url: url } : prev))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка загрузки')
    }
  }

  return (
    <>
      <Helmet><title>Админ-панель — Kwen</title></Helmet>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem' }}>Админ-панель</h1>
          <button
            onClick={logout}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--color-brown)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-muted)',
              fontSize: '0.9rem',
            }}
          >
            Выйти
          </button>
        </div>

        {/* Categories */}
        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Категории</h2>
            <button
              onClick={() => { setShowAddCategory(true); setEditingCategory(null) }}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--color-sage)',
                color: 'white',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 500,
              }}
            >
              + Категория
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  padding: '0.75rem 1rem',
                  background: editingCategory?.id === cat.id ? 'var(--color-cream-dark)' : 'var(--color-warm-white)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: 'var(--shadow-soft)',
                }}
              >
                {editingCategory?.id === cat.id ? (
                  <>
                    <input
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory((c) => c ? { ...c, name: e.target.value } : null)}
                      style={{ padding: '0.25rem 0.5rem', width: 120 }}
                    />
                    <input
                      value={editingCategory.slug}
                      onChange={(e) => setEditingCategory((c) => c ? { ...c, slug: e.target.value } : null)}
                      style={{ padding: '0.25rem 0.5rem', width: 100 }}
                      placeholder="slug"
                    />
                    <button onClick={() => handleSaveCategory(editingCategory)} style={{ fontSize: '0.85rem' }}>✓</button>
                    <button onClick={() => setEditingCategory(null)} style={{ fontSize: '0.85rem' }}>✕</button>
                  </>
                ) : (
                  <>
                    <span>{cat.name}</span>
                    <button onClick={() => setEditingCategory(cat)} style={{ fontSize: '0.8rem', opacity: 0.7 }}>ред.</button>
                    <button onClick={() => handleDeleteCategory(cat.id)} style={{ fontSize: '0.8rem', color: 'var(--color-secondary)' }}>×</button>
                  </>
                )}
              </div>
            ))}
          </div>
          {showAddCategory && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--color-cream-dark)', borderRadius: 'var(--radius-md)' }}>
              <input placeholder="Название" id="newCatName" style={{ padding: '0.5rem', marginRight: '0.5rem', width: 150 }} />
              <input placeholder="slug" id="newCatSlug" style={{ padding: '0.5rem', marginRight: '0.5rem', width: 100 }} />
              <button onClick={() => {
                const name = (document.getElementById('newCatName') as HTMLInputElement)?.value
                const slug = (document.getElementById('newCatSlug') as HTMLInputElement)?.value
                if (name && slug) handleSaveCategory({ name, slug })
              }}>Добавить</button>
              <button onClick={() => setShowAddCategory(false)} style={{ marginLeft: '0.5rem' }}>Отмена</button>
            </div>
          )}
        </section>

        {/* Banners / Акции */}
        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Рекламные баннеры</h2>
            <button
              onClick={() => { setShowAddBanner(true); setEditingBanner(null) }}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--color-secondary)',
                color: 'white',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 500,
              }}
            >
              + Баннер
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {banners.map((b) => (
              <div
                key={b.id}
                style={{
                  padding: '1rem',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-soft)',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                }}
              >
                {b.image_url && (
                  <div style={{ width: 80, height: 45, borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, background: 'var(--color-sand)' }}>
                    <img src={getImageUrl(b.image_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingBanner?.id === b.id ? (
                    <BannerEditForm
                      banner={editingBanner}
                      onSave={handleSaveBanner}
                      onCancel={() => setEditingBanner(null)}
                      onImageUpload={(file) => handleBannerImageUpload(b.id, file)}
                    />
                  ) : (
                    <>
                      <div style={{ fontWeight: 500 }}>{b.title} {b.discount_text && <span style={{ color: 'var(--color-secondary)', marginLeft: '0.5rem' }}>{b.discount_text}</span>}</div>
                      {b.description && <div style={{ fontSize: '0.9rem', color: 'var(--color-text-on-light-muted)' }}>{b.description}</div>}
                      <div style={{ marginTop: '0.5rem' }}>
                        <button onClick={() => setEditingBanner(b)} style={{ fontSize: '0.85rem', marginRight: '0.5rem' }}>Редактировать</button>
                        <button onClick={() => handleDeleteBanner(b.id)} style={{ fontSize: '0.85rem', color: 'var(--color-secondary)' }}>Удалить</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {showAddBanner && (
            <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'var(--color-cream-dark)', borderRadius: 'var(--radius-md)' }}>
              <BannerEditForm
                banner={{ id: 0, title: '', discount_text: '', description: '', image_url: null, link: '', is_active: true, sort_order: 0 }}
                onSave={handleSaveBanner}
                onCancel={() => setShowAddBanner(false)}
                onImageUpload={() => {}}
                isNew
                token={token}
              />
            </div>
          )}
        </section>

        {/* Menu Items */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Позиции меню</h2>
            <button
              onClick={() => { setShowAddItem(true); setEditingItem(null) }}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--color-secondary)',
                color: 'white',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 500,
              }}
            >
              + Позиция
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-soft)',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    background: 'var(--color-sand)',
                    flexShrink: 0,
                  }}
                >
                  {item.image_url ? (
                    <img src={getImageUrl(item.image_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>☕</div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingItem?.id === item.id ? (
                    <ItemEditForm
                      item={editingItem}
                      categories={categories}
                      onSave={(d) => handleSaveItem(d)}
                      onCancel={() => setEditingItem(null)}
                      onImageUpload={(file) => handleImageUpload(item.id, file)}
                    />
                  ) : (
                    <>
                      <div style={{ fontWeight: 500 }}>{item.name}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{item.price} ₽ · {categories.find((c) => c.id === item.category_id)?.name}</div>
                      <div style={{ marginTop: '0.5rem' }}>
                        <button onClick={() => setEditingItem(item)} style={{ fontSize: '0.85rem', marginRight: '0.5rem' }}>Редактировать</button>
                        <button onClick={() => handleDeleteItem(item.id)} style={{ fontSize: '0.85rem', color: 'var(--color-secondary)' }}>Удалить</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {showAddItem && (
            <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'var(--color-cream-dark)', borderRadius: 'var(--radius-md)' }}>
              <ItemEditForm
                item={{
                  id: 0,
                  name: '',
                  description: '',
                  price: 0,
                  image_url: null,
                  category_id: categories[0]?.id || 0,
                  is_available: true,
                }}
                categories={categories}
                onSave={(d) => handleSaveItem(d)}
                onCancel={() => setShowAddItem(false)}
                onImageUpload={(file) => {}}
                onImageUploadNew={token ? (file) => uploadFile(file, token).then((r) => r.url) : undefined}
                isNew
              />
            </div>
          )}
        </section>
      </div>
    </>
  )
}

function BannerEditForm({
  banner,
  onSave,
  onCancel,
  onImageUpload,
  isNew,
  token,
}: {
  banner: Banner
  onSave: (d: Partial<Banner>) => void
  onCancel: () => void
  onImageUpload: (file: File) => void
  isNew?: boolean
  token?: string
}) {
  const [title, setTitle] = useState(banner.title)
  const [discountText, setDiscountText] = useState(banner.discount_text || '')
  const [description, setDescription] = useState(banner.description || '')
  const [link, setLink] = useState(banner.link || '')
  const [imageUrl, setImageUrl] = useState(banner.image_url)

  const handleSave = () => {
    onSave({
      title,
      discount_text: discountText || null,
      description: description || null,
      link: link || null,
      image_url: imageUrl || null,
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (isNew && token) {
      try {
        const { url } = await uploadFile(f, token)
        setImageUrl(url)
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Ошибка загрузки')
      }
    } else if (!isNew) {
      onImageUpload(f)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <input placeholder="Заголовок (напр. Акция на роллы)" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: '0.5rem', width: '100%' }} />
      <input placeholder="Скидка (напр. 50%)" value={discountText} onChange={(e) => setDiscountText(e.target.value)} style={{ padding: '0.5rem', width: 150 }} />
      <input placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: '0.5rem', width: '100%' }} />
      <input placeholder="Ссылка (напр. /menu)" value={link} onChange={(e) => setLink(e.target.value)} style={{ padding: '0.5rem', width: '100%' }} />
      <div>
        <label style={{ fontSize: '0.9rem' }}>Фото: </label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <div>
        <button onClick={handleSave} style={{ padding: '0.5rem 1rem', background: 'var(--color-secondary)', color: 'white', borderRadius: 'var(--radius-sm)', marginRight: '0.5rem' }}>Сохранить</button>
        <button onClick={onCancel}>Отмена</button>
      </div>
    </div>
  )
}

function ItemEditForm({
  item,
  categories,
  onSave,
  onCancel,
  onImageUpload,
  onImageUploadNew,
  isNew,
}: {
  item: MenuItem
  categories: Category[]
  onSave: (d: Partial<MenuItem>) => void
  onCancel: () => void
  onImageUpload: (file: File) => void
  onImageUploadNew?: (file: File) => Promise<string>
  isNew?: boolean
}) {
  const [name, setName] = useState(item.name)
  const [description, setDescription] = useState(item.description || '')
  const [price, setPrice] = useState(item.price)
  const [categoryId, setCategoryId] = useState(item.category_id)
  const [imageUrl, setImageUrl] = useState(item.image_url)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (isNew && onImageUploadNew) {
      try {
        const url = await onImageUploadNew(f)
        setImageUrl(url)
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Ошибка загрузки')
      }
    } else if (!isNew) {
      onImageUpload(f)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <input
        placeholder="Название"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: '0.5rem', width: '100%' }}
      />
      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ padding: '0.5rem', width: '100%', minHeight: 60 }}
      />
      <input
        type="number"
        placeholder="Цена"
        value={price || ''}
        onChange={(e) => setPrice(Number(e.target.value))}
        style={{ padding: '0.5rem', width: 120 }}
      />
      <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} style={{ padding: '0.5rem', width: 200 }}>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <div>
        <label style={{ fontSize: '0.9rem' }}>Фото: </label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <div>
        <button
          onClick={() => onSave({ name, description: description || null, price, category_id: categoryId, image_url: imageUrl || undefined })}
          style={{ padding: '0.5rem 1rem', background: 'var(--color-secondary)', color: 'white', borderRadius: 'var(--radius-sm)', marginRight: '0.5rem' }}
        >
          Сохранить
        </button>
        <button onClick={onCancel}>Отмена</button>
      </div>
    </div>
  )
}
