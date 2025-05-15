export const fetchIPFSData = async (ipfsURL: string) => {
    try {
      
      const gatewayURL = ipfsURL.replace('ipfs://', 'https://ipfs.io/ipfs/');
      
      const response = await fetch(gatewayURL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch IPFS data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Error fetching IPFS data:', error);
      throw error;
    }
  };