/* eslint-disable */

// pollyfil
import '@babel/polyfill';

// map
import { displayMap } from './mapbox';

// login / signup
import { login } from './login';
import { signup } from './signup';

// logout

console.log('Parcel bundler.');

// DOM ELEMENTS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get map element
const mapBox = document.getElementById('map');

// get forms
const loginForm = document.querySelector('#loginForm');
const signupForm = document.querySelector('#signupForm');

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

// if signup form, perform signup on submit
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#passwordConfirm').value;

    signup(name, email, password, passwordConfirm);
  });
}
