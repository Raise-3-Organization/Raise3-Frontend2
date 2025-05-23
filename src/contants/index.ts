export const contractAddress = "0x6d9DB62893Be1eF23Bf8b4101e628dA6172F6bcF";
// 0x6d9DB62893Be1eF23Bf8b4101e628dA6172F6bcF
// 0xAED8c5D4926109E87Aeb4D09bBBcbc457dB54E56

export const truuncateAddress = (address: string) => {
  if(!address) return;
  return address.slice(0,5) + "..." + address.slice(address.length - 4, address.length)
}

export const CONTRACT_ROLE = {
    FOUNDER_ROLE: "0x7ed687a8f2955bd2ba7ca08227e1e364d132be747f42fb733165f923021b0225",
    INVESTOR_ROLE: "0xb165298935924f540e4181c03493a5d686c54a0aaeb3f6216de85b7ffbba7738",
    MANAGER_ROLE: "0x241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b08",
}