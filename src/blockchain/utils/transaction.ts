import { HttpException } from '@nestjs/common';
import { getRpcProvider } from './common';
import { Interface } from 'ethers';

export async function getTransaction(txHash: string, tryTimes = 10) {
  const provider = getRpcProvider();
  let tries = 0;
  let tx = await provider.getTransaction(txHash);

  // try to get transaction for 10 times if it is not found
  while (tries < tryTimes && !tx) {
    tries++;
    // increase delay between tries
    const delay = 2000 * tries;
    await new Promise((resolve) => setTimeout(resolve, delay));
    tx = await provider.getTransaction(txHash);
  }
  if (!tx) {
    throw new HttpException('Transaction not found', 404);
  }
  return tx;
}

export async function getLogsFromTransaction(
  txHash: string,
  name: string,
  iface: Interface,
  tryTimes = 10,
) {
  const tx = await getTransaction(txHash, tryTimes);

  const repeceit = await tx.wait();
  const logs = repeceit.logs;

  return logs
    .map((log) => {
      try {
        // return iface.decodeEventLog(name, log.data, log.topics); // ethers v5

        return iface.parseLog({
          // ethers v6
          topics: log.topics as string[],
          data: log.data,
        });
      } catch (e) {
        console.log(e);
      }
    })
    .filter((decodedLog) => !!decodedLog);
}

// get only first log
export async function getLogFromTransaction(
  txHash: string,
  name: string,
  iface: Interface,
) {
  const logs = await getLogsFromTransaction(txHash, name, iface);
  if (logs.length > 0) {
    return logs[0];
  }
}
