import { useState } from "react";
import { motion } from "framer-motion";
import { X, Trash2, Plus, Minus, MapPin, Utensils, ShoppingBag } from "lucide-react";
import Swal from "sweetalert2";
import type { CartItem } from "../App";
import { mesasDisponibles, type Mesa } from "../data/mesas";

interface Props {
    open: boolean;
    items: CartItem[];
    onClose: () => void;
    onRemove: (id: string) => void;
    onClear: () => void;
    onUpdateQuantity: (id: string, newQty: number) => void;
}

type ServiceType = "mesa" | "domicilio" | "paraLlevar";

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
    const [cashAmount, setCashAmount] = useState("");
    const [tip, setTip] = useState(0);
    const [serviceType, setServiceType] = useState<ServiceType>("mesa");
    const [errors, setErrors] = useState({
        name: false,
        location: false,
        cash: false
    });

    if (!open) return null;

    const subtotal = items.reduce(
        (sum, item) => sum + item.product.precio * item.quantity,
        0
    );

    const getDeliveryFee = () => {
        if (serviceType !== "domicilio") return 0;

        const isFar = address.toLowerCase().includes("lejos") ||
            address.toLowerCase().includes("lejano") ||
            address.length > 40;

        return isFar ? 5000 : 3000;
    };

    const deliveryFee = getDeliveryFee();
    const total = subtotal + deliveryFee + tip;

    const calculateChange = () => {
        if (payment !== "Efectivo" || !cashAmount) return 0;
        const cash = parseInt(cashAmount.replace(/\D/g, '')) || 0;
        return cash - total;
    };

    const change = calculateChange();

    const validateForm = () => {
        const newErrors = {
            name: !name.trim(),
            location: serviceType === "domicilio" ? !address.trim() :
                serviceType === "mesa" ? !selectedMesa : false,
            cash: payment === "Efectivo" && (!cashAmount || change < 0)
        };
        setErrors(newErrors);
        return !newErrors.name && !newErrors.location && !newErrors.cash;
    };

    const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            let errorMessage = "Por favor completa los siguientes campos:";
            if (!name.trim()) errorMessage += "\n• Tu nombre";
            if (serviceType === "domicilio" && !address.trim()) errorMessage += "\n• Dirección de entrega";
            if (serviceType === "mesa" && !selectedMesa) errorMessage += "\n• Selecciona una mesa";
            if (payment === "Efectivo" && (!cashAmount || change < 0)) {
                errorMessage += "\n• Monto en efectivo suficiente para cubrir el total";
            }

            Swal.fire({
                title: "Campos requeridos",
                text: errorMessage,
                icon: "warning",
                confirmButtonColor: "#16a34a",
            });
            return;
        }

        const locationInfo = serviceType === "domicilio"
            ? `📍 Dirección: ${address}\n`
            : serviceType === "mesa"
                ? `🍽️ Mesa: ${selectedMesa?.nombre}\n`
                : `📦 Tipo: Para llevar\n`;

        const deliveryInfo = serviceType === "domicilio"
            ? `🚚 Domicilio: $${deliveryFee.toLocaleString()} (${deliveryFee === 3000 ? "Zona cercana" : "Zona lejana"})\n`
            : "";

        const paymentInfo = payment === "Efectivo"
            ? `💵 Paga con: $${parseInt(cashAmount.replace(/\D/g, '')).toLocaleString()}\n` +
            `🪙 Cambio: $${change.toLocaleString()}\n`
            : `💳 Pago: ${payment}\n`;

        const message = encodeURIComponent(
            `🛒 Nuevo pedido (${serviceType === "domicilio" ? "A domicilio" : serviceType === "mesa" ? "En el local" : "Para llevar"}):\n\n` +
            `${items.map((i) => `• ${i.product.nombre} x${i.quantity}`).join("\n")}\n\n` +
            `Subtotal: $${subtotal.toLocaleString()}\n` +
            deliveryInfo +
            (tip > 0 ? `🙏 Propina: $${tip.toLocaleString()}\n` : "") +
            `TOTAL: $${total.toLocaleString()}\n\n` +
            `👤 Nombre: ${name}\n` +
            locationInfo +
            `📝 Instrucciones especiales: ${instructions || "Ninguna"}\n` +
            paymentInfo
        );

        window.open(`https://wa.me/573028645014?text=${message}`, '_blank');
    };

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

    // FUNCIÓN confirmClear AÑADIDA AQUÍ
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
        setErrors({ ...errors, location: false });
    };

    const formatCashInput = (value: string) => {
        const numericValue = value.replace(/[^\d,.]/g, '');
        if (!numericValue) return '';
        const number = parseInt(numericValue.replace(/\D/g, ''));
        if (isNaN(number)) return '';
        return number.toLocaleString();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 300 }}
                onDragEnd={(_, info) => {
                    if (info.offset.y > 100) onClose();
                }}
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col"
                style={{
                    height: 'min(90vh, 700px)',
                    minHeight: '60vh'
                }}
            >
                <div className="flex-shrink-0 p-4 border-b border-gray-100">
                    <div className="md:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3"></div>
                    <button
                        onClick={onClose}
                        className="hidden md:block absolute right-5 top-5 text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">🛍️ Tu pedido</h2>
                </div>

                {items.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-600 text-center">Tu carrito está vacío 🍽️</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto px-4 py-2">
                            <ul className="rounded-xl bg-gray-50 mb-4">
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
                                            <span className="font-semibold text-green-600">
                                                ${(item.product.precio * item.quantity).toLocaleString()}
                                            </span>
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

                            <div className="space-y-2 font-semibold bg-gray-50 rounded-xl p-4 shadow-inner mb-4">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toLocaleString()}</span>
                                </div>
                                {serviceType === "domicilio" && (
                                    <div className="flex justify-between text-red-500">
                                        <span>+ Domicilio ({deliveryFee === 3000 ? "Cerca" : "Lejos"})</span>
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

                                {payment === "Efectivo" && cashAmount && (
                                    <div className={`flex justify-between text-sm pt-2 border-t ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        <span>Cambio:</span>
                                        <span>${change.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    📍 Tipo de servicio
                                </label>
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <button
                                        onClick={() => handleServiceTypeChange("mesa")}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition ${serviceType === "mesa"
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        <Utensils size={16} />
                                        En local
                                    </button>
                                    <button
                                        onClick={() => handleServiceTypeChange("domicilio")}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition ${serviceType === "domicilio"
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        <MapPin size={16} />
                                        Domicilio
                                    </button>
                                    <button
                                        onClick={() => handleServiceTypeChange("paraLlevar")}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition ${serviceType === "paraLlevar"
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        <ShoppingBag size={16} />
                                        Para llevar
                                    </button>
                                </div>
                            </div>

                            {serviceType === "mesa" ? (
                                <div className="mb-4">
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
                            ) : serviceType === "domicilio" ? (
                                <div className="mb-4">
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
                                    {address && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Costo de envío: ${deliveryFee.toLocaleString()}
                                            ({deliveryFee === 3000 ? "Zona cercana" : "Zona lejana"})
                                        </p>
                                    )}
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    🙏 Agregar propina (opcional)
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <button
                                        onClick={() => setTip(0)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${tip === 0
                                            ? "bg-green-600 text-white border-green-600"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        Sin propina
                                    </button>
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

                            <div className="space-y-3 mb-6">
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

                                <div>
                                    <textarea
                                        placeholder="Instrucciones especiales: (ej: hamburguesa sin cebolla, con mostaza, etc.)"
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        rows={3}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Especifica aquí cualquier modificación o instrucción especial para tu pedido
                                    </p>
                                </div>

                                <select
                                    value={payment}
                                    onChange={(e) => {
                                        setPayment(e.target.value);
                                        if (e.target.value !== "Efectivo") {
                                            setCashAmount("");
                                            setErrors({ ...errors, cash: false });
                                        }
                                    }}
                                    className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
                                >
                                    <option>Efectivo</option>
                                    <option>Tarjeta</option>
                                    <option>Nequi</option>
                                    <option>Daviplata</option>
                                    <option>Llave</option>
                                </select>

                                {payment === "Efectivo" && (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="¿Con cuánto pagas? *"
                                            value={cashAmount}
                                            onChange={(e) => {
                                                const formatted = formatCashInput(e.target.value);
                                                setCashAmount(formatted);
                                                if (errors.cash) setErrors({ ...errors, cash: false });
                                            }}
                                            className={`w-full border ${errors.cash ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none`}
                                        />
                                        {errors.cash && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {!cashAmount ? "Debes indicar con cuánto pagas" : "El monto no cubre el total"}
                                            </p>
                                        )}
                                        {cashAmount && change >= 0 && (
                                            <p className="text-green-600 text-sm mt-1">
                                                Cambio: ${change.toLocaleString()}
                                            </p>
                                        )}
                                        {cashAmount && change < 0 && (
                                            <p className="text-red-500 text-sm mt-1">
                                                Faltan: ${(-change).toLocaleString()} para completar el pago
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-shrink-0 p-4 bg-white border-t border-gray-100">
                            <div className="flex flex-col gap-3">
                                <a
                                    href="#"
                                    onClick={handleWhatsAppClick}
                                    className="block bg-green-600 hover:bg-green-700 transition text-white text-center py-3 rounded-xl font-semibold shadow-lg"
                                >
                                    {serviceType === "domicilio"
                                        ? "Pedir a domicilio"
                                        : serviceType === "mesa"
                                            ? "Pedir en local"
                                            : "Pedir para llevar"}
                                </a>
                                <button
                                    onClick={confirmClear}
                                    className="block bg-gray-200 hover:bg-gray-300 transition text-gray-700 text-center py-3 rounded-xl font-semibold"
                                >
                                    Vaciar carrito
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}