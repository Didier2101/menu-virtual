import { useState, useEffect } from "react";
import { products as productsData } from "./data/productos";
import Tabs from "./components/Tabs";
import ProductGrid from "./components/ProductGrid";
import ProductModal from "./components/ProductModal";
import Header from "./components/Header";
import CartButton from "./components/CartButton";
import CartModal from "./components/CartModal";
import SearchBar from "./components/SearchBar"; // Nuevo componente

import type { Product } from "./types";

export interface CartItem {
  product: Product;
  quantity: number;
}

const categories = [
  "Todos",
  "Perros Calientes",
  "Hamburguesas",
  "Salchipapas",
  "Bebidas",
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // Nuevo estado para búsqueda

  // ✅ carrito persistente con localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [cartOpen, setCartOpen] = useState(false);

  // ✅ Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
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
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header title="Rápido & Rico" subtitle="Menú - Escanea el QR" />

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
    </div>
  );
}