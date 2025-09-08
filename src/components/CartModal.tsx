import { useState } from "react";
import { motion } from "framer-motion";
import { X, Trash2, Plus, Minus, MapPin, Utensils } from "lucide-react";
import Swal from "sweetalert2";
import type { CartItem } from "../App";
import { mesasDisponibles, type Mesa } from "../data/mesas"; // Importar desde el archivo mesas

interface Props {
    open: boolean;
    items: CartItem[];
    onClose: () => void;
    onRemove: (id: string) => void;
    onClear: () => void;
    onUpdateQuantity: (id: string, newQty: number) => void;
}

type ServiceType = "mesa" | "domicilio";

export default function CartModal({
    open,
    items,
    onClose,
    onRemove,
    onClear,
    onUpdateQuantity,
}: Props) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null);
    const [instructions, setInstructions] = useState("");
    const [payment, setPayment] = useState("Efectivo");
    const [tip, setTip] = useState(0);
    const [serviceType, setServiceType] = useState<ServiceType>("mesa");
    const [errors, setErrors] = useState({ name: false, location: false });

    if (!open) return null;

    const subtotal = items.reduce(
        (sum, item) => sum + item.product.precio * item.quantity,
        0
    );
    const deliveryFee = serviceType === "domicilio" ? 2000 : 0;
    const total = subtotal + deliveryFee + tip;

    const validateForm = () => {
        const newErrors = {
            name: !name.trim(),
            location: serviceType === "domicilio" ? !address.trim() : !selectedMesa
        };
        setErrors(newErrors);
        return !newErrors.name && !newErrors.location;
    };

    const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            Swal.fire({
                title: "Campos requeridos",
                text: serviceType === "domicilio"
                    ? "Por favor completa tu nombre y dirección para continuar"
                    : "Por favor completa tu nombre y selecciona una mesa para continuar",
                icon: "warning",
                confirmButtonColor: "#16a34a",
            });
            return;
        }

        const locationInfo = serviceType === "domicilio"
            ? `📍 Dirección: ${address}\n`
            : `🍽️ Mesa: ${selectedMesa?.nombre}\n`;

        const message = encodeURIComponent(
            `🛒 Nuevo pedido (${serviceType === "domicilio" ? "A domicilio" : "En el local"}):\n\n` +
            `${items.map((i) => `• ${i.product.nombre} x${i.quantity}`).join("\n")}\n\n` +
            `Subtotal: $${subtotal.toLocaleString()}\n` +
            (serviceType === "domicilio" ? `🚚 Domicilio: $${deliveryFee.toLocaleString()}\n` : "") +
            (tip > 0 ? `🙏 Propina: $${tip.toLocaleString()}\n` : "") +
            `TOTAL: $${total.toLocaleString()}\n\n` +
            `👤 Nombre: ${name}\n` +
            locationInfo +
            `📝 Instrucciones: ${instructions || "Ninguna"}\n` +
            `💳 Pago: ${payment}`
        );

        window.open(`https://wa.me/573028645014?text=${message}`, '_blank');
    };

    // Confirmar eliminación de un producto
    const confirmRemove = (id: string) => {
        Swal.fire({
            title: "¿Eliminar producto?",
            text: "Este producto se quitará del carrito.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#16a34a",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                onRemove(id);
                Swal.fire("Eliminado", "El producto fue quitado del carrito.", "success");
            }
        });
    };

    // Confirmar limpiar carrito
    const confirmClear = () => {
        Swal.fire({
            title: "¿Vaciar carrito?",
            text: "Se eliminarán todos los productos.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#16a34a",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, vaciar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                onClear();
                Swal.fire("Carrito vacío", "Se eliminaron todos los productos.", "success");
            }
        });
    };

    const handleServiceTypeChange = (type: ServiceType) => {
        setServiceType(type);
        // Limpiar errores al cambiar tipo de servicio
        setErrors({ name: false, location: false });
    };

    // const handleMesaSelection = (mesa: Mesa) => {
    //     if (mesa.disponible) {
    //         setSelectedMesa(mesa);
    //         if (errors.location) setErrors({ ...errors, location: false });
    //     }
    // };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            {/* Fondo oscuro */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 300 }}
                onDragEnd={(_, info) => {
                    if (info.offset.y > 100) onClose();
                }}
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl p-4 shadow-2xl max-h-[90vh] overflow-y-auto hide-scrollbar"
            >
                {/* Barra para arrastrar en móviles */}
                <div className="md:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3"></div>

                {/* Botón cerrar para desktop */}
                <button
                    onClick={onClose}
                    className="hidden md:block absolute right-5 top-5 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-5 text-gray-900">🛍️ Tu pedido</h2>

                {items.length === 0 ? (
                    <p className="text-gray-600 text-center">Tu carrito está vacío 🍽️</p>
                ) : (
                    <>
                        {/* Lista productos */}
                        <ul className="rounded-xl bg-gray-50">
                            {items.map((item) => (
                                <li
                                    key={item.product.id}
                                    className="flex justify-between items-center py-3 px-3"
                                >
                                    <div>
                                        <span className="font-medium text-gray-900">{item.product.nombre}</span>
                                        <span className="ml-1 text-sm text-gray-500">x{item.quantity}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Botones -/+ */}
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() =>
                                                    onUpdateQuantity(String(item.product.id), item.quantity - 1)
                                                }
                                                className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="px-2">{item.quantity}</span>
                                            <button
                                                onClick={() =>
                                                    onUpdateQuantity(String(item.product.id), item.quantity + 1)
                                                }
                                                className="p-1 bg-green-600 text-white rounded-full hover:bg-green-700"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        {/* Precio */}
                                        <span className="font-semibold text-green-600">
                                            ${(item.product.precio * item.quantity).toLocaleString()}
                                        </span>

                                        {/* Eliminar */}
                                        <button
                                            onClick={() => confirmRemove(String(item.product.id))}
                                            className="text-red-500 hover:text-red-700 ml-3"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Totales */}
                        <div className="mt-5 space-y-2 font-semibold bg-gray-50 rounded-xl p-4 shadow-inner">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span>${subtotal.toLocaleString()}</span>
                            </div>
                            {serviceType === "domicilio" && (
                                <div className="flex justify-between text-red-500">
                                    <span>+ Domicilio</span>
                                    <span>${deliveryFee.toLocaleString()}</span>
                                </div>
                            )}
                            {tip > 0 && (
                                <div className="flex justify-between text-gray-600">
                                    <span>+ Propina</span>
                                    <span>${tip.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg text-gray-900">
                                <span>Total</span>
                                <span>${total.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Tipo de servicio */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                📍 Tipo de servicio
                            </label>
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => handleServiceTypeChange("mesa")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition ${serviceType === "mesa"
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    <Utensils size={16} />
                                    En el local
                                </button>
                                <button
                                    onClick={() => handleServiceTypeChange("domicilio")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition ${serviceType === "domicilio"
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    <MapPin size={16} />
                                    A domicilio
                                </button>
                            </div>
                        </div>

                        {serviceType === "mesa" ? (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    🍽️ Selecciona tu mesa
                                </label>
                                <select
                                    value={selectedMesa?.id || ""}
                                    onChange={(e) => {
                                        const mesa = mesasDisponibles.find(m => m.id === e.target.value);
                                        if (mesa && mesa.disponible) {
                                            setSelectedMesa(mesa);
                                            if (errors.location) setErrors({ ...errors, location: false });
                                        }
                                    }}
                                    className={`w-full border ${errors.location ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none`}
                                >
                                    <option value="">Selecciona una mesa</option>
                                    {mesasDisponibles.map((mesa) => (
                                        <option key={mesa.id} value={mesa.id} disabled={!mesa.disponible}>
                                            {mesa.nombre} {mesa.disponible ? "" : "✗"}
                                        </option>
                                    ))}
                                </select>
                                {errors.location && <p className="text-red-500 text-xs mt-2">Debes seleccionar una mesa</p>}
                                {selectedMesa && (
                                    <p className="text-green-600 text-sm mt-2">
                                        Mesa seleccionada: <strong>{selectedMesa.nombre}</strong>
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    📍 Dirección de entrega
                                </label>
                                <input
                                    type="text"
                                    placeholder="Tu dirección *"
                                    value={address}
                                    onChange={(e) => {
                                        setAddress(e.target.value);
                                        if (errors.location) setErrors({ ...errors, location: false });
                                    }}
                                    className={`w-full border ${errors.location ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none`}
                                />
                                {errors.location && <p className="text-red-500 text-xs mt-1">La dirección es requerida</p>}
                            </div>
                        )}

                        {/* Propina */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                🙏 Agregar propina
                            </label>
                            <div className="flex gap-2 mb-2">
                                {[1000, 2000, 5000].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setTip(val)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${tip === val
                                            ? "bg-green-600 text-white border-green-600"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        +${val.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="number"
                                min={0}
                                placeholder="Otra cantidad"
                                value={tip || ""}
                                onChange={(e) => setTip(Number(e.target.value) || 0)}
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>

                        {/* Formulario */}
                        <div className="mt-6 space-y-3">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Tu nombre *"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (errors.name) setErrors({ ...errors, name: false });
                                    }}
                                    className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none`}
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">El nombre es requerido</p>}
                            </div>

                            <textarea
                                placeholder="Instrucciones (ej: casa verde, segundo piso...)"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                            />
                            <select
                                value={payment}
                                onChange={(e) => setPayment(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
                            >
                                <option>Efectivo</option>
                                <option>Tarjeta</option>
                                <option>Nequi</option>
                                <option>Daviplata</option>
                                <option>Llave</option>
                            </select>
                        </div>

                        {/* Botones */}
                        <div className="mt-6 flex flex-col gap-3">
                            <a
                                href="#"
                                onClick={handleWhatsAppClick}
                                className="block bg-green-600 hover:bg-green-700 transition text-white text-center py-3 rounded-xl font-semibold shadow-lg"
                            >
                                {serviceType === "domicilio" ? "Pedir a domicilio" : "Pedir en local"}
                            </a>
                            <button
                                onClick={confirmClear}
                                className="block bg-gray-200 hover:bg-gray-300 transition text-gray-700 text-center py-3 rounded-xl font-semibold"
                            >
                                Vaciar carrito
                            </button>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}