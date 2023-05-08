import { ethers, InterfaceAbi, JsonRpcProvider } from 'ethers';

export function getRpcProvider() {
  return new JsonRpcProvider(process.env.RPC_URL);
}

export function getContract(address: string, iface: InterfaceAbi) {
  return new ethers.Contract(address, iface, getRpcProvider());
}
