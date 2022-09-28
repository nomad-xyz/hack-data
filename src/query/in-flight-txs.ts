// import { write } from "../utils";
import fetch from 'cross-fetch';
// const WRITE_PATH = './data/recovery/in_flight.json';

async function fetchGraphQL(operationsDoc: string, operationName: string, variables: object) {
  const result = await fetch(
    "https://api.goldsky.io/c/nomad/gql/v1/graphql",
    {
      method: "POST",
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );

  return await result.json();
}

const operationsDoc = `
  query MyQuery {
    unprocessed_dispatch(order_by: {token_body: asc}, where: {timestamp: {_gt: "1656633600"}}) {
      token_body
      action_body
      action_amount
      transaction_hash
      origin_domain_id
      token_domain
      token_id
      destination_domain_id
      timestamp
    }
  }
`;

function fetchMyQuery() {
  return fetchGraphQL(
    operationsDoc,
    "MyQuery",
    {}
  );
}

async function startFetchMyQuery() {
  const data = await fetchMyQuery();

  // if (errors) {
  //   // handle those errors like a pro
  //   console.error(errors);
  // }

  // do something great with this precious data
  console.log(data);
  // write(data, WRITE_PATH);
}

startFetchMyQuery();