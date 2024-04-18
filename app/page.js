'use client';

import Navbar from './components/Navbar';
import RaffleHistory from './components/RaffleHistory';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import goneffleABI from './contracts/goneffleABI.json';
import { parseEther } from 'viem';
import { useState } from 'react';
import { ConnectKitButton } from 'connectkit';

function useContractData() {
  const { data: timeLeft } = useContractRead({
    address: "0x7589affE8C0c59A914b48E48EB4be825A710685c",
    abi: goneffleABI,
    functionName: "getTimeLeft",
  });

  const { data: ticketPrice } = useContractRead({
    address: "0x7589affE8C0c59A914b48E48EB4be825A710685c",
    abi: goneffleABI,
    functionName: "ticketPrice",
  });

  const { data: maxTickets } = useContractRead({
    address: "0x7589affE8C0c59A914b48E48EB4be825A710685c",
    abi: goneffleABI,
    functionName: "maxTickets",
  });

  const { data: totalTickets } = useContractRead({
    address: "0x7589affE8C0c59A914b48E48EB4be825A710685c",
    abi: goneffleABI,
    functionName: "totalTickets",
  });

  const { data: tokenBalance } = useContractRead({
    address: "0x7589affE8C0c59A914b48E48EB4be825A710685c",
    abi: goneffleABI,
    functionName: "getTokenBalance",
  });

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return { timeLeft: timeLeft ? formatTime(Number(timeLeft)) : null, ticketPrice, maxTickets, totalTickets, tokenBalance };
}

export default function Home() {
    const { isConnected, address } = useAccount();
    const [ticketCount, setTicketCount] = useState(1);
    const { timeLeft, ticketPrice, maxTickets, totalTickets, tokenBalance } = useContractData();
  
    const incrementCount = () => {
      setTicketCount(ticketCount + 1);
    };
  
    const decrementCount = () => {
      if (ticketCount > 1) {
        setTicketCount(ticketCount - 1);
      }
    };
  
    const { data: ticketsOwned } = useContractRead({
      address: "0x7589affE8C0c59A914b48E48EB4be825A710685c",
      abi: goneffleABI,
      functionName: "getTicketsOwned",
      args: [address],
      watch: true,
      enabled: isConnected,
    });
  
    const { write: buyTickets } = useContractWrite({
      address: "0x7589affE8C0c59A914b48E48EB4be825A710685c",
      abi: goneffleABI,
      functionName: "buyTickets",
      args: [BigInt(ticketCount)],
      overrides: {
        value: ticketPrice ? parseEther((ticketCount * Number(ticketPrice)).toString()) : undefined,
      },
    });
  
    const soldTicketsPercent = maxTickets && totalTickets ? `${((Number(totalTickets) / Number(maxTickets)) * 100).toFixed(0)}%` : "0%";
  
    return (
      <main className="min-h-screen flex flex-col items-center justify-center w-full">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl">
          <div className="bg-white p-3 w-full max-w-md rounded-md shadow-lg mb-4 md:mb-0 md:mr-4">
            <div className="flex flex-col justify-between items-center bg-white p-4">
              <img src="/goneffle.svg" alt="Gone Raffle Logo" className="mb-4" />
              <ConnectKitButton />
            </div>
  
            <div className="text-center text-xl mt-4">
              <p>Enter for a chance to win</p>
              <p className="font-bold text-3xl py-2">{tokenBalance ? Number(tokenBalance) / 1e18 : 0} GONE</p>
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
                <p>{maxTickets ? Number(maxTickets) : 0}</p>
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
  
            <p>Your tickets: {ticketsOwned ? Number(ticketsOwned) : 0}</p>
            <button
              type="button"
              onClick={() => {
                if (isConnected && buyTickets) {
                  buyTickets();
                }
              }}
              className={`focus:outline-none text-white font-medium rounded-xl text-xl w-full py-4 my-2 ${
                isConnected ? "bg-gone hover:bg-gone-hover" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isConnected ? `Buy ${ticketCount} ticket${ticketCount > 1 ? "s" : ""}` : "Please Connect"}
            </button>
            <p className="text-gray-500 text-sm text-right mr-1 mb-4">
              Price per ticket: <span className="font-bold">{ticketPrice ? Number(ticketPrice) : 0} MATIC</span>
            </p>
          </div>
  
          <div className="bg-white p-4 rounded-md shadow-lg w-full max-w-md">
            <RaffleHistory />
          </div>
        </div>
      </main>
    );
  }