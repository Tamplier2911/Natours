/* eslint-disable */

// axios
import axios from 'axios';

// alert
import { showAlert } from './alerts';

// address
import { address } from './address';

export const updateData = async form => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${address}/api/v1/users/updateMe`,
      data: form
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Data updated successfully!');
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    // console.log(err);
  }
};

export const updatePassword = async (
  password,
  newPassword,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${address}/api/v1/users/updateMyPassword`,
      data: {
        passwordCurrent: password,
        newPassword: newPassword,
        newPasswordConfirm: passwordConfirm
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully!');
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
