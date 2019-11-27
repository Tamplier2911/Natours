/* eslint-disable */

// pollyfil
import '@babel/polyfill';

// map
import { displayMap } from './mapbox';

// login
import { login } from './login';

// logout

console.log('Parcel bundler.');

// DOM ELEMENTS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get map element
const mapBox = document.getElementById('map');

// get form element
const loginForm = document.querySelector('.form');

// DELIGATIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get location from html dataset in mapBox and if data is found execute map
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

// if login form, perform login on submit
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    login(email, password);
  });
}
