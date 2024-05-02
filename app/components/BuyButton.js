import { parseEther } from "viem";
import { goneffleContract } from "../hooks/useGetContractData";

export function BuyButton({
    isConnected,
    ticketCount,
    ticketPrice,
    userBalance,
    winner,
    ticketsAvailable,
    writeContractAsync,
}) {
    function getButtonText() {
        console.log(winner);
        if (!isConnected) {
            return "Please Connect";
        }
        if (winner) {
            return "Raffle ended";
        }
        if (ticketCount * ticketPrice > userBalance) {
            return "Insufficient Funds";
        }
        if (!ticketsAvailable) {
            return "Sold Out";
        }
        return `Buy ticket${ticketCount > 1 ? "s" : ""}`;
    }

    const isBuyActive =
        isConnected &&
        !winner &&
        ticketsAvailable &&
        ticketCount * ticketPrice <= userBalance;

    return (
        <button
            type="button"
            onClick={() => {
                if (isBuyActive) {
                    writeContractAsync({
                        ...goneffleContract,
                        functionName: "buyTickets",
                        args: [BigInt(ticketCount)],
                        value: parseEther(
                            (ticketCount * ticketPrice).toString()
                        ),
                    });
                }
            }}
            className={`focus:outline-none text-white font-medium rounded-xl text-xl w-full py-4 my-2 ${
                isBuyActive
                    ? "bg-gone hover:bg-gone-hover"
                    : "bg-gray-400 cursor-not-allowed"
            }`}
        >
            {getButtonText()}
        </button>
    );
}
