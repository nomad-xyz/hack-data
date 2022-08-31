# Nomad Hack Data

## About

This repo contains data pertaining to the Nomad Bridge Hack on August 1, 2022. Nomad and community members alike can leverage this repo to perform data analysis.

## Returning Funds

White hat hackers can [return funds](https://twitter.com/nomadxyz_/status/1555293965049630722?s=20&t=Nt0m6LlfkhDGkin62-HqgQ) to the [Official Nomad Recovery Address](https://etherscan.io/address/0x94A84433101A10aEda762968f6995c574D1bF154). Contact recovery@nomad.xyz with any questions.

## Repo Layout

### Data
- `data`: raw data which can be analyzed to produce insights on the Nomad hack
  - `data/hack/`: transactions from the hack & events emitted within them
  - `data/nomad/`: lifecycle events of Nomad messages, used to identify transactions from the hack
  - `data/recovery/`: ERC20 transfer events and token amounts sent into the Official Nomad Recovery Address
  - `data/white_hats_as_of_<date>.json`: all white hat addresses as identified by TRM Labs

### Analysis
- `analysis`: aggregate data compiled by analyzing raw `data` to gain insights to the hack
  - `analysis/hack/`: aggregate data about transactions, tokens, and token recipients involved in the hack

### Source Code
- `src`: scripts & code used to query data and perform analysis
  - `src/analyze/`:  scripts to aggregate insights from raw data
  - `src/query/`: scripts to query external services to compile raw data
