import { motion } from "framer-motion";
import { X, ShoppingCart } from "lucide-react";
import type { Product } from "../types";

interface Props {
    product: Product | null;
    onClose: () => void;
    onAddToCart: (p: Product) => void;
}

export default function ProductModal({ product, onClose, onAddToCart }: Props) {
    if (!product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            {/* Fondo oscuro */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                aria-hidden
            />
            <motion.div
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-3xl overflow-hidden max-h-[95vh] flex flex-col"
            >
                {/* Imagen arriba */}
                <div className="relative">
                    <img
                        src={product.imagen}
                        alt={product.nombre}
                        className="w-full h-72 object-cover object-bottom"
                    />
                    {/* Botón cerrar flotante */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-md"
                    >
                        <X size={20} className="text-gray-700" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-5">
                    {/* Nombre */}
                    <h2 className="text-2xl font-bold">{product.nombre}</h2>
                    <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                        {product.descripcionLarga}
                    </p>

                    {/* Precio */}
                    <div className="mt-6">
                        <h3 className="font-semibold text-lg mb-3">Precio</h3>
                        <div className="flex justify-between items-center bg-gray-50 rounded-xl p-3 shadow-sm">
                            <span className="text-sm font-medium">Precio único</span>
                            <span className="text-sm font-bold text-green-600">
                                ${product.precio.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Botón tipo Didi */}
                <div className="p-5">
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl shadow-lg"
                        onClick={() => {
                            onAddToCart(product);
                            onClose();
                        }}
                    >
                        <ShoppingCart size={18} />
                        Agregar al pedido
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}