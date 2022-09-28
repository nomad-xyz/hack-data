import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { read, write, fromBytes32, TOKENS } from '../utils';

const READ_PATH = './data/recovery/in_flight_recent.json';
const WRITE_PATH = './analysis/hack/in_flight.json';

type Tx = {
  token_body: string;
  action_body: string;
  action_amount: string;
  transaction_hash: string;
  origin_domain_id: number;
  token_domain: string;
  token_id: string;
  destination_domain_id: number;
  timestamp: string;
}

async function run() {
  const { data } = read(READ_PATH);
  const inFlight: Tx[] = data.unprocessed_dispatch;

  console.log(inFlight.length, 'in flight transactions');

  const txsByToken: any = {};
  const tokenData: any = {};
  inFlight.forEach(t => {
    // if the origin domain and the token domain match, it is an asset native to the origin chain and will mint on the destination
    const mintNewAsset = t.origin_domain_id.toString() === t.token_domain;
    if (mintNewAsset) {
      const token_address = fromBytes32(t.token_id);
      if (!txsByToken[token_address]) {
        txsByToken[token_address] = [];
      }
      txsByToken[token_address].push(t.action_amount);
    }
  });
  console.log(Object.keys(txsByToken).length, 'different tokens');

  Object.keys(txsByToken).forEach(t => {
    const token = TOKENS.find(tkn => tkn.address === t);
    if (!tokenData[t]) {
      tokenData[t] = {};
    }
    tokenData[t].numTxs = txsByToken[t].length;

    const total = txsByToken[t].reduce((a: string, b: string) => BigNumber.from(a).add(BigNumber.from(b)));
    if (token) {
      tokenData[t].total = formatUnits(total, token.decimals);
      tokenData[t].tokenData = token;
    } else {
      tokenData[t].total = total.toString();
    }
  });
  console.log(tokenData);
  write(tokenData, WRITE_PATH);

  console.log('complete\n');
  process.exit();
}

run();
