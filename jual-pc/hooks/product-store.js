import { create } from 'zustand';

export const useProductStore = create((set) => ({
  products: [],

  addProduct: (product) => set((state) => ({
    products: [...state.products, {
      id: Date.now().toString(),
      ...product,
      purchased: false,
    }]
  })),

  removeProduct: (id) => set((state) => ({
    products: state.products.filter((product) => product.id !== id)
  })),

  togglePurchased: (id) => set((state) => ({
    products: state.products.map((product) =>
      product.id === id ? { ...product, purchased: !product.purchased } : product
    )
  })),

  updateProduct: (id, updatedInfo) => set((state) => ({
    products: state.products.map((product) =>
      product.id === id ? { ...product, ...updatedInfo } : product
    )
  })),

  setProducts: (products) => set({ products }),
}));