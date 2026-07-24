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
      
      if (typeof res.data === 'string') throw new Error('HTML response')
      return res.data
    } catch (err: any) {
      // Fallback para la maqueta
      const mockProducts = [
        { id: '1', name: 'Hamburguesa Clásica', slug: 'hamburguesa-clasica', description: 'Jugosa hamburguesa con carne de res, lechuga, tomate, cebolla y nuestra salsa.', price: 18.9, discountPrice: 22.0, rating: 4.8, ratingCount: 124, prepTime: 15, category: { name: 'Hamburguesas', slug: 'hamburguesas' } },
        { id: '2', name: 'Salchipapas Especiales', slug: 'salchipapas-especiales', description: 'Papas fritas crujientes con salchichas premium y salsas secretas.', price: 14.5, rating: 4.6, ratingCount: 98, prepTime: 10, category: { name: 'Salchipapas', slug: 'salchipapas' } },
        { id: '3', name: 'Jugo de Fresa', slug: 'jugo-de-fresa', description: 'Refrescante jugo natural de fresas seleccionadas.', price: 8.5, rating: 4.9, ratingCount: 210, prepTime: 5, category: { name: 'Jugos Frescos', slug: 'jugos-frescos' } },
        { id: '4', name: 'Alitas Acevichadas', slug: 'alitas-acevichadas', description: 'Alitas de pollo al estilo ceviche, crujientes y jugosas.', price: 22.0, rating: 4.8, ratingCount: 156, prepTime: 25, category: { name: 'Alitas', slug: 'alitas' } },
        { id: '5', name: 'Almuerzo del Día', slug: 'almuerzo-del-dia', description: 'Lomo saltado, fetuccini y ensalada proteica.', price: 16.0, rating: 4.5, ratingCount: 88, prepTime: 20, category: { name: 'Almuerzos', slug: 'almuerzos' } },
        { id: '6', name: 'Sandwich de Chicharrón', slug: 'sandwich-de-chicharron', description: 'Chicharrón de cerdo con salsa criolla y camote.', price: 15.5, rating: 4.6, ratingCount: 103, prepTime: 12, category: { name: 'Sandwich', slug: 'sandwich' } },
      ];
      let filtered = mockProducts;
      if (params.category) filtered = filtered.filter(p => p.category.slug === params.category);
      if (params.search) filtered = filtered.filter(p => p.name.toLowerCase().includes(params.search!.toLowerCase()));
      return { products: filtered, totalPages: 1, page: 1 }
    }
  }
)

export const fetchFeaturedProducts = createAsyncThunk('products/fetchFeatured', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/products?featured=true&limit=6')
    if (typeof res.data === 'string') throw new Error('HTML response')
    return res.data.products
  } catch (err: any) {
    // Mock data para la presentación (maqueta)
    return [
      { id: '1', name: 'Hamburguesa Clásica', slug: 'hamburguesa-clasica', description: 'Jugosa hamburguesa con carne de res, lechuga, tomate, cebolla y nuestra salsa.', price: 18.9, discountPrice: 22.0, rating: 4.8, ratingCount: 124, prepTime: 15, category: { name: 'Hamburguesas', slug: 'hamburguesas' } },
      { id: '2', name: 'Salchipapas Especiales', slug: 'salchipapas-especiales', description: 'Papas fritas crujientes con salchichas premium y salsas secretas.', price: 14.5, rating: 4.6, ratingCount: 98, prepTime: 10, category: { name: 'Salchipapas', slug: 'salchipapas' } },
      { id: '3', name: 'Jugo de Fresa', slug: 'jugo-de-fresa', description: 'Refrescante jugo natural de fresas seleccionadas.', price: 8.5, rating: 4.9, ratingCount: 210, prepTime: 5, category: { name: 'Jugos Frescos', slug: 'jugos-frescos' } },
      { id: '4', name: 'Alitas Acevichadas', slug: 'alitas-acevichadas', description: 'Alitas de pollo al estilo ceviche, crujientes y jugosas.', price: 22.0, rating: 4.8, ratingCount: 156, prepTime: 25, category: { name: 'Alitas', slug: 'alitas' } },
      { id: '5', name: 'Almuerzo del Día', slug: 'almuerzo-del-dia', description: 'Lomo saltado, fetuccini y ensalada proteica.', price: 16.0, rating: 4.5, ratingCount: 88, prepTime: 20, category: { name: 'Almuerzos', slug: 'almuerzos' } },
      { id: '6', name: 'Sandwich de Chicharrón', slug: 'sandwich-de-chicharron', description: 'Chicharrón de cerdo con salsa criolla y camote.', price: 15.5, rating: 4.6, ratingCount: 103, prepTime: 12, category: { name: 'Sandwich', slug: 'sandwich' } },
    ]
  }
})

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/categories')
    if (typeof res.data === 'string') throw new Error('HTML response')
    return res.data
  } catch (err: any) {
    // Mock data para la presentación (maqueta)
    return [
      { id: 'c1', name: 'Hamburguesas', slug: 'hamburguesas', _count: { products: 12 } },
      { id: 'c2', name: 'Salchipapas', slug: 'salchipapas', _count: { products: 8 } },
      { id: 'c3', name: 'Jugos Frescos', slug: 'jugos-frescos', _count: { products: 15 } },
      { id: 'c4', name: 'Combos', slug: 'combos', _count: { products: 5 } },
      { id: 'c5', name: 'Alitas', slug: 'alitas', _count: { products: 9 } },
      { id: 'c6', name: 'Almuerzos', slug: 'almuerzos', _count: { products: 4 } },
      { id: 'c7', name: 'Ensaladas', slug: 'ensaladas', _count: { products: 6 } },
      { id: 'c8', name: 'Sandwich', slug: 'sandwich', _count: { products: 7 } }
    ]
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
