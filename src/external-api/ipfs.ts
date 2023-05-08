import axios from 'axios';

export function getIpfsUrl(uri: any) {
  const gateway = process.env.IFPS_GATEWAY || 'https://ipfs.io/ipfs';
  if (!uri) {
    return undefined;
  }
  uri = uri.replace('ipfs://', `${gateway}`);
  uri = uri.replace('https://ipfs.io/ipfs', gateway);
  uri = uri.replace('https://gateway.pinata.cloud/ipfs/', gateway);

  return uri;
}

export async function getNftMetadata(uri: string) {
  const { data } = await axios.get(getIpfsUrl(uri));
  return data;
}
