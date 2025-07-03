import { ethers } from 'ethers';
import abi from './abi/DeltaGenesisSBT.json';

const CONTRACT_ADDRESS = '0xYourGenesisSBTAddress';
const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.matic.today"); // or mainnet
const signer = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

const recipients = [
  { address: '0xabc...', cid: 'QmGenesisBadge1' },
  { address: '0xdef...', cid: 'QmGenesisBadge2' },
];

async function mintAll() {
  for (const r of recipients) {
    const tx = await contract.mintGenesis(r.address, `ipfs://${r.cid}`);
    console.log(`Minted to ${r.address} → tx: ${tx.hash}`);
    await tx.wait();
  }
}

mintAll();
