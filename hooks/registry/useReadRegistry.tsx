import GlobalContext from '../context/ContextAggregator';
import { Profile } from '@allo-team/allo-v2-sdk/dist/Registry/types'
import { HasRoleArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { ProfileAndAddressArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import React from 'react';

// Read Functions of Registry.sol

// To retrieve the Allo Owner
export const alloOwner  = async() =>{
    const { registry } = React.useContext(GlobalContext)
    if (!registry) {
        throw new Error('Registry is not initialized');
    }

    const alloOwner = await registry.getAlloOwner();
    return alloOwner;
}

// To get the Default Admin Role
export const defaultAdminRole  = async() =>{
    const { registry } = React.useContext(GlobalContext)
    if (!registry) {
        throw new Error('Registry is not initialized');
    }

    const defaultAdminRole = await registry.getDefaultAdminRole();
    return defaultAdminRole;
}

// To obtain the Native
export const native  = async() =>{
    const { registry } = React.useContext(GlobalContext)
    if (!registry) {
        throw new Error('Registry is not initialized');
    }

    const native = await registry.getNative();
    return native;
}

// To retrieve the Profile ID associated with an Anchor
export const profileIdOfAnchor  = async(anchor: string) =>{
    const { registry } = React.useContext(GlobalContext)
    if (!registry) {
        throw new Error('Registry is not initialized');
    }

    const profileIdOfAnchor = await registry.getAnchorToProfileId(anchor);
    return profileIdOfAnchor;
}

// To fetch a Profile using an Anchor
export const profileByAnchor  = async(anchor: string) =>{
    const { registry } = React.useContext(GlobalContext)
    if (!registry) {
        throw new Error('Registry is not initialized');
    }

    const profileByAnchor: Profile = await registry.getProfileByAnchor(anchor);
    return profileByAnchor;
}

// To retrieve a Profile using its ID
export const profileById  = async(profileId: string) =>{
    const { registry } = React.useContext(GlobalContext)
    if (!registry) {
        throw new Error('Registry is not initialized');
    }

    const profileById: Profile = await registry.getProfileById(profileId);
    return profileById;
}

// To get the admin of a specified role
export const roleAdmin  = async(role: string) =>{
    const { registry } = React.useContext(GlobalContext)
    if (!registry) {
        throw new Error('Registry is not initialized');
    }

    const roleAdmin = await registry.getRoleAdmin(role);
    return roleAdmin;
}

// To check if an account has a specific role
export const hasRole = async(hasRoleArgs: HasRoleArgs): Promise<boolean> =>{
    const { registry } = React.useContext(GlobalContext)
    if (!registry) {
        throw new Error('Registry is not initialized');
    }

    const hasRole: boolean = await registry.hasRole(hasRoleArgs);
    return hasRole;
}

// To check if an account is a member of a profile
export const isProfileMember = async(profileAndAddressArgs: ProfileAndAddressArgs): Promise<boolean> =>{
    const { registry } = React.useContext(GlobalContext)
    if (!registry) {
        throw new Error('Registry is not initialized');
    }

    const isProfileMember: boolean = await registry.isMemberOfProfile(profileAndAddressArgs);
    return isProfileMember;
}

// To check if an account is the owner of a profile
export const isProfileOwner = async(profileAndAddressArgs: ProfileAndAddressArgs): Promise<boolean> =>{
    const { registry } = React.useContext(GlobalContext)
    if (!registry) {
        throw new Error('Registry is not initialized');
    }

    const isProfileOwner: boolean = await registry.isOwnerOfProfile(profileAndAddressArgs);
    return isProfileOwner;
}

// To check if an account is either the owner or a member of a profile
export const IsProfileMemberOrOwner = async(profileAndAddressArgs: ProfileAndAddressArgs): Promise<boolean> =>{
    const { registry } = React.useContext(GlobalContext)
    if (!registry) {
        throw new Error('Registry is not initialized');
    }

    const isProfileMemberOrOwner: boolean = await registry.isOwnerOrMemberOfProfile(profileAndAddressArgs);
    return isProfileMemberOrOwner;
}

// To get the pending owner of a profile
export const pendingProfileOwner = async(pendingOwner: string) =>{
    const { registry } = React.useContext(GlobalContext)
    if (!registry) {
        throw new Error('Registry is not initialized');
    }

    const pendingProfileOwner: string = await registry.profileIdToPendingOwner(pendingOwner);
    return pendingProfileOwner;
}

// To get profile details by ID
export const profileDetailsById = async(profileId: string) =>{
    const { registry } = React.useContext(GlobalContext)
    if (!registry) {
        throw new Error('Registry is not initialized');
    }

    const profileDetailsById: Profile = await registry.getProfileById(profileId);
    return profileDetailsById;
}