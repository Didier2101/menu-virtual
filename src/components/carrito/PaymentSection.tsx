interface Props {
    payment: string;
    setPayment: (value: string) => void;
    cashAmount: string;
    setCashAmount: (val: string) => void;
    change: number;
    error: boolean;
    formatCashInput: (value: string) => string;
}

export default function PaymentSection({
    payment,
    setPayment,
    cashAmount,
    setCashAmount,
    change,
    error,
    formatCashInput,
}: Props) {
    return (
        <div className="space-y-3 mb-6">
            <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
            >
                <option>Efectivo</option>
                <option>Tarjeta</option>
                <option>Nequi</option>
                <option>Daviplata</option>
                <option>Llave</option>
            </select>

            {payment === "Efectivo" && (
                <div>
                    <input
                        type="text"
                        placeholder="¿Con cuánto pagas? *"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(formatCashInput(e.target.value))}
                        className={`w-full border ${error ? "border-red-500" : "border-gray-200"
                            } rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none`}
                    />
                    {error && (
                        <p className="text-red-500 text-xs mt-1">
                            {!cashAmount ? "Debes indicar con cuánto pagas" : "El monto no cubre el total"}
                        </p>
                    )}
                    {cashAmount && change >= 0 && (
                        <p className="text-green-600 text-sm mt-1">Cambio: ${change.toLocaleString()}</p>
                    )}
                    {cashAmount && change < 0 && (
                        <p className="text-red-500 text-sm mt-1">
                            Faltan: ${(-change).toLocaleString()} para completar el pago
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
