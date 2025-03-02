import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ReactNode } from "react";
import { mantleSepolia } from "@/utils/network";

const config = createConfig(
    getDefaultConfig({
        chains: [mantleSepolia],
        transports: {
            [mantleSepolia.id]: http(`https://rpc.sepolia.mantle.xyz`),
        },

        // Required API Keys
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || "",

        // Required App Info
        appName: "Harbour AI Agent",
    })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => (
    <WagmiProvider config={config} >
        <QueryClientProvider client={queryClient}>
            <ConnectKitProvider>{children} </ConnectKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
);