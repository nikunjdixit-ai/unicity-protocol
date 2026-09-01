async function getCredential() {
    var identity = await apiGet("/identity/status");
    if (identity && identity.credential) {
        return identity.credential;
    }
    return null;
}

async function getTransaction() {
    var identity = await apiGet("/identity/status");
    if (identity && identity.credential) {
        return { hash: identity.credential.transaction };
    }
    return null;
}
