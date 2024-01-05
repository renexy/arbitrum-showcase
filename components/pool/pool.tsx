import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Button, Paper, Typography } from '@mui/material';
import { CreatePoolArgs } from "@allo-team/allo-v2-sdk/dist/Allo/types";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import { StrategyType } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import GlobalContext from '@/hooks/context/ContextAggregator';
import { useNetwork } from 'wagmi';
import { ethers } from 'ethers'
import {
  getWalletClient,
  sendTransaction,
  waitForTransaction,
} from "@wagmi/core";

export default function Pool() {
  const [value, setValue] = React.useState('one');
  const { allo, microStrategy, signer, provider } = React.useContext(GlobalContext)
  const { chain } = useNetwork();

  const [deployedMicroGrantsStrategy, setDeployedMicroGrantsStrategy] = React.useState<String | null>("");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleDeployMicroGrantStrategy = async () => {

    const strategyType = StrategyType.MicroGrants;
    const deployParams = microStrategy?.getDeployParams(strategyType);

    if (!deployParams) {
      console.log("deployParams not found")
      return;
    }

    const walletClient = await getWalletClient({ chainId: chain?.id });
    
    try {
      //setCreateProfileTransactionStatus('signature'); // State set to 'signature' for user to sign

      const hash = await walletClient!.deployContract({
        abi: deployParams.abi,
        bytecode: deployParams.bytecode as `0x${string}`,
        args: [],
        gas: BigInt(2000000)
      });

      //setCreateProfileTransactionStatus('transaction'); // State set to 'transaction' after signing

      // Listening to the transaction
      try {
          const result = await waitForTransaction({ hash: hash, chainId: chain?.id });
          //setCreateProfileTransactionStatus('succeeded'); // Transaction succeeded
          setDeployedMicroGrantsStrategy(result?.contractAddress! || '')
          console.log("transaction succeeded", result?.contractAddress!)
      } catch (error) {
          console.error(error);
          //setCreateProfileTransactionStatus('failed'); // Transaction failed with an error
      }

    } catch (error) {
        console.log("user rejected", error); // User rejected the signature
        //setCreateProfileTransactionStatus('failed'); // Setting status to 'failed' as the process did not complete
    }
  }

  const handleCreatePool = async() => {
    const startDateInSeconds = Math.floor(new Date().getTime() / 1000) + 300;
    const endDateInSeconds = Math.floor(new Date().getTime() / 1000) + 10000;

    const initParams: any = {
      useRegistryAnchor: true,
      allocationStartTime: BigInt(startDateInSeconds),
      allocationEndTime: BigInt(endDateInSeconds),
      approvalThreshold: BigInt(1),
      maxRequestedAmount: BigInt(1e14),
    };

    const NATIVE =
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase();

    const initStrategyData = await microStrategy?.getInitializeData(initParams)

    console.log("x", initStrategyData)


    const createPoolArgs: CreatePoolArgs = {
      profileId: "0xebbcdfd805ded94bd2ed5a5a3293d775a6da49db1e9b1afed50df9a30c8a307c", // sender must be a profile member 
      strategy: "0xb3af05b23a376c3b9564df3c815b4361d30892ed", // approved strategy contract
      initStrategyData: initStrategyData || '', // unique to the strategy
      token: NATIVE,
      amount: BigInt(1e2),
      metadata: {
        protocol: BigInt(1),
        pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
      },
      managers: ["0x368731AE2E23e72751C432A935A2CF686Bb72AAC"],
    };

    try {
      //setCreateProfileTransactionStatus('signature'); // State set to 'signature' for user to sign

      if (!allo) {
        return;
      }

      if (!signer) {
        return;
      }

      if (!provider) {
        return;
      }
      
      const txData: TransactionData = allo.createPoolWithCustomStrategy(createPoolArgs);

      const hash = await sendTransaction({
        data: txData.data,
        to: txData.to,
        value: BigInt(txData.value),
      });

      //setCreateProfileTransactionStatus('transaction'); // State set to 'transaction' after signing

      // Listening to the transaction
      try {
          const result = await waitForTransaction({ hash: hash.hash, chainId: chain?.id });
          console.log("transaction succeeded", result)
      } catch (error) {
          console.error("transaction failed", error);
          //setCreateProfileTransactionStatus('failed'); // Transaction failed with an error
      }

    } catch (error) {
        console.log("user rejected", error); // User rejected the signature
        //setCreateProfileTransactionStatus('failed'); // Setting status to 'failed' as the process did not complete
    }
  }

  return (
    <Box sx={{ width: '100%', gap: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        <Tab value="one" label="Read-only" />
        <Tab value="two" label="Write" />
      </Tabs>

      <Button onClick={() => {handleDeployMicroGrantStrategy()}}>Deploy Strategy</Button>
      <Button onClick={() => {handleCreatePool()}}>Create Pool</Button>

      <Paper square={false} elevation={3} sx={{
        padding: '12px', display: "flex", justifyContent: "center", flexDirection: "column",
        alignItems: "flex-start", gap: "20px"
      }}>
        <Typography
          variant="inherit"
          noWrap
          component="a"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 400
          }}
        >

          Session Keys <br />
          Session keys in Web3 enhance security by<br /> allowing limited transaction permissions<br /> without exposing main private keys,
          reducing the risk of key compromise <br />in the decentralized ecosystem.<br />
          Session keys in Web3 can be effectively used in various sectors:<br />
          Gaming: Secure asset management.<br />
          DeFi: Safe transaction delegation.<br />
          NFT Marketplaces: Controlled marketplace interaction.<br />
          DAOs: Governance participation security.
        </Typography>
      </Paper>
    </Box>
  );
}