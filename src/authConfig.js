const msalConfig = {
    auth: {
        clientId: process.env.REACT_APP_CLIENT_ID,
        authority: process.env.REACT_APP_AUTHORITY,
        knownAuthorities: [process.env.REACT_APP_AUTHORITY_DOMAIN],
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    },
    // system: {
    //     loggerOptions: {
    //         loggerCallback(loglevel, message, containsPii) {
    //             console.log(message);
    //         },
    //         piiLoggingEnabled: false,
    //         logLevel: 'Info',
    //     },
    // },
};

const tokenConfig = {
    scopes: [process.env.REACT_APP_SCOPES]
}

module.exports = {
    msalConfig,
    tokenConfig
};
