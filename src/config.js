const isLocalhost = Boolean(
    window.location.hostname === '192.168.1.66'
);

export const APP_ID = 'eloopapp';
export const MASTER_KEY = '27nr36YLe5NG9yOa3OZ07L6IBVb';
export const API_URL = 'api.eloop.one';
export const ASSET_ID = '4zNwxbpMVigCJqBSbk9UrntSVdu8eaJESN8rYRCPP5TE';
export const NODE_URL = 'https://node1.testnet-0bsnetwork.com';
export const ENCRYPTION_KEY = 'WVBE6t9RL59KT7SKM8hecRVHwiEm7uy4';
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_6DXm3kI9N1OJXbr1KP7bjbfX00AUDXtsq3';
export const CURRENCY_CODE = 'EUR';
export const CURRENCY_CODE_HTML = '€';
export const BITPAY_API_URL = 'https://test.bitpay.com';
export const BITPAY_TOKEN = 'DCS6se7q6ifwNdzt4QVCJ4Wq6SS1uR3jQnpwBb3k86gb';
export const BITPAY_NOTIFICATION_URL = isLocalhost ? 'https://6473be54.ngrok.io/ipnbitpay' : 'https://api.eloop.one/functions/ipnbitpay';
export const STRIPE_NOTIFICATION_URL = isLocalhost ? 'http://localhost:3030/ipnstripe' : 'https://api.eloop.one/functions/ipnstripe';
export const SERVER_URL = isLocalhost ? 'http://localhost:3000' : 'https://dashboard.eloop.one';
export const NODE_EXPLORER_URL = 'https://explorer.0bsnetwork.com/testnet/tx/';
