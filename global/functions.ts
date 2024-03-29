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
  return Math.floor(new Date(dateStr).getTime() / 1000) + 300;
}

export function formatDate(inputDate: any) {
  const date = new Date(inputDate);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
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


export const ethToWeiBigInt = (eth: string): bigint => {
  // 1 ETH is 1e18 Wei
  const wei = parseFloat(eth) * 1e18;

  // Rounding down to avoid fractional Wei (since Wei is the smallest unit and cannot be fractional)
  const weiRounded = Math.floor(wei);

  // Convert to BigInt
  return BigInt(weiRounded);
}

export const NATIVE = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

export const ethereumHashRegExp = /^(0x)?[0-9a-fA-F]{64}$/;