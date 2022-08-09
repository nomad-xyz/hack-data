import { BigNumber } from 'ethers';
import { read, write } from '../utils';

const READ_PATH = './data/hack/receive_events.json';
const WRITE_TOKENS = './analysis/hack/tokens.json';
const WRITE_TOKEN_AMOUNTS = './analysis/hack/amt_by_token.json';
const WRITE_TOKENS_BY_ADDR = './analysis/hack/amt_by_addr_and_token.json';

async function run() {
  const receiveEvents: any[] = read(READ_PATH);

  const tokens: string[] = [];
  const amountByToken: any = {};
  const amountByHackerAndToken: any = {};

  for (const event of receiveEvents) {
    const { tokenRecipient, tokenAddress, amount } = event;

    // push to list of unique tokens
    if (!tokens.includes(tokenAddress)) {
      tokens.push(tokenAddress);
    }

    // push to list of amounts by token
    if (amountByToken[tokenAddress]) {
      amountByToken[tokenAddress] = BigNumber.from(amountByToken[tokenAddress])
        .add(amount)
        .toString();
    } else {
      amountByToken[tokenAddress] = amount;
    }

    // push to list of amounts by hacker and token
    if (amountByHackerAndToken[tokenRecipient]) {
      if (amountByHackerAndToken[tokenRecipient][tokenAddress]) {
        amountByHackerAndToken[tokenRecipient][tokenAddress] = BigNumber.from(
          amountByHackerAndToken[tokenRecipient][tokenAddress],
        )
          .add(amount)
          .toString();
      } else {
        amountByHackerAndToken[tokenRecipient][tokenAddress] = amount;
      }
    } else {
      amountByHackerAndToken[tokenRecipient] = {
        [tokenAddress]: amount,
      };
    }
  }

  write(tokens, WRITE_TOKENS);
  write(amountByToken, WRITE_TOKEN_AMOUNTS);
  write(amountByHackerAndToken, WRITE_TOKENS_BY_ADDR);

  console.log('complete\n');
  process.exit();
}

run();
