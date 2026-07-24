import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'
import type { Product, Category } from '../types'

interface ProductState {
  products: Product[]
  categories: Category[]
  featuredProducts: Product[]
  selectedProduct: Product | null
  loading: boolean
  error: string | null
  totalPages: number
  currentPage: number
}

const initialState: ProductState = {
  products: [],
  categories: [],
  featuredProducts: [],
  selectedProduct: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
}

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params: { category?: string; search?: string; page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams()
      if (params.category) query.set('category', params.category)
      if (params.search) query.set('search', params.search)
      if (params.page) query.set('page', String(params.page))
      if (params.limit) query.set('limit', String(params.limit))
      const res = await api.get(`/products?${query}`)
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Error al cargar productos')
    }
  }
)

export const fetchFeaturedProducts = createAsyncThunk('products/fetchFeatured', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/products?featured=true&limit=6')
    return res.data.products
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Error al cargar destacados')
  }
})

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/categories')
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Error al cargar categorías')
  }
})

export const fetchProductBySlug = createAsyncThunk('products/fetchBySlug', async (slug: string, { rejectWithValue }) => {
  try {
    const res = await api.get(`/products/${slug}`)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Error al cargar producto')
  }
})

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.page
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => { state.featuredProducts = action.payload })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload })
      .addCase(fetchProductBySlug.pending, (state) => { state.loading = true })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => { state.loading = false; state.selectedProduct = action.payload })
      .addCase(fetchProductBySlug.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })
  },
})

export default productSlice.reducer
