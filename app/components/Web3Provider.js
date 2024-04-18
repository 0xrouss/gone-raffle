"use client";

import { WagmiProvider, createConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { http } from "viem";

const config = createConfig(
    getDefaultConfig({
        // Your dApps chains
        chains: [polygon],
        transports: {
            // RPC URL for each chain
            // [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
            [polygon.id]: http("https://gateway.tenderly.co/public/polygon"),
        },
        ssr: true,

        // Required API Keys
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

        // Required App Info
        appName: "Goneffle",

        // Optional App Info
        appDescription: "This is Goneffle description",
        appUrl: "https://family.co", // your app's url
        appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider theme="soft">{children}</ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};
