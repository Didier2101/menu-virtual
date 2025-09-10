import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import type { Product } from "../types";

interface Props {
    product: Product;
    onClick: (p: Product) => void;      // para abrir el modal
    onAddToCart: (p: Product) => void;  // para agregar al carrito
}

export default function ProductCard({ product, onClick, onAddToCart }: Props) {
    const [showToast, setShowToast] = useState(false);

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onAddToCart(product);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 1500); // desaparece en 1.5s
    };

    return (
        <>
            <motion.div
                onClick={() => onClick(product)}
                whileHover={{ y: -4 }}
                className="w-full bg-white rounded-2xl shadow-md overflow-hidden flex h-30 hover:shadow-lg transition-all relative"
            >
                {/* Imagen */}
                <div className="w-32 h-30 flex-shrink-0">
                    <img
                        src={product.imagen}
                        alt={product.nombre}
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Contenido */}
                <div className="flex-1 flex flex-col justify-between p-3">
                    <div className="cursor-pointer flex-1">
                        <h3 className="text-base font-bold text-gray-800">
                            {product.nombre}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                            {product.descripcionCorta}
                        </p>
                    </div>

                    {/* Precio y botón */}
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-500">
                            ${product.precio.toLocaleString()}
                        </span>

                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full bg-green-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                            aria-label="Agregar al carrito"
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart size={16} />
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Toast animado */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-xl shadow-lg z-50 text-center min-w-[320px] max-w-[90%]"
                    >
                        {product.nombre} agregado al carrito
                    </motion.div>
                )}
            </AnimatePresence>


        </>
    );
}
