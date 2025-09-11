import { useRef, useState } from "react";
import { Navigation, Map, Loader2, CheckCircle, XCircle } from "lucide-react";

interface Props {
    address: string;
    setAddress: (value: string) => void;
    selectedLocation: { lat: number; lng: number } | null;
    deliveryFee: number;
    error: boolean;
    onGetLocation: (onSuccess: () => void, onError: () => void) => (() => void) | void;
}

export default function AddressForm({
    address,
    setAddress,
    selectedLocation,
    deliveryFee,
    error,
    onGetLocation,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const cancelRef = useRef<(() => void) | null>(null);

    const handleGetLocation = () => {
        setLoading(true);
        setConfirmed(false);

        const cancelFn = onGetLocation(
            () => {
                setLoading(false);
                setConfirmed(true);
                cancelRef.current = null;
            },
            () => {
                setLoading(false);
                setConfirmed(false);
                cancelRef.current = null;
            }
        );

        if (typeof cancelFn === "function") {
            cancelRef.current = cancelFn;
        } else {
            cancelRef.current = null;
        }
    };

    const handleCancel = () => {
        if (cancelRef.current) {
            cancelRef.current();
            cancelRef.current = null;
        }
        setLoading(false);
        setConfirmed(false);
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                📍 Dirección de entrega *
            </label>

            <input
                type="text"
                placeholder="Ingresa tu dirección completa"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full border ${error ? "border-red-500" : "border-gray-200"
                    } rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none mb-2`}
            />

            <div className="mb-2 flex flex-col gap-2">
                <div className="flex gap-2">
                    <button
                        onClick={handleGetLocation}
                        disabled={loading}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition
              ${loading
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                Obteniendo ubicación...
                            </>
                        ) : confirmed ? (
                            <>
                                <CheckCircle size={16} className="text-green-600" />
                                Ubicación obtenida
                            </>
                        ) : (
                            <>
                                <Navigation size={16} />
                                Obtener mi ubicación automáticamente
                            </>
                        )}
                    </button>

                    {loading && (
                        <button
                            onClick={handleCancel}
                            className="px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600"
                            title="Cancelar obtención de ubicación"
                        >
                            <XCircle size={16} />
                        </button>
                    )}
                </div>

                <p className="text-xs text-gray-500 text-center">
                    Opcional: Comparte tu ubicación para facilitar la entrega
                </p>
            </div>

            {selectedLocation && (
                <div className="bg-green-50 p-3 rounded-lg mb-2">
                    <p className="text-green-700 text-sm flex items-center gap-2">
                        <Map size={16} />
                        <span>
                            Ubicación guardada: {selectedLocation.lat.toFixed(4)},{" "}
                            {selectedLocation.lng.toFixed(4)}
                        </span>
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                        El domiciliario recibirá un enlace para abrir en Maps/Waze
                    </p>
                </div>
            )}

            {error && (
                <p className="text-red-500 text-xs mt-1">
                    La dirección es requerida
                </p>
            )}
            <p className="text-sm text-gray-600 mt-1">
                Costo de envío: ${deliveryFee.toLocaleString()} (Si es muy lejos, podría aumentar a $5000)
            </p>
        </div>
    );
}
