import ProductCard from "./ProductCard";
import type { Product } from "../types";

interface Props {
    products: Product[];
    onSelect: (p: Product) => void;
    onAddToCart: (p: Product) => void;
}

export default function ProductGrid({ products, onSelect, onAddToCart }: Props) {
    return (
        <div className="grid gap-3 p-3">
            {products.map((p) => (
                <ProductCard
                    key={p.id}
                    product={p}
                    onClick={onSelect}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
}
