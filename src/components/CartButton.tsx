import { ShoppingCart } from "lucide-react";

interface Props {
    count: number;
    onClick: () => void;
}

export default function CartButton({ count, onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-5 right-5 bg-black text-white p-4 rounded-full shadow-lg "
        >
            <ShoppingCart size={22} />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {count}
                </span>
            )}
        </button>
    );
}
