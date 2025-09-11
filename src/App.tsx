import { useState, useEffect } from "react";
import { products as productsData, categories } from "./data/productos";
import Tabs from "./components/Tabs";
import ProductGrid from "./components/ProductGrid";
import ProductModal from "./components/ProductModal";
import Header from "./components/Header";
import CartButton from "./components/CartButton";
import CartModal from "./components/CartModal";
import SearchBar from "./components/SearchBar";

import type { Product } from "./types";

export interface CartItem {
  product: Product;
  quantity: number;
}

// Clave para localStorage
const CART_STORAGE_KEY = "jullymar_cart";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ carrito en localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Recuperar carrito del localStorage al inicializar
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);

  // ✅ Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  // ✅ Filtrar productos por categoría Y búsqueda
  const filtered = productsData.filter((product) => {
    const matchesCategory =
      selectedCategory === "Todos" || product.categoria === selectedCategory;

    const matchesSearch =
      searchTerm === "" ||
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // ✅ Agregar producto al carrito
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      let newCart;

      if (exists) {
        newCart = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prev, { product, quantity: 1 }];
      }

      return newCart;
    });
  };

  // ✅ Quitar producto individual
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => String(item.product.id) !== id));
  };

  // ✅ Limpiar carrito completo
  const clearCart = () => {
    setCart([]);
  };

  // ✅ Actualizar cantidad (para botones + y - en CartModal)
  const updateQuantity = (id: string, newQty: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          String(item.product.id) === id
            ? { ...item, quantity: newQty }
            : item
        )
        .filter((item) => item.quantity > 0) // si queda en 0, se elimina
    );
  };

  // ✅ Limpiar búsqueda cuando se cambia de categoría
  useEffect(() => {
    setSearchTerm("");
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
      {/* Metatag para prevenir zoom en móviles */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

      {/* Header */}
      <Header title="Demo" subtitle="Menú Virtual • Sistema de Pedidos" />

      {/* Main */}
      <main className="max-w-xl mx-auto pt-20">
        <Tabs categories={categories} onSelect={setSelectedCategory} />

        {/* Barra de búsqueda */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <ProductGrid
          products={filtered}
          onSelect={setSelectedProduct}
          onAddToCart={addToCart}
        />
      </main>

      {/* Modal de producto */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />

      {/* Botón carrito flotante */}
      <CartButton
        count={cart.reduce((sum, i) => sum + i.quantity, 0)}
        onClick={() => setCartOpen(true)}
      />

      {/* Modal carrito */}
      <CartModal
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onClear={clearCart}
        onUpdateQuantity={updateQuantity}
      />

      {/* Pie de página */}
      <footer className="py-4 text-center text-xs text-gray-500 mt-0">
        <p className="flex items-center justify-center gap-1">
          <span>©</span>
          {new Date().getFullYear()} Derechos reservados Didier Chavez - Desarrollador Tel: 3028645014
        </p>
      </footer>
    </div>
  );
}