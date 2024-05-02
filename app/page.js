"use client";

import { useState, useEffect } from "react";
import { ConnectKitButton } from "connectkit";
import {
    useAccount,
    useWriteContract,
    useReadContract,
    useBalance,
} from "wagmi";

import {
    useGetContractData,
    goneffleContract,
} from "./hooks/useGetContractData";
import { TicketCounter } from "./components/TicketCounter";
import { AdminPanel } from "./components/AdminPanel";
import { BuyButton } from "./components/BuyButton";

export default function Home() {
    const { isConnected, address } = useAccount();
    const [ticketCount, setTicketCount] = useState(1);
    const {
        timeLeft,
        ticketPrice,
        maxTickets,
        totalTickets,
        tokenBalance,
        owner,
        winner,
        error,
        isPending,
    } = useGetContractData();

    const [userBalance, setUserBalance] = useState(0);

    const incrementCount = () => {
        if (ticketCount + parseInt(totalTickets) < maxTickets) {
            setTicketCount(ticketCount + 1);
        }
    };

    const decrementCount = () => {
        if (ticketCount > 1) {
            setTicketCount(ticketCount - 1);
        }
    };

    const { data: ticketsOwned } = useReadContract({
        ...goneffleContract,
        functionName: "getTicketsOwned",
        args: [address],
        watch: true,
        enabled: isConnected,
    });

    const { data: balance } = useBalance({
        address: address,
        watch: true,
        enabled: isConnected,
    });

    useEffect(() => {
        if (balance) {
            setUserBalance((parseInt(balance.value) / 1e18).toFixed(2));
        }
    }, [balance]);

    const { data: hash, writeContractAsync } = useWriteContract();

    const soldTicketsPercent =
        maxTickets && totalTickets
            ? `${((totalTickets / maxTickets) * 100).toFixed(0)}%`
            : "0%";

    if (isPending)
        return (
            <div className="min-h-screen flex items-center justify-center w-full">
                Loading...
            </div>
        );
    if (error) return <div>Error: {error.message}</div>;

    return (
        <main className="min-h-screen flex items-center justify-center w-full">
            <div className="bg-white p-3 w-full max-w-md rounded-md shadow-lg">
                <div className="flex flex-col justify-between items-center bg-white p-4">
                    <img
                        src="/goneffle.svg"
                        alt="Gone Raffle Logo"
                        className=" mb-4"
                    />
                    <ConnectKitButton />
                </div>

                {winner &&
                    winner != "0x0000000000000000000000000000000000000000" && (
                        <div className="text-green-600 flex flex-col items-center font-bold text-base mb-4">
                            <p>Winner:</p>
                            <p>{winner}</p>
                        </div>
                    )}

                <div className="text-center text-xl">
                    <p>Enter for a chance to win</p>
                    <p className="font-bold text-3xl py-2">
                        {tokenBalance / 1e18} GONE
                    </p>
                    <p>
                        Drawing on <span>{timeLeft}</span>
                    </p>
                </div>
                <div className="mt-4">
                    <p className="text-center">Total tickets sold</p>
                    <div className="w-[90%] mx-auto bg-gray-300 rounded-full h-4 my-2">
                        <div
                            className={`bg-gone h-4 rounded-full`}
                            style={{ width: soldTicketsPercent }}
                        ></div>
                    </div>
                    <div className="w-[90%] mx-auto flex justify-between">
                        <p>0</p>
                        <p>{maxTickets}</p>
                    </div>
                </div>

                <TicketCounter
                    count={ticketCount}
                    increment={incrementCount}
                    decrement={decrementCount}
                />

                <p>
                    Your tickets: {ticketsOwned ? ticketsOwned.toString() : 0}
                </p>
                <BuyButton
                    isConnected={isConnected}
                    ticketCount={ticketCount}
                    ticketPrice={ticketPrice}
                    userBalance={userBalance}
                    ticketsAvailable={totalTickets != maxTickets}
                    winner={winner}
                    writeContractAsync={writeContractAsync}
                />
                <p className="text-gray-500 text-sm text-right mr-1 mb-4">
                    Price per ticket:{" "}
                    <span className="font-bold">{ticketPrice} MATIC</span>
                </p>
                <AdminPanel user={address} owner={owner} />
            </div>
        </main>
    );
}
