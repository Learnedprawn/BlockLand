import { ConnectButton, WalletButton } from "@rainbow-me/rainbowkit";
import React from 'react'
import { CircleDollarSign } from "lucide-react";

export default function SingleNFTOwner() {
  return (
    <div>
      <button onClick={console.log("Hello")}>MintNFt</button>
      <CircleDollarSign></CircleDollarSign>
    </div>
  )
}
