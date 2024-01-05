import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Autocomplete, Button, Fab, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import { CreatePoolArgs } from "@allo-team/allo-v2-sdk/dist/Allo/types";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import { StrategyType } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import GlobalContext from '@/hooks/context/ContextAggregator';
import { useNetwork } from 'wagmi';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CircleIcon from '@mui/icons-material/Circle';
import { ethers } from 'ethers'
import {
  getWalletClient,
  sendTransaction,
  waitForTransaction,
} from "@wagmi/core";
import { green, red } from '@mui/material/colors';

const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
  {
    label: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { label: 'The Good, the Bad and the Ugly', year: 1966 },
  { label: 'Fight Club', year: 1999 },
  {
    label: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    label: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { label: 'Forrest Gump', year: 1994 },
  { label: 'Inception', year: 2010 },
  {
    label: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { label: 'Goodfellas', year: 1990 },
  { label: 'The Matrix', year: 1999 },
  { label: 'Seven Samurai', year: 1954 },
  {
    label: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { label: 'City of God', year: 2002 },
  { label: 'Se7en', year: 1995 },
  { label: 'The Silence of the Lambs', year: 1991 },
  { label: "It's a Wonderful Life", year: 1946 },
  { label: 'Life Is Beautiful', year: 1997 },
  { label: 'The Usual Suspects', year: 1995 },
  { label: 'Léon: The Professional', year: 1994 },
  { label: 'Spirited Away', year: 2001 },
  { label: 'Saving Private Ryan', year: 1998 },
  { label: 'Once Upon a Time in the West', year: 1968 },
  { label: 'American History X', year: 1998 },
  { label: 'Interstellar', year: 2014 },
  { label: 'Casablanca', year: 1942 },
  { label: 'City Lights', year: 1931 },
  { label: 'Psycho', year: 1960 },
  { label: 'The Green Mile', year: 1999 },
  { label: 'The Intouchables', year: 2011 },
  { label: 'Modern Times', year: 1936 },
  { label: 'Raiders of the Lost Ark', year: 1981 },
  { label: 'Rear Window', year: 1954 },
  { label: 'The Pianist', year: 2002 },
  { label: 'The Departed', year: 2006 },
  { label: 'Terminator 2: Judgment Day', year: 1991 },
  { label: 'Back to the Future', year: 1985 },
  { label: 'Whiplash', year: 2014 },
  { label: 'Gladiator', year: 2000 },
  { label: 'Memento', year: 2000 },
  { label: 'The Prestige', year: 2006 },
  { label: 'The Lion King', year: 1994 },
  { label: 'Apocalypse Now', year: 1979 },
  { label: 'Alien', year: 1979 },
  { label: 'Sunset Boulevard', year: 1950 },
  {
    label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    year: 1964,
  },
  { label: 'The Great Dictator', year: 1940 },
  { label: 'Cinema Paradiso', year: 1988 },
  { label: 'The Lives of Others', year: 2006 },
  { label: 'Grave of the Fireflies', year: 1988 },
  { label: 'Paths of Glory', year: 1957 },
  { label: 'Django Unchained', year: 2012 },
  { label: 'The Shining', year: 1980 },
  { label: 'WALL·E', year: 2008 },
  { label: 'American Beauty', year: 1999 },
  { label: 'The Dark Knight Rises', year: 2012 },
  { label: 'Princess Mononoke', year: 1997 },
  { label: 'Aliens', year: 1986 },
  { label: 'Oldboy', year: 2003 },
  { label: 'Once Upon a Time in America', year: 1984 },
  { label: 'Witness for the Prosecution', year: 1957 },
  { label: 'Das Boot', year: 1981 },
  { label: 'Citizen Kane', year: 1941 },
  { label: 'North by Northwest', year: 1959 },
  { label: 'Vertigo', year: 1958 },
  {
    label: 'Star Wars: Episode VI - Return of the Jedi',
    year: 1983,
  },
  { label: 'Reservoir Dogs', year: 1992 },
  { label: 'Braveheart', year: 1995 },
  { label: 'M', year: 1931 },
  { label: 'Requiem for a Dream', year: 2000 },
  { label: 'Amélie', year: 2001 },
  { label: 'A Clockwork Orange', year: 1971 },
  { label: 'Like Stars on Earth', year: 2007 },
  { label: 'Taxi Driver', year: 1976 },
  { label: 'Lawrence of Arabia', year: 1962 },
  { label: 'Double Indemnity', year: 1944 },
  {
    label: 'Eternal Sunshine of the Spotless Mind',
    year: 2004,
  },
  { label: 'Amadeus', year: 1984 },
  { label: 'To Kill a Mockingbird', year: 1962 },
  { label: 'Toy Story 3', year: 2010 },
  { label: 'Logan', year: 2017 },
  { label: 'Full Metal Jacket', year: 1987 },
  { label: 'Dangal', year: 2016 },
  { label: 'The Sting', year: 1973 },
  { label: '2001: A Space Odyssey', year: 1968 },
  { label: "Singin' in the Rain", year: 1952 },
  { label: 'Toy Story', year: 1995 },
  { label: 'Bicycle Thieves', year: 1948 },
  { label: 'The Kid', year: 1921 },
  { label: 'Inglourious Basterds', year: 2009 },
  { label: 'Snatch', year: 2000 },
  { label: '3 Idiots', year: 2009 },
  { label: 'Monty Python and the Holy Grail', year: 1975 },
];

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

  const handleCreatePool = async () => {
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
    <Box sx={{
      width: 'auto', minWidth: '100%', gap: '18px', justifyContent: 'flex-start',
      display: 'flex', flexDirection: 'column', flex: 1, padding: '12px', overflow: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <Autocomplete
          id="combo-box-demo"
          disableClearable
          options={top100Films}
          color="secondary"
          sx={{ width: { xs: '100%', sm: '260px' }, textAlign: 'left' }}
          renderInput={(params) => <TextField {...params} label="Pool" color="secondary" />}
        />
        <Button variant="contained"
          sx={{ paddingLeft: '8px', fontSize: '1rem', width: { xs: '100%', sm: '260px' } }} endIcon={<AddIcon sx={{ fill: '#fff', cursor: 'pointer' }}
          />}>
          Create new pool
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          id="standard-read-only-input"
          color='secondary'
          sx={{ textAlign: 'left', border: 'none' }}
          value={'Pool 108'}
          InputProps={{
            readOnly: true,
            disabled: true,
            disableUnderline: true,
            sx: {
              fontSize: '1.5rem',
              color: 'rgba(0, 0, 0, 0.6)'
            }
          }}
          variant="standard"
        />
        <Typography sx={{ color: green[300], fontWeight: 'bold', fontSize: '1.5rem' }}>ACTIVE</Typography>
      </div>
      <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', width: '100%' }}>
        <TextField
          id="standard-read-only-input"
          label="Strategy type"
          color='secondary'
          sx={{ flex: '1 0 auto', minWidth: '200px' }}
          value={'Manual'}
          InputProps={{
            readOnly: true,
            disabled: true
          }}
          variant="standard"
        >
        </TextField>
        <TextField
          id="standard-read-only-input"
          label="Website"
          color='secondary'
          sx={{ flex: '1 0 auto', minWidth: '200px' }}
          value={'link'}
          InputProps={{
            readOnly: true,
            disabled: true,
          }}
          variant="standard"
        >
        </TextField>
        <TextField
          id="standard-read-only-input"
          label={'Profile ID'}
          color='secondary'
          sx={{ flex: '1 0 auto', minWidth: '200px' }}
          value={'string'}
          InputProps={{
            readOnly: true,
            disabled: true,
          }}
          variant="standard"
        />
      </div>
      <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', width: '100%' }}>
        <TextField
          id="standard-read-only-input"
          label={'Pool amount'}
          color='secondary'
          sx={{ flex: '1 0 auto', minWidth: '200px' }}
          value={'number'}
          InputProps={{
            readOnly: true,
            disabled: true,
          }}
          variant="standard"
        />
        <TextField
          id="standard-read-only-input"
          label={'Max. allocation '}
          color='secondary'
          sx={{ flex: '1 0 auto', minWidth: '200px' }}
          value={'number'}
          InputProps={{
            readOnly: true,
            disabled: true,
          }}
          variant="standard"
        />
        <TextField
          id="standard-read-only-input"
          label={'Threshold'}
          color='secondary'
          sx={{ flex: '1 0 auto', minWidth: '200px' }}
          value={'number'}
          InputProps={{
            readOnly: true,
            disabled: true,
          }}
          variant="standard"
        />
      </div>

      <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', width: '100%' }}>
        <TextField
          id="standard-read-only-input"
          label={'Applications'}
          color='secondary'
          sx={{ flex: '1 0 auto', minWidth: '200px' }}
          value={'number'}
          InputProps={{
            readOnly: true,
            disabled: true,
          }}
          variant="standard"
        />
        <TextField
          id="standard-read-only-input"
          label={'Profile req.'}
          color='secondary'
          sx={{ flex: '1 0 auto', minWidth: '200px' }}
          value={'number'}
          InputProps={{
            readOnly: true,
            disabled: true,
          }}
          variant="standard"
        />
        <TextField
          id="standard-read-only-input"
          label={'Start date'}
          color='secondary'
          sx={{ flex: '1 0 auto', minWidth: '200px' }}
          value={'number'}
          InputProps={{
            readOnly: true,
            disabled: true,
          }}
          variant="standard"
        />
      </div>
    </Box>
  );
}