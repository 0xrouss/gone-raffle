"use client";

import { useState, useEffect } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import goneffleABI from "./contracts/goneffleABI.json";
import { parseEther } from "viem";

import { useReadContracts } from "wagmi";

function useContractData() {
    const { data, error, isPending } = useReadContracts({
        contracts: [
            {
                address: "0x7589affE8C0c59A914b48E48EB4be825A710685c",
                abi: goneffleABI,
                functionName: "getTimeLeft",
            },
            {
                address: "0x7589affE8C0c59A914b48E48EB4be825A710685c",
                abi: goneffleABI,
                functionName: "ticketPrice",
            },
            {
                address: "0x7589affE8C0c59A914b48E48EB4be825A710685c",
                abi: goneffleABI,
                functionName: "maxTickets",
            },
            {
                address: "0x7589affE8C0c59A914b48E48EB4be825A710685c",
                abi: goneffleABI,
                functionName: "totalTickets",
            },
            {
                address: "0x7589affE8C0c59A914b48E48EB4be825A710685c",
                abi: goneffleABI,
                functionName: "getTokenBalance",
            },
        ],
    });

    const [timeLeft, setTimeLeft] = useState(null);
    const [ticketPrice, setTicketPrice] = useState(null);
    const [maxTickets, setMaxTickets] = useState(null);
    const [totalTickets, setTotalTickets] = useState(null);
    const [tokenBalance, setTokenBalance] = useState(null);

    useEffect(() => {
        if (data) {
            setTimeLeft(data[0]?.result.toString());
            setTicketPrice(data[1]?.result.toString());
            setMaxTickets(data[2]?.result.toString());
            setTotalTickets(data[3]?.result.toString());
            setTokenBalance(data[4]?.result.toString());
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
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    return { timeLeft: timeLeft ? formatTime(timeLeft) : null, ticketPrice, maxTickets, totalTickets, tokenBalance, error, isPending };
}

export default function Home() {
    const { isConnected, address } = useAccount();
    const [ticketCount, setTicketCount] = useState(1);
    const { timeLeft, ticketPrice, maxTickets, totalTickets, tokenBalance, error, isPending } = useContractData();
    console.log(tokenBalance);

    const incrementCount = () => {
        setTicketCount(ticketCount + 1);
    };

    const decrementCount = () => {
        if (ticketCount > 1) {
            setTicketCount(ticketCount - 1);
        }
    };

    const { data: ticketsOwned } = useReadContract({
        address: "0x7589affE8C0c59A914b48E48EB4be825A710685c",
        abi: goneffleABI,
        functionName: "getTicketsOwned",
        args: [address],
        watch: true,
        enabled: isConnected,
    });

    console.log(ticketsOwned);

    const { data: hash, writeContractAsync } = useWriteContract();

    const soldTicketsPercent = maxTickets && totalTickets ? `${((totalTickets / maxTickets) * 100).toFixed(0)}%` : "0%";

    if (isPending) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <main className="min-h-screen items-center justify-center w-full">
            <div className="bg-white p-3 w-full max-w-md rounded-md shadow-lg">
                <div className="flex flex-col justify-between items-center bg-white p-4">
                    <img src="/goneffle.svg" alt="Gone Raffle Logo" className=" mb-4" />
                    <ConnectKitButton />
                </div>

                <div className="text-center text-xl mt-4">
                    <p>Enter for a chance to win</p>
                    <p className="font-bold text-3xl py-2">{tokenBalance / 1e18} GONE</p>
                    <p>
                        Drawing on <span>{timeLeft}</span>
                    </p>
                </div>
                <div className="mt-4">
                    <p className="text-center">Total tickets sold</p>
                    <div className="w-[90%] mx-auto bg-gray-300 rounded-full h-4 my-2">
                        <div className={`bg-gone h-4 rounded-full`} style={{ width: soldTicketsPercent }}></div>
                    </div>
                    <div className="w-[90%] mx-auto flex justify-between">
                        <p>0</p>
                        <p>{maxTickets}</p>
                    </div>
                </div>

                <div className="flex items-center justify-center mb-4">
                    <button onClick={decrementCount} className="px-4 py-2 bg-gray-100 rounded-md text-xl hover:bg-gray-200">
                        -
                    </button>
                    <span className="mx-4 text-2xl w-12 text-center">{ticketCount}</span>
                    <button onClick={incrementCount} className="px-4 py-2 bg-gray-100 rounded-md text-xl hover:bg-gray-200">
                        +
                    </button>
                </div>

                <p>Your tickets: {ticketsOwned ? ticketsOwned.toString() : 0}</p>
                <button
                    type="button"
                    onClick={() => {
                        if (isConnected) {
                            writeContractAsync({
                                address: "0x7589affE8C0c59A914b48E48EB4be825A710685c",
                                abi: goneffleABI,
                                functionName: "buyTickets",
                                args: [BigInt(ticketCount)],
                                value: parseEther((ticketCount * ticketPrice).toString()),
                            });
                        }
                    }}
                    className={`focus:outline-none text-white font-medium rounded-xl text-xl w-full py-4 my-2 ${isConnected ? "bg-gone hover:bg-gone-hover" : "bg-gray-400 cursor-not-allowed"}`}
                >
                    {isConnected ? `Buy ${ticketCount} ticket${ticketCount > 1 ? "s" : ""}` : "Please Connect"}
                </button>
                <p className="text-gray-500 text-sm text-right mr-1 mb-4">
                    Price per ticket: <span className="font-bold">{ticketPrice} MATIC</span>
                </p>
            </div>
        </main>
    );
}
