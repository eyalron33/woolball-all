import { ethers } from "ethers";
import woolballJSON from "../ABIs/woolball.json"

/**
 * Registers a name on the blockchain.
 * 
 * @param {Object} data - The registration data.
 * @param {string} data.name - The name to register.
 * @param {string} data.pubKeyX - The public key X coordinate.
 * @param {string} data.pubKeyY - The public key Y coordinate.
 * @param {string} data.duration - The registration duration in weeks.
 */
export const registerHuman = async ({ name, pubKeyX, pubKeyY, duration }) => {
    const CONTRACT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // Change to your contract address
    const CONTRACT_ABI = woolballJSON.abi;

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
        const options = {
            value: ethers.parseUnits("10000000000000.0", "wei"),
        };
        console.log("options: ", options);
        const nameID = await contract.newHumanName.staticCall(name, pubKeyX, pubKeyY, duration, options);
        const tx = await contract.newHumanName(name, pubKeyX, pubKeyY, duration, options);
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
