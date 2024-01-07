import { ethers } from 'ethers';

export const shortenEthAddress = (address: string) => {
    if (!address || address.length < 7) {
        return address; // Return the original address if it's too short to shorten
    }

    // Taking the first 3 and last 3 characters of the address
    return `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;
}

export const toChecksumAddress = (address: string) => {
  try {
    return ethers.utils.getAddress(address);
  } catch (error) {
    console.error('Invalid Ethereum address:', error);
  }
}

export function dateStringToSeconds(dateStr: string) {
  return Math.floor(new Date(dateStr).getTime() / 1000);
}