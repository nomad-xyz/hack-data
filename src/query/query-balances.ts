import { BigNumber, ethers } from 'ethers';
import { BridgeToken__factory } from '@nomad-xyz/contracts-bridge';
import {
  BLOCK_BEFORE_HACK,
  BRIDGE_ROUTER_ADDR,
  RECOVERY_ADDR,
  Token,
  TOKENS,
  write,
} from '../utils';
import dotenv from 'dotenv';
dotenv.config();
const { ETHEREUM_RPC } = process.env;

const WRITE_PATH = './data/recovery/tokens.json';

type TokenBalances = { [key: string]: { balance: string } };
type Recovered = {
  balance: string;
  recovered: string;
  percentRecovered: number | undefined;
};
type BalancesRecovered = { [key: string]: Recovered };

/**
 * Loops through a token list to retrieve balances for a given wallet
 * @param {*} tokenList array of tokens with address, symbol, decimals and name
 * @param {*} wallet address to query balance from
 * @param {*} block block number to query past balances
 * @returns Array of balances
 */
const getAllTokenBalances = async (
  addr: string,
  tokenList: Token[],
  block: number,
) => {
  // array to store balances
  const results: TokenBalances = {};
  if (!ETHEREUM_RPC) {
    throw new Error('Missing ETHEREUM_RPC in .env');
  }
  const provider = new ethers.providers.StaticJsonRpcProvider(ETHEREUM_RPC);
  for (const tkn of tokenList) {
    // create ERC20 token contract instance
    const erc20 = new ethers.Contract(
      tkn.address,
      BridgeToken__factory.abi,
      provider,
    );
    // get balance at block height
    const balance = await erc20.balanceOf(addr, {
      blockTag: +block,
    });
    results[tkn.symbol] = {
      balance: balance.toString(),
    };
  }
  console.log(results);
  return results;
};

const getReturnedTokenBalances = async (
  addr: string,
  tokenList: Token[],
  balances: TokenBalances,
) => {
  // array to store balances
  const results: BalancesRecovered = {};
  if (!ETHEREUM_RPC) {
    throw new Error('Missing ETHEREUM_RPC in .env');
  }
  const provider = new ethers.providers.StaticJsonRpcProvider(ETHEREUM_RPC);
  for (const tkn of tokenList) {
    // create ERC20 token contract instance
    const erc20 = new ethers.Contract(
      tkn.address,
      BridgeToken__factory.abi,
      provider,
    );
    const recovered = await erc20.balanceOf(addr);
    const prevBalance = BigNumber.from(balances[tkn.symbol].balance);

    // get recovered percentage
    let percentRecovered;
    if (!prevBalance.isZero()) {
      percentRecovered = Math.floor(
        recovered.mul(100).div(prevBalance).toNumber(),
      );
    }

    // format previous balance and recovered balance
    const formattedBalance = ethers.utils.formatUnits(
      prevBalance.toString(),
      tkn.decimals,
    );
    const formattedRecovered = ethers.utils.formatUnits(
      recovered.toString(),
      tkn.decimals,
    );

    // push to results
    results[tkn.symbol] = {
      balance: formattedBalance,
      recovered: formattedRecovered,
      percentRecovered,
    };
  }
  write(results, WRITE_PATH);
  return results;
};

async function run() {
  console.log('begin query');
  const balances = await getAllTokenBalances(
    BRIDGE_ROUTER_ADDR,
    TOKENS,
    BLOCK_BEFORE_HACK,
  );
  await getReturnedTokenBalances(RECOVERY_ADDR, TOKENS, balances);
  console.log('complete\n');
  process.exit();
}

run();
