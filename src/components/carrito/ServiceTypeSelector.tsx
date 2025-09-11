import { Utensils, MapPin, ShoppingBag } from "lucide-react";

type ServiceType = "mesa" | "domicilio" | "paraLlevar";

interface Props {
    serviceType: ServiceType;
    onChange: (type: ServiceType) => void;
}

export default function ServiceTypeSelector({ serviceType, onChange }: Props) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                📍 Tipo de servicio
            </label>
            <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                    onClick={() => onChange("mesa")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition ${serviceType === "mesa"
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <Utensils size={16} />
                    En local
                </button>
                <button
                    onClick={() => onChange("domicilio")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition ${serviceType === "domicilio"
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <MapPin size={16} />
                    Domicilio
                </button>
                <button
                    onClick={() => onChange("paraLlevar")}
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
    );
}
