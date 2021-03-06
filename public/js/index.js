/* eslint-disable */

// pollyfil
import '@babel/polyfill';

// alerts
import { showAlert } from './alerts';

// map
import { displayMap } from './mapbox';

// login / signup
import { login, logout, passwordForgot, passwordReset } from './login';
import { signup } from './signup';

// update user data
import { updateData, updatePassword } from './update';

// checkout page
import { bookTour } from './stripe';

// console.log('Parcel bundler.');

// DOM ELEMENTS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get map element
const mapBox = document.getElementById('map');

// get forms
const loginForm = document.querySelector('#loginForm');
const signupForm = document.querySelector('#signupForm');
const updateUserDataForm = document.querySelector('.form-user-data');
const updateUserPasswordForm = document.querySelector('.form-user-settings');
const passwordForgotForm = document.querySelector('#passwordForgotForm');
const passwordResetForm = document.querySelector('#passwordResetForm');

// get book tour button
const bookTourButton = document.querySelector('#bookTour');

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

    // selecting field values
    const name = document.querySelector('#nameUpdate').value;
    const email = document.querySelector('#emailUpdate').value;
    const photo = document.querySelector('#photoUpdate').files[0];

    // specifying enctype multipart/form-data programmatically
    const form = new FormData();
    form.append('name', name);
    form.append('email', email);
    if (photo) {
      form.append('photo', photo);
    }

    updateData(form);
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

if (passwordForgotForm) {
  passwordForgotForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.querySelector('#passwordForgotEmail').value;

    passwordForgot(email);
  });
}

if (passwordResetForm) {
  passwordResetForm.addEventListener('submit', e => {
    e.preventDefault();

    const token = document.querySelector('#passwordResetToken').value;
    const password = document.querySelector('#newPassword').value;
    const passwordConfirm = document.querySelector('#newPasswordConfirm').value;

    passwordReset(token, password, passwordConfirm);
  });
}

if (bookTourButton) {
  bookTourButton.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

// Handling body-dataset reusable alerts
const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) {
  showAlert('success', alertMessage, 10);
}

// Header functionality
const menuCheckbox = document.querySelector('.header__check');
const header = document.querySelector('.header');
const navUser = document.querySelector('.nav--user');
menuCheckbox.addEventListener('change', () => {
  header.classList.toggle('headerHeight');
  if (navUser.style.display === 'grid') {
    navUser.style.display = 'none';
  } else {
    navUser.style.display = 'grid';
  }
});

window.onresize = e => {
  if (
    (e.target.innerWidth > 690 && navUser.style.display === 'grid') ||
    (e.target.innerWidth > 690 && navUser.style.display === 'none')
  ) {
    header.classList.remove('headerHeight');
    navUser.style.display = 'flex';
    menuCheckbox.checked = false;
  }
  if (e.target.innerWidth < 691 && navUser.style.display === 'flex') {
    navUser.style.display = 'none';
  }
};
