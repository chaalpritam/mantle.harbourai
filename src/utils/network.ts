import { Chain } from "wagmi/chains";

export const mantleSepolia: Chain = {
    id: 5003,
    name: "Mantle Sepolia",
    nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://rpc.sepolia.mantle.xyz"],
        },
    },
    blockExplorers: {
        default: {
            name: "Mantle Sepolia Block Explorer",
            url: "https://explorer.sepolia.mantle.xyz",
        },
    }
};