/* eslint-disable */

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email: email,
        password: password
      }
    });
    // console.log(res);
    if (res.data.status === 'success') {
      alert('Logged in successfully!');
      location.assign('/');
      //   window.setTimeout(() => {
      //     location.assign('/');
      //   }, 500);
    }
  } catch (err) {
    alert(err.response.data.message);
    // console.log(err.response.data);
  }
};

document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  login(email, password);
});
