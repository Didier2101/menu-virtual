interface Props {
    subtotal: number;
    deliveryFee: number;
    tip: number;
    total: number;
    payment: string;
    cashAmount: string;
    change: number;
}

export default function CartSummary({
    subtotal,
    deliveryFee,
    tip,
    total,
    payment,
    cashAmount,
    change,
}: Props) {
    return (
        <div className="space-y-2 font-semibold bg-gray-50 rounded-xl p-4 shadow-inner mb-4">
            <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
            </div>

            {deliveryFee > 0 && (
                <div className="flex justify-between text-red-500">
                    <span>+ Domicilio</span>
                    <span>${deliveryFee.toLocaleString()}</span>
                </div>
            )}

            {tip > 0 && (
                <div className="flex justify-between text-gray-600">
                    <span>+ Propina</span>
                    <span>${tip.toLocaleString()}</span>
                </div>
            )}

            <div className="flex justify-between text-lg text-gray-900">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
            </div>

            {payment === "Efectivo" && cashAmount && (
                <div className={`flex justify-between text-sm pt-2 border-t ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span>Cambio:</span>
                    <span>${change.toLocaleString()}</span>
                </div>
            )}
        </div>
    );
}
