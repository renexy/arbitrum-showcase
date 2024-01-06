import * as React from 'react';
import Box from '@mui/material/Box';
import { Alert, Breadcrumbs, Button, Checkbox, FormControlLabel, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemText, MenuItem, Paper, Select, Snackbar, TextField, Tooltip, Typography, styled } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { blueGrey } from '@mui/material/colors';
import BaseDialog from '../baseDialog/baseDialog';
import { useState, useEffect } from 'react'
import { TransactionData } from '@allo-team/allo-v2-sdk/dist/Common/types';
import { useContext } from "react";
import GlobalContext from '../../hooks/context/ContextAggregator';
import { CreateProfileArgs } from '@allo-team/allo-v2-sdk/dist/Registry/types';
import InfoIcon from '@mui/icons-material/Info';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Link from '@mui/material/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ethers } from 'ethers'
import {
  getWalletClient,
  sendTransaction,
  waitForTransaction,
} from "@wagmi/core";
import { StrategyType } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import { useNetwork } from 'wagmi';
import { CreatePoolArgs } from '@allo-team/allo-v2-sdk/dist/Allo/types';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function CreatePool({ changeCreatePool }: any) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [createPoolTransactionStatus, setCreatePoolTransactionStatus] =
      useState<'confirm' | 'signature' | 'transaction' | 'succeeded' | 'failed'>('confirm')
  // form
  const [strategyType, setStrategyType] = useState<'Manual' | 'Governance token' | 'Hats protocol'>('Manual')
  const [poolName, setPoolName] = useState<string>('')
  const [website, setWebsite] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [poolTokenAddress, setPoolTokenAddress] = useState<string>('')
  const [fundPoolAmount, setFundPoolAmount] = useState<string>('')
  const [maxGrantAmount, setMaxGrantAmount] = useState<string>('')
  const [approvalThreshold, setApprovalThreshold] = useState<number>(1)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stateRegistryMandatory, setStateRegistryMandatory] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { allo, microStrategy, signer, provider } = React.useContext(GlobalContext)
  const { chain } = useNetwork();
  
  const [deployedMicroGrantsStrategy, setDeployedMicroGrantsStrategy] = React.useState<String | null>("");

  const handleFileChange = (event: any) => {
      const file = event.target.files[0];
      // Check if the selected file is a PNG or JPG
      if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
          setSelectedFile(file);
      } else {
          alert('Please select a PNG or JPG file.');
      }
  };

  const handleApprovalThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
          setApprovalThreshold(value);
      } else {
          // Handle the case where the input is not a valid number
      }
  };

  /*const handleCreatePool = () => {
      // make sure u do if checks for all fields
      setCreatePoolTransactionStatus('signature');
      setCreatePoolTransactionStatus('transaction');
      setCreatePoolTransactionStatus('succeeded');
  }*/

  
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

  const CustomLabel = ({ text, tooltipText }: any) => {
      return (
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
              {text}
              <Tooltip title={tooltipText} sx={{ textAlign: "center" }}>
                  <InfoIcon sx={{ fill: '#607d8b', cursor: 'pointer', paddingLeft: '4px' }} />
              </Tooltip>
          </Typography>
      );
  };
  return (
      <Box sx={{
          width: 'auto', minWidth: '50%', gap: '24px', justifyContent: 'flex-start', alignItems: 'center',
          display: 'flex', flexDirection: 'column', flex: 1
      }}>
          <Button size="medium" sx={{ alignSelf: 'flex-start' }}
              onClick={() => { changeCreatePool() }}
              endIcon={<ArrowBackIcon sx={{ fill: '#fff', cursor: 'pointer' }} />}>
              Back
          </Button>
          <Typography variant="h5">Create pool</Typography>
          <TextField
              variant="outlined"
              color="secondary"
              value={strategyType}
              size="medium"
              onChange={(e: any) => { setStrategyType(e.target.value) }}
              select
              sx={{ width: { xs: '100%', sm: '350px' } }}
              label="Strategy type"
              InputLabelProps={{
                  shrink: true
              }}
          >
              <MenuItem key={'manual'} value="Manual">
                  Manual
              </MenuItem>
              <MenuItem key={'governance token'} value="Governance token" disabled>
                  Governance token
              </MenuItem>
              <MenuItem key={'hats protocol'} value="Hats protocol" disabled>
                  Hats protocol
              </MenuItem>
          </TextField>
          <TextField
              variant="outlined"
              color="secondary"
              size="medium"
              placeholder='Gitcoin Micro Grants'
              value={poolName}
              onChange={(e: any) => { setPoolName(e.target.value) }}
              sx={{ width: { xs: '100%', sm: '350px' } }}
              label="Pool name"
              InputLabelProps={{
                  shrink: true
              }}
          >
          </TextField>
          <TextField
              variant="outlined"
              color="secondary"
              size="medium"
              placeholder='https://www.website.com'
              value={website}
              onChange={(e: any) => { setWebsite(e.target.value) }}
              sx={{ width: { xs: '100%', sm: '350px' } }}
              label="Website"
              InputLabelProps={{
                  shrink: true
              }}
          >
          </TextField>
          <TextField
              variant="outlined"
              color="secondary"
              size="medium"
              multiline
              rows={4}
              placeholder='Description'
              value={description}
              onChange={(e: any) => { setDescription(e.target.value) }}
              sx={{ width: { xs: '100%', sm: '350px' } }}
              label="Description"
              InputLabelProps={{
                  shrink: true
              }}
          >
          </TextField>
          <TextField
              variant="outlined"
              color="secondary"
              size="medium"
              placeholder='Pool token address'
              value={poolTokenAddress}
              onChange={(e: any) => { setPoolTokenAddress(e.target.value) }}
              sx={{ width: { xs: '100%', sm: '350px' } }}
              label={<CustomLabel text={'Pool token address'}
                  tooltipText={'For pool funding, enter the token address. Leave blank for native currency'}></CustomLabel>}
              InputLabelProps={{
                  shrink: true
              }}
          >
          </TextField>
          <TextField
              variant="outlined"
              color="secondary"
              size="medium"
              placeholder='ETH'
              value={fundPoolAmount}
              onChange={(e: any) => { setFundPoolAmount(e.target.value) }}
              sx={{ width: { xs: '100%', sm: '350px' } }}
              label={<CustomLabel text={'Fund pool amount'} tooltipText={'The amount of tokens to fund the pool with'}></CustomLabel>}
              InputLabelProps={{
                  shrink: true
              }}
          >
          </TextField>
          <TextField
              variant="outlined"
              color="secondary"
              size="medium"
              placeholder='ETH'
              value={maxGrantAmount}
              onChange={(e: any) => { setMaxGrantAmount(e.target.value) }}
              sx={{ width: { xs: '100%', sm: '350px' } }}
              label={<CustomLabel text={'Max grant amount'} tooltipText={'The max amount that can be requested by an applicant.'}></CustomLabel>}
              InputLabelProps={{
                  shrink: true
              }}
          >
          </TextField>
          <TextField
              variant="outlined"
              color="secondary"
              type="number"
              size="medium"
              placeholder='ETH'
              value={approvalThreshold}
              onChange={handleApprovalThresholdChange}
              sx={{ width: { xs: '100%', sm: '350px' } }}
              label={'Approval threshold'}
              InputLabelProps={{
                  shrink: true
              }}
          >
          </TextField>
          <TextField
              variant="outlined"
              color="secondary"
              type="date"
              size="medium"
              sx={{ width: { xs: '100%', sm: '350px' } }}
              value={startDate}
              onChange={(e: any) => { setStartDate(e.target.value) }}
              label={'Start date'}
              InputLabelProps={{
                  shrink: true
              }}
          >
          </TextField>
          <TextField
              variant="outlined"
              color="secondary"
              type="date"
              size="medium"
              sx={{ width: { xs: '100%', sm: '350px' } }}
              value={endDate}
              onChange={(e: any) => { setEndDate(e.target.value) }}
              label={'End date'}
              InputLabelProps={{
                  shrink: true
              }}
          >
          </TextField>
          <div>
              <Typography sx={{ maxWidth: '300px' }}>Is a registry profile mandatory for applicants?</Typography>
              <FormControlLabel
                  control={
                      <Checkbox
                          checked={stateRegistryMandatory}
                          onChange={(e) => { setStateRegistryMandatory(e.target.checked) }}
                          value="yes"
                          color="secondary"
                      />
                  }
                  label="Yes"
              />
              <FormControlLabel
                  control={
                      <Checkbox
                          checked={!stateRegistryMandatory}
                          onChange={(e) => { setStateRegistryMandatory(!e.target.checked) }}
                          value="no"
                          color="secondary"
                      />
                  }
                  label="No"
              />
          </div>
          <Box>
              <label htmlFor="file-upload" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Button
                      component="span"
                      variant="contained"
                      color="secondary"
                      startIcon={<CloudUploadIcon sx={{ fill: 'white' }} />}
                  >
                      Upload file
                  </Button>
              </label>
              <input
                  id="file-upload"
                  type="file"
                  accept=".png,.jpg,.jpeg" // Accept PNG or JPG files only
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
              />
              {selectedFile && (
                  <Typography variant="body1" color="textSecondary" sx={{ paddingTop: '12px' }}>
                      Selected File: {selectedFile ? selectedFile!.name : ''}
                  </Typography>
              )}
          </Box>

          <Button
              component="span"
              variant="contained"
              color="secondary"
              size="medium"
              onClick={() => { setDialogOpen(true) }}
          >
              Create pool
          </Button>

          <BaseDialog open={dialogOpen} onClose={() => { setDialogOpen(!dialogOpen) }}
              dialogVariant={'transaction'} status={createPoolTransactionStatus} callback={() => { handleCreatePool() }}></BaseDialog>
      </Box >
  );
}