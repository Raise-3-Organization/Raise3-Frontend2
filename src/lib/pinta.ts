const NEXT_PUBLIC_PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

if (!NEXT_PUBLIC_PINATA_JWT) {
  throw new Error("NEXT_PUBLIC_PINATA_JWT is not defined in the environment variables.");
}

export async function pinFileWithPinata(file: File) {
  try {
    const data = new FormData();
    data.append("file", file);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NEXT_PUBLIC_PINATA_JWT}`,
      },
      body: data,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`HTTP error! status: ${res.status}, ${JSON.stringify(errorData)}`);
    }

    const result = (await res.json()) as { IpfsHash: string };

    return `ipfs://${result.IpfsHash}`;
  } catch (error: any) {
    console.error("Error pinning file with Pinata:", error);
    throw error; // Re-throw the error to be caught by the calling function
  }
}

export async function pinJsonWithPinata(json: object) {
  try {
    const data = JSON.stringify({
      pinataContent: json,
      pinataMetadata: {
        name: "metadata.json",
      },
    });

    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NEXT_PUBLIC_PINATA_JWT}`,
      },
      body: data,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`HTTP error! status: ${res.status}, ${JSON.stringify(errorData)}`);
    }

    const result = (await res.json()) as { IpfsHash: string };

    return `ipfs://${result.IpfsHash}`;
  } catch (error: any) {
    console.error("Error pinning JSON with Pinata:", error);
    throw error; // Re-throw the error to be caught by the calling function
  }
}