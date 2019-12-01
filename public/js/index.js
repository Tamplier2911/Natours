/* eslint-disable */

// pollyfil
import '@babel/polyfill';

// map
import { displayMap } from './mapbox';

// login / signup
import { login, logout } from './login';
import { signup } from './signup';

// update user data
import { updateData, updatePassword } from './update';

console.log('Parcel bundler.');

// DOM ELEMENTS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get map element
const mapBox = document.getElementById('map');

// get forms
const loginForm = document.querySelector('#loginForm');
const signupForm = document.querySelector('#signupForm');
const updateUserDataForm = document.querySelector('.form-user-data');
const updateUserPasswordForm = document.querySelector('.form-user-settings');

// get logout button
const logoutButton = document.querySelector('.nav__el--logout');

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

if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    logout();
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

// if updateUserInfo form, perform update on submit
if (updateUserDataForm) {
  updateUserDataForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.querySelector('#nameUpdate').value;
    const email = document.querySelector('#emailUpdate').value;

    updateData(name, email);
  });
}

// if updateUserPassword form, perform update on submit
if (updateUserPasswordForm) {
  updateUserPasswordForm.addEventListener('submit', e => {
    e.preventDefault();

    const password = document.querySelector('#passwordCurrent').value;
    const newPassword = document.querySelector('#passwordNew').value;
    const passwordConfirm = document.querySelector('#passwordConfirm').value;

    document.querySelector('#savePassword').textContent = 'Updating...';

    updatePassword(password, newPassword, passwordConfirm);

    // clear password fields after submition
    // dose not realy matter cause forcing pagereload

    /*

    password.value = '';
    newPassword.value = '';
    passwordConfirm.value = '';

    */
  });
}

// Header functionality
const menuCheckbox = document.querySelector('.header__check');
const header = document.querySelector('.header');
menuCheckbox.addEventListener('change', () => {
  header.classList.toggle('headerHeight');
});
