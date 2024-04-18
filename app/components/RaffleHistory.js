"use client";

import { useWatchContractEvent } from "wagmi";
import goneffleABI from "../contracts/goneffleABI.json";

const RaffleHistory = () => {
  const raffleEvents = useWatchContractEvent({
    address: "0x7589affE8C0c59A914b48E48EB4be825A710685c",
    abi: goneffleABI,
    eventName: "WinnerPicked",
    listener: (winner, prizeAmount, timestamp) => ({
      winner,
      prizeAmount,
      timestamp,
    }),
  });

  return (
    <div className="bg-white p-4 rounded-md shadow-lg mt-4 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Raffle History</h2>
      {raffleEvents && raffleEvents.length > 0 ? (
        <ul>
          {raffleEvents.map((event, index) => (
            <li key={index} className="mb-2">
              <p>Winner: {event.winner}</p>
              <p>Prize: {event.prizeAmount.toString()}</p>
              <p>Date: {new Date(event.timestamp.toNumber() * 1000).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No raffle history available.</p>
      )}
    </div>
  );
};

export default RaffleHistory;