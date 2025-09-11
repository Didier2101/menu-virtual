interface Props {
    tip: number;
    setTip: (val: number) => void;
}

export default function TipSelector({ tip, setTip }: Props) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                🙏 Agregar propina (opcional)
            </label>
            <div className="flex gap-2 mb-2">
                <button
                    onClick={() => setTip(0)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${tip === 0 ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    Sin propina
                </button>
                {[1000, 2000, 5000].map((val) => (
                    <button
                        key={val}
                        onClick={() => setTip(val)}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${tip === val ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        +${val.toLocaleString()}
                    </button>
                ))}
            </div>
            <input
                type="number"
                min={0}
                placeholder="Otra cantidad"
                value={tip || ""}
                onChange={(e) => setTip(Number(e.target.value) || 0)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
        </div>
    );
}
