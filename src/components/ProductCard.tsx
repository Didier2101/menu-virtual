import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import type { Product } from "../types";

interface Props {
    product: Product;
    onClick: (p: Product) => void;      // para abrir el modal
    onAddToCart: (p: Product) => void;  // para agregar al carrito
}

export default function ProductCard({ product, onClick, onAddToCart }: Props) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="w-full bg-white rounded-2xl shadow-md overflow-hidden flex h-28 hover:shadow-lg transition-all"
        >
            {/* Imagen - Ocupa todo el alto */}
            <div className="w-32 h-28 flex-shrink-0">
                <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="w-full h-full object-cover object-bottom"
                />
            </div>

            {/* Contenido */}
            <div className="flex-1 flex flex-col justify-between p-3">
                {/* Información del producto */}
                <div
                    onClick={() => onClick(product)}
                    className="cursor-pointer flex-1"
                >
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
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                    >
                        <ShoppingCart size={16} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}