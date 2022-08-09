declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MOONBEAM_RPC: string;
      ETHEREUM_RPC: string;
      EVMOS_RPC: string;
      MILKOMEDA_RPC: string;
      AVALANCHE_RPC: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}