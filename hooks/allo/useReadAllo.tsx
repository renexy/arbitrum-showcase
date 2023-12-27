import { Pool } from '@allo-team/allo-v2-sdk/dist/Allo/types';
import GlobalContext from '../context/ContextAggregator';
import React from 'react';

// Read Functions of Allo.sol

// To retrieve the Allo contract address
export const alloCA  = async() =>{
    const { allo } = React.useContext(GlobalContext)
    if (!allo) {
        throw new Error('Allo is not initialized');
    }

    const alloCA: `0x${string}` = allo.address();
    return alloCA;
}

// To retrieve the Fee Denominator
export const feeDenominator  = async() =>{
    const { allo } = React.useContext(GlobalContext)
    if (!allo) {
        throw new Error('Allo is not initialized');
    }

    const feeDenominator: number = await allo.getFeeDenominator();
    return feeDenominator;
}

// To check if an address is a Pool Admin
export const isPoolAdmin  = async(poolId: number, address: string) =>{
    const { allo } = React.useContext(GlobalContext)
    if (!allo) {
        throw new Error('Allo is not initialized');
    }

    const isPoolAdmin: boolean = await allo.isPoolAdmin(poolId, address);
    return isPoolAdmin;
}

// To check if an address is a Pool Admin
export const isPoolManager  = async(poolId: number, address: string) =>{
    const { allo } = React.useContext(GlobalContext)
    if (!allo) {
        throw new Error('Allo is not initialized');
    }

    const isPoolManager: boolean = await allo.isPoolManager(poolId, address);
    return isPoolManager;
}

// To retrieve the Strategy address for a specific pool
export const poolStrategyAddress  = async(poolId: number) =>{
    const { allo } = React.useContext(GlobalContext)
    if (!allo) {
        throw new Error('Allo is not initialized');
    }

    const poolStrategyAddress: string = await allo.getStrategy(poolId);
    return poolStrategyAddress;
}

// To retrieve the Percent Fee
export const percentFee  = async() =>{
    const { allo } = React.useContext(GlobalContext)
    if (!allo) {
        throw new Error('Allo is not initialized');
    }

    const percentFee: number = await allo.getPercentFee();
    return percentFee;
}

// To retrieve the Strategy address for a specific pool
export const baseFee  = async() =>{
    const { allo } = React.useContext(GlobalContext)
    if (!allo) {
        throw new Error('Allo is not initialized');
    }

    const getBaseFee: number = await allo.getBaseFee();
    return getBaseFee;
}

// To retrieve the Treasury address
export const treasuryAddress  = async() =>{
    const { allo } = React.useContext(GlobalContext)
    if (!allo) {
        throw new Error('Allo is not initialized');
    }

    const treasuryAddress: string = await allo.getTreasury();
    return treasuryAddress;
}

// To retrieve the Registry address
export const registryAddress  = async() =>{
    const { allo } = React.useContext(GlobalContext)
    if (!allo) {
        throw new Error('Allo is not initialized');
    }

    const registryAddress: string = await allo.getRegistry();
    return registryAddress;
}

// To check if the Strategy is cloneable
export const isStrategyClonable  = async() =>{
    const { allo } = React.useContext(GlobalContext)
    if (!allo) {
        throw new Error('Allo is not initialized');
    }

    const isStrategyClonable: boolean = await allo.isCloneableStrategy();
    return isStrategyClonable;
}

// To retrieve information about a specific pool
export const poolInfo  = async(poolId: number) =>{
    const { allo } = React.useContext(GlobalContext)
    if (!allo) {
        throw new Error('Allo is not initialized');
    }

    const poolInfo: Pool = await allo.getPool(poolId);
    return poolInfo;
}