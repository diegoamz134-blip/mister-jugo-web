import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface UiState {
  toasts: Toast[]
  cartDrawerOpen: boolean
  searchOpen: boolean
}

const initialState: UiState = {
  toasts: [],
  cartDrawerOpen: false,
  searchOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast(state, action: PayloadAction<Omit<Toast, 'id'>>) {
      const id = Date.now().toString()
      state.toasts.push({ ...action.payload, id })
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
    toggleCartDrawer(state) { state.cartDrawerOpen = !state.cartDrawerOpen },
    setSearchOpen(state, action: PayloadAction<boolean>) { state.searchOpen = action.payload },
  },
})

export const { addToast, removeToast, toggleCartDrawer, setSearchOpen } = uiSlice.actions
export default uiSlice.reducer
