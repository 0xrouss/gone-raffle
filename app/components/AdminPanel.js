import { useWriteContract } from "wagmi";
import { goneffleContract } from "../hooks/useGetContractData";

export function AdminPanel({ user, owner }) {
    const { writeContractAsync } = useWriteContract();

    if (user == owner) {
        return (
            <div className="bg-gray-100 flex flex-col items-center rounded-xl border-8">
                <p className="font-medium text-xl my-2">Admin Panel</p>
                <button
                    type="button"
                    onClick={() => {
                        writeContractAsync({
                            ...goneffleContract,
                            functionName: "pickWinner",
                        });
                    }}
                    className="focus:outline-none text-white font-medium rounded-xl text-xl w-[80%] py-4 mb-4 bg-gone hover:bg-gone-hover"
                >
                    Pick winner
                </button>
                <button
                    type="button"
                    onClick={() => {
                        writeContractAsync({
                            ...goneffleContract,
                            functionName: "emergencyWithdraw",
                        });
                    }}
                    className="focus:outline-none text-white font-medium rounded-xl text-xl w-[80%] py-4 mb-4 bg-gone hover:bg-gone-hover"
                >
                    Emergency Withdraw
                </button>
            </div>
        );
    }
}
