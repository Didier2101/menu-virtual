import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import type { CartItem } from "../App";
import { mesasDisponibles, type Mesa } from "../data/mesas";

// Componentes refactorizados
import CartItemList from "./carrito/CartItemList";
import ServiceTypeSelector from "./carrito/ServiceTypeSelector";
import MesaSelector from "./carrito/MesaSelector";
import AddressForm from "./carrito/AddressForm";
import TipSelector from "./carrito/TipSelector";
import CustomerInfo from "./carrito/CustomerInfo";
import PaymentSection from "./carrito/PaymentSection";
import CartActions from "./carrito/CartActions";
import CartSummary from "./carrito/CartSummary";

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
        cash: false,
    });
    const [selectedLocation, setSelectedLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    if (!open) return null;

    const subtotal = items.reduce(
        (sum, item) => sum + item.product.precio * item.quantity,
        0
    );
    const deliveryFee = serviceType === "domicilio" ? 3000 : 0;
    const total = subtotal + deliveryFee + tip;

    const calculateChange = () => {
        if (payment !== "Efectivo" || !cashAmount) return 0;
        const cash = parseInt(cashAmount.replace(/\D/g, "")) || 0;
        return cash - total;
    };
    const change = calculateChange();

    const formatCashInput = (value: string) => {
        const numericValue = value.replace(/[^\d,.]/g, "");
        if (!numericValue) return "";
        const number = parseInt(numericValue.replace(/\D/g, ""));
        if (isNaN(number)) return "";
        return number.toLocaleString();
    };

    const resetForm = () => {
        setName("");
        setAddress("");
        setSelectedMesa(null);
        setInstructions("");
        setPayment("Efectivo");
        setCashAmount("");
        setTip(0);
        setServiceType("mesa");
        setErrors({ name: false, location: false, cash: false });
        setSelectedLocation(null);
    };

    const validateForm = () => {
        const newErrors = {
            name: !name.trim(),
            location:
                serviceType === "domicilio"
                    ? !address.trim()
                    : serviceType === "mesa"
                        ? !selectedMesa
                        : false,
            cash: payment === "Efectivo" && (!cashAmount || change < 0),
        };
        setErrors(newErrors);
        return !newErrors.name && !newErrors.location && !newErrors.cash;
    };

    const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (!validateForm()) {
            Swal.fire({
                title: "Campos requeridos",
                text: "Por favor completa los campos obligatorios",
                icon: "warning",
                confirmButtonColor: "#16a34a",
            });
            return;
        }

        const locationInfo =
            serviceType === "domicilio"
                ? `📍 Dirección: ${address}\n${selectedLocation
                    ? `🗺️ Ubicación: https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}\n`
                    : ""
                }`
                : serviceType === "mesa"
                    ? `🍽️ Mesa: ${selectedMesa?.nombre}\n`
                    : "📦 Tipo: Para llevar\n";

        const deliveryInfo =
            serviceType === "domicilio"
                ? `🚚 Domicilio: $${deliveryFee.toLocaleString()}\n`
                : "";

        const paymentInfo =
            payment === "Efectivo"
                ? `💵 Paga con: $${parseInt(
                    cashAmount.replace(/\D/g, "")
                ).toLocaleString()}\n🪙 Cambio: $${change.toLocaleString()}\n`
                : `💳 Pago: ${payment}\n`;

        const message = encodeURIComponent(
            `🛒 Nuevo pedido (${serviceType}):\n\n${items
                .map((i) => `• ${i.product.nombre} x${i.quantity}`)
                .join("\n")}\n\nSubtotal: $${subtotal.toLocaleString()}\n${deliveryInfo}${tip > 0 ? `🙏 Propina: $${tip.toLocaleString()}\n` : ""
            }TOTAL: $${total.toLocaleString()}\n\n👤 Nombre: ${name}\n${locationInfo}📝 Instrucciones: ${instructions || "Ninguna"
            }\n${paymentInfo}`
        );

        // abrir WhatsApp
        window.open(`https://wa.me/573028645014?text=${message}`, "_blank");

        // limpiar después de enviar
        onClear();
        resetForm();
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
            if (result.isConfirmed) onRemove(id);
        });
    };

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
                onClear(); // limpia productos
                resetForm(); // limpia formulario
                Swal.fire(
                    "Carrito vacío",
                    "Se eliminaron todos los productos.",
                    "success"
                );
            }
        });
    };

    // 👇 función que maneja la ubicación con loader + cancelar
    const getCurrentLocation = (
        onSuccess: () => void,
        onError: () => void
    ): (() => void) | void => {
        if (!navigator.geolocation) {
            Swal.fire("Error", "Tu navegador no soporta geolocalización", "error");
            onError();
            return;
        }

        const watcherId = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setSelectedLocation({ lat: latitude, lng: longitude });
                onSuccess();
                navigator.geolocation.clearWatch(watcherId);
            },
            (err) => {
                console.error("Error obteniendo ubicación", err);
                Swal.fire("Error", "No se pudo obtener ubicación", "error");
                onError();
                navigator.geolocation.clearWatch(watcherId);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );

        // devolvemos función de cancelación
        return () => {
            navigator.geolocation.clearWatch(watcherId);
        };
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            {/* Overlay */}

            {/* Modal */}
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 300 }}
                onDragEnd={(_, info) => info.offset.y > 100 && onClose()}
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className=" w-full bg-white shadow-2xl flex flex-col
        fixed bottom-0 left-0 right-0 h-[90vh] rounded-t-3xl 
        md:static md:h-auto md:max-w-md md:rounded-3xl md:max-h-[700px]
      "
            >
                {/* Header */}
                <div className="flex-shrink-0 p-4 border-b border-gray-200">
                    <button
                        onClick={onClose}
                        className="hidden md:block absolute right-5 top-5 text-gray-500"
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-2xl font-bold">🛍️ Tu pedido</h2>
                </div>

                {/* Body */}
                {items.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-600">Tu carrito está vacío 🍽️</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto px-4 py-2">
                            {/* aquí van tus componentes internos */}
                            <CartItemList
                                items={items}
                                onUpdateQuantity={onUpdateQuantity}
                                onRemove={confirmRemove}
                            />

                            <CartSummary
                                subtotal={subtotal}
                                deliveryFee={deliveryFee}
                                tip={tip}
                                total={total}
                                payment={payment}
                                cashAmount={cashAmount}
                                change={change}
                            />

                            <ServiceTypeSelector
                                serviceType={serviceType}
                                onChange={(t) => {
                                    setServiceType(t);
                                    setErrors({ ...errors, location: false });
                                }}
                            />

                            {serviceType === "mesa" && (
                                <MesaSelector
                                    selectedMesa={selectedMesa}
                                    mesas={mesasDisponibles}
                                    error={errors.location}
                                    onSelect={setSelectedMesa}
                                />
                            )}

                            {serviceType === "domicilio" && (
                                <AddressForm
                                    address={address}
                                    setAddress={setAddress}
                                    selectedLocation={selectedLocation}
                                    deliveryFee={deliveryFee}
                                    error={errors.location}
                                    onGetLocation={getCurrentLocation}
                                />
                            )}

                            <TipSelector tip={tip} setTip={setTip} />

                            <CustomerInfo
                                name={name}
                                setName={setName}
                                instructions={instructions}
                                setInstructions={setInstructions}
                                error={errors.name}
                            />

                            <PaymentSection
                                payment={payment}
                                setPayment={setPayment}
                                cashAmount={cashAmount}
                                setCashAmount={setCashAmount}
                                change={change}
                                error={errors.cash}
                                formatCashInput={formatCashInput}
                            />
                        </div>

                        <CartActions
                            serviceType={serviceType}
                            onWhatsAppClick={handleWhatsAppClick}
                            onClear={confirmClear}
                        />
                    </>
                )}
            </motion.div>
        </div>
    );

}
