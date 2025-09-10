import { Search, X } from "lucide-react";

interface Props {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export default function SearchBar({ searchTerm, onSearchChange }: Props) {
    return (
        <div className="relative px-2 mb-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="¿Qué estás buscando?"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-10 py-3.5 border-0 rounded-xl shadow-md 
                             focus:ring-3 focus:ring-green-400 focus:outline-none
                             placeholder-gray-500 bg-white text-gray-800 font-medium"
                />
                {searchTerm && (
                    <button
                        onClick={() => onSearchChange("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 
                                 text-gray-500 hover:text-green-500 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
}