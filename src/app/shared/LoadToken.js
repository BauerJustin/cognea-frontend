import React, { useEffect } from 'react'
import { useMsal } from '@azure/msal-react';
import { tokenConfig } from '../../authConfig';

export let userdata = {
    given_name: "",
    username: "",
    localAccountId: "",
    userAgent: ""
};
export let token = "";

export const LoadToken = () => {
    const { instance } = useMsal();

    useEffect(() => {
        const getToken = async () => {
            const account = instance.getActiveAccount()
            if (!account) {
                throw Error(
                    'No active account! Verify a user has been signed in and setActiveAccount has been called.'
                )
            }
            const response = await instance.acquireTokenSilent({
                ...tokenConfig,
                account: account,
            })
            token = response.accessToken;
        };
        getToken();
    }, [instance]);

    return <div></div>;
}