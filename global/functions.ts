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

export const convertUnixTimestamp = (timestamp: any) => {
  if (!timestamp) return "/"; // Return a default value if the timestamp is not provided

  const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
  const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for the day
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits for the month
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0'); // Ensure two digits for the hours
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure two digits for the minutes
  const seconds = String(date.getSeconds()).padStart(2, '0'); // Ensure two digits for the seconds

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};