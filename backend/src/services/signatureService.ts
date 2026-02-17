import { ethers } from "ethers";

export const verifyWalletSignature = (message: string, signature: string, expectedAddress: string) => {
  try {
    const recovered = ethers.verifyMessage(message, signature);
    return recovered.toLowerCase() === expectedAddress.toLowerCase();
  } catch {
    return false;
  }
};
