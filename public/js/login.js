/* eslint-disable */

// axios
import axios from 'axios';

// alert
import { showAlert } from './alerts';

// address
import { address } from './address';
import { async } from 'q';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${address}/api/v1/users/login`,
      data: {
        email: email,
        password: password
      }
    });
    // console.log(res);
    if (res.data.status === 'success') {
      //   alert('Logged in successfully!');
      showAlert('success', 'Logged in successfully!');

      //   location.assign('/');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    //   alert(err.response.data.message);
    showAlert('error', err.response.data.message);
    // console.log(err.response.data);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${address}/api/v1/users/logout`
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged out successfully!');
      location.reload(true);
      // will load from cache !!!
      // location.assign('/');
    }
    // double check
    location.assign('/');
  } catch (err) {
    showAlert('error', 'Something went wrong! Please perform log out again!');
  }
};

export const passwordForgot = async email => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${address}/api/v1/users/forgotPassword`,
      data: {
        email: email
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', `Email was sent to ${email}`);
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const passwordReset = async (token, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${address}/api/v1/users/resetPassword/${token}`,
      data: {
        password: password,
        passwordConfirm: passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Your password is successfully reseted!');
      location.reload(true);
    }
    location.assign('/');
  } catch (err) {
    console.log(err);
    // showAlert('error', 'Please, make sure that you spell token correctly!');
    showAlert('error', err.response.data.message);
  }
};
