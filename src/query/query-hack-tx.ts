import { NomadContext } from '@nomad-xyz/sdk';
import * as core from '@nomad-xyz/contracts-core';
import * as bridge from '@nomad-xyz/contracts-bridge';
import { LogDescription } from 'ethers/lib/utils';
import { read, write } from '../utils';
import { init } from '../utils';

let context: NomadContext;

const READ_PATH = './data/hack/process_events.json';
const WRITE_PATH = './data/hack/transactions.json';

async function getData() {
  const data = read(READ_PATH);

  const parsedData: any[] = [];
  for (let i = 0; i < data.length; i += 1) {
    const tx = data[i];
    const provider = context.mustGetProvider(tx.emittedAt);
    const receipt = await provider.getTransactionReceipt(tx.transactionHash);
    if (!receipt) {
      throw new Error(
        `No receipt for ${tx.transactionHash} on ${tx.emittedAt}`,
      );
    }
    tx.to = receipt.to;
    tx.sender = receipt.from;
    const replica = core.Replica__factory.createInterface();
    console.log(receipt);
    const processEvents: LogDescription[] = [];
    const transferEvents: LogDescription[] = [];
    const receiveEvents: LogDescription[] = [];
    for (const log of receipt.logs) {
      try {
        const parsed = replica.parseLog(log);
        if (parsed.name === 'Process') {
          processEvents.push(parsed);
        }
      } catch (_) {
        console.log('not process event');
      }
      try {
        const bridgeToken = bridge.BridgeToken__factory.createInterface();
        const parsed = bridgeToken.parseLog(log);
        console.log(parsed);
        if (parsed.name === 'Transfer') {
          if (
            parsed.args.from === '0x88a69b4e698a4b090df6cf5bd7b2d47325ad30a3'
          ) {
            transferEvents.push(parsed);
          }
        }
      } catch (_) {
        console.log('not transfer event');
      }
      try {
        const bridgeRouter = bridge.BridgeRouter__factory.createInterface();
        const parsed = bridgeRouter.parseLog(log);
        if (parsed.name === 'Receive') {
          receiveEvents.push(parsed);
        }
      } catch (_) {
        console.log('not receive event');
      }
    }
    tx.processEvents = processEvents;
    tx.transferEvents = transferEvents;
    tx.receiveEvents = receiveEvents;
    parsedData.push(tx);
  }
  write(parsedData, WRITE_PATH);
  return;
}

async function run() {
  context = await init();
  console.log('begin query');
  await getData();
  console.log('complete\n');
  process.exit();
}
run();
