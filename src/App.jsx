import { useMemo, useState } from 'react'
import { products } from './data'

const categories = ['All', ...new Set(products.map((product) => product.category))]

const formatPrice = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, search])

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id)

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [...currentCart, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId, delta) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = cart.length > 0 ? 12 : 0
  const total = subtotal + shipping

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">P</div>
          <div>
            <p className="eyebrow">Curated wall art</p>
            <h1>Poster Store</h1>
          </div>
        </div>

        <nav className="nav">
          <a href="#shop">Shop</a>
          <a href="#new">New Arrivals</a>
          <a href="#featured">Featured</a>
        </nav>

        <button className="cart-pill" type="button">
          Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow warm">Fresh visual stories</p>
            <h2>Bring personality to every wall.</h2>
            <p>
              Discover gallery-inspired posters designed to transform your space with
              color, texture, and modern energy.
            </p>
            <div className="hero-actions">
              <a href="#shop" className="primary-btn">
                Shop Posters
              </a>
              <button type="button" className="secondary-btn">
                Explore Collections
              </button>
            </div>
            <div className="metrics">
              <div>
                <strong>2.4k+</strong>
                <span>Happy buyers</span>
              </div>
              <div>
                <strong>4.9/5</strong>
                <span>Average rating</span>
              </div>
              <div>
                <strong>48h</strong>
                <span>Dispatch time</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Featured poster collection">
            <div className="poster-card large">
              <img
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80"
                alt="Featured poster mockup"
              />
            </div>
            <div className="poster-card small top">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                alt="Poster sample"
              />
            </div>
            <div className="poster-card small bottom">
              <img
                src="https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=1200&q=80"
                alt="Poster sample"
              />
            </div>
          </div>
        </section>

        <section id="shop" className="catalog">
          <div className="catalog-header">
            <div>
              <p className="eyebrow">Shop collection</p>
              <h3>Find your next statement piece</h3>
            </div>

            <div className="catalog-tools">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search posters"
                aria-label="Search posters"
              />
            </div>
          </div>

          <div className="filter-row">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={selectedCategory === category ? 'filter active' : 'filter'}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} />
                  <span className="badge">{product.category}</span>
                </div>

                <div className="product-info">
                  <div className="product-topline">
                    <h4>{product.name}</h4>
                    <span>{formatPrice(product.price)}</span>
                  </div>
                  <p>{product.description}</p>
                  <button type="button" onClick={() => addToCart(product)}>
                    Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="cart-panel" aria-label="Shopping cart summary">
          <div className="cart-header">
            <p className="eyebrow">Your cart</p>
            <h3>Order summary</h3>
          </div>

          {cart.length === 0 ? (
            <div className="empty-state">
              <p>Your cart is empty.</p>
              <span>Add a few posters to get started.</span>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="mini-thumb">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="mini-copy">
                    <strong>{item.name}</strong>
                    <span>{formatPrice(item.price)}</span>
                  </div>
                  <div className="quantity-controls">
                    <button type="button" onClick={() => updateQuantity(item.id, -1)}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, 1)}>
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="totals">
            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong>{formatPrice(shipping)}</strong>
            </div>
            <div className="grand-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>

          <button type="button" className="checkout-btn">
            Proceed to checkout
          </button>
        </aside>
      </main>
    </div>
  )
}
