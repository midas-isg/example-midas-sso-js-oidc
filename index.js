function displayStatus() {
    var status;
    const token = localStorage.getItem('accessToken');
    const expirationDate = new Date(Number.parseInt(localStorage.getItem('expirationDate')));
    const isExpired = expirationDate < new Date();
    const profile = localStorage.getItem('profile');


    if (!token) {
        if (localStorage.getItem('sso')){
            renew();
        }
        status = 'There is no access token present in local storage, meaning that you are not logged in. <a href="#" onclick="renew()">Click here to attempt an SSO login</a>';
    } else if (isExpired) {
        status = 'There is an expired access token in local storage. <a href="#" onclick="renew()">Click here to renew it</a>';
        document.getElementById('logout').style.visibility = 'visible';
    } else {
        status = `There is an access token in local storage, and it expires on ${expirationDate}. <a href="#" onclick="renew()">Click here to renew it</a>`;
        document.getElementById('logout').style.visibility = 'visible';
    }
    if (profile) {
        const user = JSON.parse(profile);
        status += `<p>Hello ${user.name}</p>
                    <image src="${user.picture}" alt="You don't have any picture"></image>
                    <p>Roles: ${user['https://epimodels.org/app_metadata'].roles}</p>
        `;
    }
    document.getElementById('status').innerHTML = status;
}

function saveAuthResult (result) {
    localStorage.setItem('accessToken', result.accessToken);
    localStorage.setItem('expirationDate', Date.now() + Number.parseInt(result.expiresIn) * 1000);
    auth0js.client.userInfo(result.accessToken, function(err, user) {
        localStorage.setItem('profile', JSON.stringify(user));
        displayStatus();
    });
}

function renew () {
    auth0js.renewAuth({
        redirectUri: REDIRECT_URL,
        usePostMessage: true
    }, function (err, result) {
        if (err || (result && result.error)) { // For auth0.js version 8.8, the error shows up at result.error
            if (result)
                err = {error: result.errorDescription}; // For auth0.js version 8.8, the error message shows up at result.errorDescription
            alert(`Could not get a new token using silent authentication (${err.error}). Redirecting to login page...`);
            // auth0js.authorize();
            signOnViaMidasAccounts();
        } else {
            saveAuthResult(result);
        }
    });
}


displayStatus();


function signOnViaMidasAccounts() {
    localStorage.setItem('sso', true);
    window.location.href = toMidasAccountsUrl('/sso');
}

function signoff() {
    localStorage.clear();
    window.location.href = toMidasAccountsUrl('/signoff', 'You have been signed off. You may sign on again.');
}

function toMidasAccountsUrl(endpoint, message, title) {
    title = title || "OIDC SSO Example";
    message = message || "Please sign on to use the services";
    return MIDAS_ACCOUNTS_URL + endpoint + '?returnToUrl='
        + encodeURIComponent(window.location) + '&title=' + title + '&message=' + message;
}
