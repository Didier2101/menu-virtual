import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, ZoomIn, Info } from "lucide-react";
import type { Product } from "../types";
import { useState } from "react";

interface Props {
    product: Product | null;
    onClose: () => void;
    onAddToCart: (p: Product) => void;
}

export default function ProductModal({ product, onClose, onAddToCart }: Props) {
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);

    if (!product) return null;

    const openImageViewer = () => setIsImageViewerOpen(true);
    const closeImageViewer = () => setIsImageViewerOpen(false);

    const handleAddToCart = () => {
        onAddToCart(product);
        setShowToast(true);

        // Después de 1.5 segundos, se oculta el toast y cierra el modal
        setTimeout(() => {
            setShowToast(false);
            onClose();
        }, 1500);
    };

    return (
        <>
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
                    {/* Imagen */}
                    <div className="relative">
                        <div className="relative group cursor-pointer" onClick={openImageViewer}>
                            <img
                                src={product.imagen}
                                alt={product.nombre}
                                className="w-full h-72 object-cover object-center"
                            />
                            {/* Overlay indicador de clic */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </div>

                        {/* Botón cerrar */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-md"
                        >
                            <X size={20} className="text-gray-700" />
                        </button>
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 overflow-y-auto p-5">
                        <h2 className="text-2xl font-bold">{product.nombre}</h2>

                        <div className="mt-2 flex items-start gap-2 bg-blue-50 text-blue-700 p-3 rounded-lg text-xs">
                            <Info size={14} className="mt-0.5 flex-shrink-0" />
                            <span>Nota: La presentación final del producto puede variar ligeramente de la imagen mostrada.</span>
                        </div>

                        <p className="text-gray-600 text-sm mt-3 leading-relaxed">
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

                    {/* Botón Agregar al carrito */}
                    <div className="p-5">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl shadow-lg"
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart size={18} />
                            Agregar al pedido
                        </motion.button>
                    </div>
                </motion.div>
            </div>

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



            {/* Visor de imagen completo */}
            <AnimatePresence>
                {isImageViewerOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-blue-400/10 backdrop-blur-sm p-4"
                        onClick={closeImageViewer}
                    >
                        <button
                            onClick={closeImageViewer}
                            className="absolute top-6 right-6 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg z-10 transition-all duration-300"
                        >
                            <X size={24} className="text-gray-700" />
                        </button>

                        <div className="max-w-4xl max-h-full flex items-center justify-center">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                className="rounded-xl overflow-hidden shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img
                                    src={product.imagen}
                                    alt={product.nombre}
                                    className="w-full h-full object-contain max-h-[70vh] rounded-lg"
                                />
                            </motion.div>
                        </div>

                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-xs">
                            La presentación final puede variar
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
