/* eslint-disable */

// SERVER SIDE
// `${req.protocol}://${req.get('host')}/me`;

// FRONT SIDE
const url = window.location.href;
const arr = url.split('/');
// let protocol = arr[0];
// let host = arr[2];
export const address = arr[0] + '//' + arr[2];
