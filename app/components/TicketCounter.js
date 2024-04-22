export function TicketCounter({ count, increment, decrement }) {
    return (
        <div className="flex items-center justify-center mb-4">
            <button onClick={decrement} className="px-4 py-2 bg-gray-100 rounded-md text-xl hover:bg-gray-200">
                -
            </button>
            <span className="mx-4 text-2xl w-12 text-center">{count}</span>
            <button onClick={increment} className="px-4 py-2 bg-gray-100 rounded-md text-xl hover:bg-gray-200">
                +
            </button>
        </div>
    );
}
