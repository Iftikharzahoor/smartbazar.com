import axios from 'axios';

async function test() {
  try {
    const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'customer@shopmern.com',
      password: 'customer12345'
    });
    console.log('Login Response:', response.data);
  } catch (err) {
    console.error('Login Failed:', err.response?.data || err.message);
  }
}
test();
