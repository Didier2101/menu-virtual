import type { Mesa } from "../../data/mesas";

interface Props {
    selectedMesa: Mesa | null;
    mesas: Mesa[];
    error: boolean;
    onSelect: (mesa: Mesa) => void;
}

export default function MesaSelector({ selectedMesa, mesas, error, onSelect }: Props) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                🍽️ Selecciona tu mesa
            </label>
            <select
                value={selectedMesa?.id || ""}
                onChange={(e) => {
                    const mesa = mesas.find((m) => m.id === e.target.value);
                    if (mesa && mesa.disponible) onSelect(mesa);
                }}
                className={`w-full border ${error ? "border-red-500" : "border-gray-200"
                    } rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none`}
            >
                <option value="">Selecciona una mesa</option>
                {mesas.map((mesa) => (
                    <option key={mesa.id} value={mesa.id} disabled={!mesa.disponible}>
                        {mesa.nombre} {mesa.disponible ? "" : "✗"}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-xs mt-2">Debes seleccionar una mesa</p>}
            {selectedMesa && (
                <p className="text-green-600 text-sm mt-2">
                    Mesa seleccionada: <strong>{selectedMesa.nombre}</strong>
                </p>
            )}
        </div>
    );
}
