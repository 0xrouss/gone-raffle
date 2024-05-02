import { useState, useEffect } from "react";
import { useReadContracts } from "wagmi";
import goneffleABI from ".././contracts/goneffleABI.json";

export const goneffleContract = {
    address: "0x122034322b1adc85ddd8d844c2be2d042de65001",
    abi: goneffleABI,
};

export function useGetContractData() {
    const { data, error, isPending } = useReadContracts({
        contracts: [
            {
                ...goneffleContract,
                functionName: "getTimeLeft",
            },
            {
                ...goneffleContract,
                functionName: "ticketPrice",
            },
            {
                ...goneffleContract,
                functionName: "maxTickets",
            },
            {
                ...goneffleContract,
                functionName: "totalTickets",
            },
            {
                ...goneffleContract,
                functionName: "getTokenBalance",
            },
            {
                ...goneffleContract,
                functionName: "owner",
            },
            {
                ...goneffleContract,
                functionName: "winner",
            },
        ],
    });

    const [timeLeft, setTimeLeft] = useState(null);
    const [ticketPrice, setTicketPrice] = useState(null);
    const [maxTickets, setMaxTickets] = useState(null);
    const [totalTickets, setTotalTickets] = useState(null);
    const [tokenBalance, setTokenBalance] = useState(null);
    const [owner, setOwner] = useState(null);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        if (data) {
            setTimeLeft(data[0]?.result.toString());
            setTicketPrice(data[1]?.result.toString());
            setMaxTickets(data[2]?.result.toString());
            setTotalTickets(data[3]?.result.toString());
            setTokenBalance(data[4]?.result.toString());
            setOwner(data[5]?.result.toString());
            setWinner(data[6]?.result.toString());
        }
    }, [data]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (timeLeft && timeLeft > 0) {
                setTimeLeft((prevTime) => prevTime - 1);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    return {
        timeLeft: timeLeft ? formatTime(timeLeft) : null,
        ticketPrice,
        maxTickets,
        totalTickets,
        tokenBalance,
        owner,
        winner,
        error,
        isPending,
    };
}
