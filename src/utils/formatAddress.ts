/**
 * Formats a blockchain address for display by showing the first 6 and last 4 characters
 * @param address The full address to format
 * @returns The formatted address (e.g. 0x1234...5678)
 */
export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
} 