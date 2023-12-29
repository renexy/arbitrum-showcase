function shortenEthAddress(address: string) {
    if (!address || address.length < 7) {
        return address; // Return the original address if it's too short to shorten
    }

    // Taking the first 3 and last 3 characters of the address
    return `${address.substring(0, 3)}...${address.substring(address.length - 3)}`;
}

export default shortenEthAddress