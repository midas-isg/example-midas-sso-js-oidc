const AUTH0_CLIENT_ID = 'KypnNzj458749ZsOaKzn7QL1SFhdyP4S';
const AUTH0_DOMAIN = 'midas-dev-sso.auth0.com';
const MIDAS_ACCOUNTS_URL = 'https://betaweb.rods.pitt.edu/hub-alpha';
const REDIRECT_URL = baseUrl() + 'callback.html';

if (!AUTH0_CLIENT_ID || !AUTH0_DOMAIN) {
    alert('Make sure to set the AUTH0_CLIENT_ID and AUTH0_DOMAIN variables in auth0-variables.js.');
}

const auth0js = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
    scope: 'openid profile',
    responseType: 'token',
    redirectUri: REDIRECT_URL
});

function baseUrl() {
    const loc = window.location;
    return loc.origin + loc.pathname;
}