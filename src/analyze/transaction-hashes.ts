import { read, write } from '../utils';

const READ_PATH = './data/hack/receive_events.json';
const WRITE_BY_ADDR = './analysis/hack/transaction_hashes_by_addr.json';
const WRITE_HASHES = './analysis/hack/transaction_hashes.json';

async function run() {
  const receiveEvents: any[] = read(READ_PATH);

  const hashes: string[] = [];
  const hashesByAddr: any = {};

  for (const event of receiveEvents) {
    const { tokenRecipient, transactionHash } = event;

    // push to list of all unique transaction hashes
    if (!hashes.includes(transactionHash)) {
      hashes.push(transactionHash);
    }

    // push to list of transaction hashes by address
    if (hashesByAddr[tokenRecipient]) {
      if (!hashesByAddr[tokenRecipient].includes[transactionHash]) {
        hashesByAddr[tokenRecipient].push(transactionHash);
      }
    } else {
      hashesByAddr[tokenRecipient] = [transactionHash];
    }
  }

  write(hashes, WRITE_HASHES);
  write(hashesByAddr, WRITE_BY_ADDR);

  console.log('complete\n');
  process.exit();
}

run();
