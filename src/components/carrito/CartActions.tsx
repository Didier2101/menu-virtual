interface Props {
    serviceType: "mesa" | "domicilio" | "paraLlevar";
    onWhatsAppClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    onClear: () => void;
}

export default function CartActions({ serviceType, onWhatsAppClick, onClear }: Props) {
    return (
        <div className="flex-shrink-0 p-4 bg-white border-t border-gray-100">
            <div className="flex flex-col gap-3">
                <a
                    href="#"
                    onClick={onWhatsAppClick}
                    className="block bg-green-600 hover:bg-green-700 transition text-white text-center py-3 rounded-xl font-semibold shadow-lg"
                >
                    {serviceType === "domicilio"
                        ? "Pedir a domicilio"
                        : serviceType === "mesa"
                            ? "Pedir en local"
                            : "Pedir para llevar"}
                </a>
                <button
                    onClick={onClear}
                    className="block bg-gray-200 hover:bg-gray-300 transition text-gray-700 text-center py-3 rounded-xl font-semibold"
                >
                    Vaciar carrito
                </button>
            </div>
        </div>
    );
}
