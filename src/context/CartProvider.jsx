import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { PRODUCTS } from '../data/products'
import { CartContext } from './cart-context'

const STORAGE_KEY = 'botanique.cart.v1'
const MAX_QTY = 99
const clamp = (n) => Math.min(MAX_QTY, Math.max(0, n))

// Keranjang disimpan sebagai { [idProduk]: jumlah } supaya harga selalu mengikuti data produk terbaru
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const clean = {}
    for (const p of PRODUCTS) {
      const q = Math.floor(Number(raw[p.id]))
      if (q > 0) clean[p.id] = clamp(q)
    }
    return clean
  } catch {
    return {}
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'change': {
      const next = { ...state }
      const qty = clamp((state[action.id] || 0) + action.delta)
      if (qty === 0) delete next[action.id]
      else next[action.id] = qty
      return next
    }
    case 'remove': {
      const next = { ...state }
      delete next[action.id]
      return next
    }
    case 'clear':
      return {}
    default:
      return state
  }
}

export default function CartProvider({ children }) {
  const [qty, dispatch] = useReducer(reducer, undefined, load)
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(qty))
    } catch {
      /* penyimpanan tidak tersedia (mis. mode privat): keranjang tetap jalan di memori */
    }
  }, [qty])

  const change = useCallback((id, delta) => dispatch({ type: 'change', id, delta }), [])
  const remove = useCallback((id) => dispatch({ type: 'remove', id }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])
  const openCart = useCallback(() => setOpen(true), [])
  const closeCart = useCallback(() => setOpen(false), [])

  const value = useMemo(() => {
    const lines = PRODUCTS.filter((p) => qty[p.id] > 0).map((p) => ({ product: p, qty: qty[p.id] }))
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((sum, l) => sum + l.product.price * l.qty, 0),
      qtyOf: (id) => qty[id] || 0,
      change,
      remove,
      clear,
      isOpen,
      openCart,
      closeCart,
    }
  }, [qty, isOpen, change, remove, clear, openCart, closeCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
