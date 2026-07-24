import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'
import type { Cart } from '../types'

interface CartState {
  cart: Cart | null
  loading: boolean
  error: string | null
  isOpen: boolean
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  isOpen: false,
}

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/cart')
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Error al obtener carrito')
  }
})

export const addToCart = createAsyncThunk(
  'cart/add',
  async (data: { productId: string; quantity?: number; options?: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/cart/add', data)
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Error al agregar al carrito')
    }
  }
)

export const removeCartItem = createAsyncThunk('cart/removeItem', async (itemId: string, { rejectWithValue }) => {
  try {
    await api.delete(`/cart/item/${itemId}`)
    return itemId
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Error al eliminar')
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCart(state) { state.isOpen = !state.isOpen },
    openCart(state) { state.isOpen = true },
    closeCart(state) { state.isOpen = false },
    clearCart(state) {
      if (state.cart) state.cart.items = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true })
      .addCase(fetchCart.fulfilled, (state, action) => { state.loading = false; state.cart = action.payload })
      .addCase(fetchCart.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })
      .addCase(addToCart.fulfilled, (state, action) => { state.cart = action.payload })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        if (state.cart) {
          state.cart.items = state.cart.items.filter((i) => i.id !== action.payload)
        }
      })
  },
})

export const { toggleCart, openCart, closeCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
