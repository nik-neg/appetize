const baseUrl = 'http://localhost:3001';

const apiServiceJWT = {};

apiServiceJWT.register = (user) => {
  return fetch(`${baseUrl}/register`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
    .then((data) => data.json())
    .then((userData) => userData)
    .catch((err) => console.log(err));
};

apiServiceJWT.logout = async () => {
  localStorage.removeItem('accessToken');
};

export default apiServiceJWT;
