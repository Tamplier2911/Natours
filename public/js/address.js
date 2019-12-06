/* eslint-disable */

// `${req.protocol}://${req.get('host')}/me`;
const url = window.location.href;
const arr = url.split('/');
// let protocol = arr[0];
// let host = arr[2];
export const address = arr[0] + '//' + arr[2];
