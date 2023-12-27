import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Paper, Typography } from '@mui/material';

export default function Pool() {
  const [value, setValue] = React.useState('one');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

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