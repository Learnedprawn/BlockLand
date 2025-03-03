import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// Blockchain & Safe Setup
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer });

const LAND_REGISTRY_ADDRESS = "0xYourDeployedContractAddress";
const safeAddress = "0xYourGnosisSafeAddress";
const landRegistryAbi = [ /* ABI of LandRegistry */ ];

const contract = new ethers.Contract(LAND_REGISTRY_ADDRESS, landRegistryAbi, signer);

// Safe Setup for Multisig
const safe = await Safe.create({ ethAdapter, safeAddress });

async function transferOwnership(landId, newOwners, ownerSig, govSig, isMultisig) {
    if (!isMultisig) {
        // Single Signer Transaction
        const tx = await contract.transferOwnership(landId, newOwners, ownerSig, govSig);
        console.log("Single Signer Ownership Transfer Tx:", tx.hash);
        return tx;
    } else {
        // Multisig Transaction via Gnosis Safe
        const safeTransaction = await safe.createTransaction({
            to: LAND_REGISTRY_ADDRESS,
            value: 0,
            data: contract.interface.encodeFunctionData("transferOwnership", [landId, newOwners, ownerSig, govSig])
        });

        // Submit transaction for approval
        const txResponse = await safe.executeTransaction(safeTransaction);
        console.log("Multisig Ownership Transfer Tx:", txResponse);
        return txResponse;
    }
}
