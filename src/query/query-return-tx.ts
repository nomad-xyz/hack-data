import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const { ETHERSCAN_API_KEY } = process.env;

import { BLOCK_BEFORE_HACK, RECOVERY_ADDR, write } from '../utils';
const END_BLOCK = 15302000;

const endpoint = `https://api.etherscan.io/api?module=account&action=tokentx&address=${RECOVERY_ADDR}&startblock=${BLOCK_BEFORE_HACK}&endblock=${END_BLOCK}&sort=asc&apikey=${ETHERSCAN_API_KEY!}`;
const WRITE_PATH = './data/recovery/transfer_events.json';

async function getData() {
  if (!ETHERSCAN_API_KEY) {
    throw new Error('Missing ETHERSCAN_API_KEY in .env');
  }
  console.log('querying...');
  // query endpoint
  const res = await axios.get(endpoint);
  console.log(res.data.result[0]);
  // write data to file
  const data = res.data.result;
  write(data, WRITE_PATH);
  // done
  console.log('done');
  process.exit();
}

getData();
