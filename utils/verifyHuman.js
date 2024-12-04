import { ethers } from "ethers";
import woolballJSON from "../ABIs/woolball.json"

/**
 * Registers a name on the blockchain.
 * 
 * @param {Object} data - The registration data.
 * @param {string} data.name - The name to register.
 * @param {string} data.proof - The public key X coordinate.
 */
export const verifyHuman = async ({ name, proof }) => {
    const CONTRACT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // Change to your contract address
    const CONTRACT_ABI = woolballJSON.abi;

    const HUMAN_VERIFIER_CONTRACT = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // Change to your contract address;

    try {
        // Check if Metamask is available
        if (!window.ethereum) {
            alert("Metamask is not installed.");
            return;
        }

        // Create a provider and signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Get the contract instance
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        // Call the contract's registerName function
        const tx = await contract.verifyHuamn(proof, nameID, verifiedForTimestamp, HUMAN_VERIFIER_CONTRACT);
        console.log("Transaction sent:", tx);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);

        alert("Registration successful! nameID: ", nameID);
    } catch (error) {
        console.error("Error registering name:", error);
        alert("Registration failed. Please try again.");
    }
};
