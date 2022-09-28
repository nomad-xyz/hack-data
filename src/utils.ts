import fs from 'fs';
import { NomadContext } from '@nomad-xyz/sdk';
import dotenv from 'dotenv';
dotenv.config();

const { ETHEREUM_RPC } = process.env;

// Write JSON data to a file
export function write(data: any, path: string): void {
  fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
}

// Read JSON data from a file
export function read(path: string): any {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

// instantiate Nomad Context
export async function init(): Promise<NomadContext> {
  if (!ETHEREUM_RPC) {
    throw new Error('Missing ETHEREUM_RPC in .env');
  }
  const context = await NomadContext.fetch('production');
  context.registerRpcProvider('ethereum', ETHEREUM_RPC);
  console.log('nomad context initiated');
  return context;
}

export function fromBytes32(addr: string): string {
  if (addr.length === 42) return addr;
  if (addr.length === 40) return `0x${addr}`;
  if (addr.length === 64) {
    // trim 12 bytes
    const short = addr.slice(24);
    return `0x${short}`;
  }
  if (addr.length === 66) {
    // trim 12 bytes
    const short = addr.slice(26);
    return `0x${short}`;
  }
  throw new Error('invalid address length, cannot convert to 20 bytes');
}

export function idFromTokenBody(body: string): string {
  if (body.length === 72) {
    // trim 12 bytes + 4 bytes
    const short = body.slice(32);
    return `0x${short}`;
  }
  throw new Error('invalid address length, cannot convert to 20 bytes');
}

export type Token = {
  address: string;
  symbol: string;
  decimals: number;
};
export const BRIDGE_ROUTER_ADDR = '0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3';
export const RECOVERY_ADDR = '0x94A84433101A10aEda762968f6995c574D1bF154';
export const BLOCK_BEFORE_HACK = 15259100;
export const TOKENS: Token[] = [
  {
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    symbol: 'WETH',
    decimals: 18,
  },
  {
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    symbol: 'WBTC',
    decimals: 8,
  },
  {
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    symbol: 'USDC',
    decimals: 6,
  },
  {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    symbol: 'USDT',
    decimals: 6,
  },
  {
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    symbol: 'DAI',
    decimals: 18,
  },
  {
    address: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
    symbol: 'FRAX',
    decimals: 18,
  },
  {
    address: '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
    symbol: 'FXS',
    decimals: 18,
  },
  {
    address: '0xf0dc76c22139ab22618ddfb498be1283254612b1',
    symbol: 'WSTR',
    decimals: 18,
  },
  {
    address: '0xD417144312DbF50465b1C641d016962017Ef6240',
    symbol: 'CQT',
    decimals: 18,
  },
  {
    address: '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D',
    symbol: 'renBTC',
    decimals: 8,
  },
  {
    address: '0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6',
    symbol: 'sBTC',
    decimals: 18,
  },
  {
    address: '0x18084fbA666a33d37592fA2633fD49a74DD93a88',
    symbol: 'tBTC',
    decimals: 18,
  },
  {
    address: '0x0316EB71485b0Ab14103307bf65a021042c6d380',
    symbol: 'hBTC',
    decimals: 18,
  },
  {
    address: '0xE5097D9baeAFB89f9bcB78C9290d545dB5f9e9CB',
    symbol: 'HBOT',
    decimals: 18,
  },
  {
    address: '0xd528cf2e081f72908e086f8800977df826b5a483',
    symbol: 'PBX',
    decimals: 18,
  },
  {
    address: '0xf1a91c7d44768070f711c68f33a7ca25c8d30268',
    symbol: 'C3',
    decimals: 18,
  },
  {
    address: '0x3d6f0dea3ac3c607b3998e6ce14b6350721752d9',
    symbol: 'CARDS',
    decimals: 18,
  },
  {
    address: '0x3431f91b3a388115f00c5ba9fdb899851d005fb5',
    symbol: 'GERO',
    decimals: 18,
  },
  {
    address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    symbol: 'USDC',
    decimals: 6,
  },
  {
    address: '0xacc15dc74880c9944775448304b263d191c6077f',
    symbol: 'WGLMR',
    decimals: 18,
  },
  {
    address: '0xd4949664cd82660aae99bedc034a0dea8a0bd517',
    symbol: 'WEVMOS',
    decimals: 18,
  },
];
