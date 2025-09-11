interface Props {
    name: string;
    setName: (value: string) => void;
    instructions: string;
    setInstructions: (value: string) => void;
    error: boolean;
}

export default function CustomerInfo({ name, setName, instructions, setInstructions, error }: Props) {
    return (
        <div className="space-y-3 mb-6">
            <div>
                <input
                    type="text"
                    placeholder="Tu nombre *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full border ${error ? "border-red-500" : "border-gray-200"
                        } rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none`}
                />
                {error && <p className="text-red-500 text-xs mt-1">El nombre es requerido</p>}
            </div>

            <div>
                <textarea
                    placeholder="Instrucciones especiales (ej: hamburguesa sin cebolla...)"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                    Especifica aquí cualquier modificación o instrucción especial
                </p>
            </div>
        </div>
    );
}
