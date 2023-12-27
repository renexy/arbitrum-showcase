import { createContext } from "react"
import * as React from "react"
import { useState } from "react"

const tempProfiles = ['Account 1', 'Account 2', 'Account 3', 'Account 4']

const ProfileContext = createContext({
    profiles: [''],
    profile: 'None',
    changeProfile: (profile: string) => { }
})

export const ProfileContextProvider = ({ children }: { children: any }) => {
    // todoburger u gonna load the profiles here
    // gonna be like const profiles = useHook(something)
    const profiles = tempProfiles;
    const [profile, setProfile] = useState(profiles && profiles.length > 0 ? profiles[0] : 'None')

    const changeProfile = (src: any) => {
        setProfile(src)
    }

    const context = { profiles, profile, changeProfile }

    return (
        <ProfileContext.Provider value={context}>
            {children}
        </ProfileContext.Provider>
    )
}

export default ProfileContext