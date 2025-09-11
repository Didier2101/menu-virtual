import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "../../App";

interface Props {
    items: CartItem[];
    onUpdateQuantity: (id: string, newQty: number) => void;
    onRemove: (id: string) => void;
}

export default function CartItemList({ items, onUpdateQuantity, onRemove }: Props) {
    return (
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
                                    onUpdateQuantity(String(item.product.id), Math.max(0, item.quantity - 1))
                                }
                                className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                                aria-label={`disminuir ${item.product.nombre}`}
                            >
                                <Minus size={14} />
                            </button>

                            <span className="px-2">{item.quantity}</span>

                            <button
                                onClick={() =>
                                    onUpdateQuantity(String(item.product.id), item.quantity + 1)
                                }
                                className="p-1 bg-green-600 text-white rounded-full hover:bg-green-700"
                                aria-label={`aumentar ${item.product.nombre}`}
                            >
                                <Plus size={14} />
                            </button>
                        </div>

                        <span className="font-semibold text-green-600">
                            ${(item.product.precio * item.quantity).toLocaleString()}
                        </span>

                        <button
                            onClick={() => onRemove(String(item.product.id))}
                            className="text-red-500 hover:text-red-700 ml-3"
                            aria-label={`eliminar ${item.product.nombre}`}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
