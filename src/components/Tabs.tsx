import { useState, useRef, useEffect } from "react";

interface Props {
    categories: string[];
    onSelect: (cat: string) => void;
}

// Relación categoría → emoji
const categoryIcons: Record<string, string> = {
    "Todos": "🍽️",
    "Perros Calientes": "🌭",
    "Hamburguesas": "🍔",
    "Salchipapas": "🍟",
    "Bebidas": "🥤",
    "Arepas": "🫓",
    "Sándwich": "🥪",
    "Otros": "➕",
    "Servicios (Mini)": "🥣",
    "Matador": "🔥"
};

export default function Tabs({ categories, onSelect }: Props) {
    const [active, setActive] = useState(categories[0]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to active tab
    useEffect(() => {
        if (scrollContainerRef.current) {
            const activeTab = scrollContainerRef.current.querySelector('[aria-pressed="true"]');
            if (activeTab) {
                activeTab.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest'
                });
            }
        }
    }, [active]);

    return (
        <div className="relative">
            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto px-4 py-4 scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {categories.map((cat) => (
                    <div key={cat} className="flex flex-col items-center flex-shrink-0 min-w-max">
                        <button
                            onClick={() => {
                                setActive(cat);
                                onSelect(cat);
                            }}
                            className={`flex items-center justify-center w-14 h-14 rounded-full text-2xl transition-all duration-200
                                ${active === cat
                                    ? "border-2 border-green-500 shadow-lg scale-110 bg-green-50"
                                    : "border border-gray-200 bg-white"
                                }`}
                            aria-pressed={active === cat}
                        >
                            {categoryIcons[cat] || "❓"}
                        </button>
                        <span className="text-gray-600 text-xs mt-1 font-medium max-w-[80px] truncate">
                            {cat}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}