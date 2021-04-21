  const baseUrl = "http://localhost:3001/register";

  const registerUser = (user) => {
    console.log(user)
    return fetch(`${baseUrl}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      }
    )
    .then(data => data.json())
    .then(user => user)
    .catch(err => console.log(err))
  }

  const loginUser = (user) => {
    console.log(user)
    return fetch(`${baseUrl}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      }
    )
    .then(data => data.json())
    .then(user => user)
    .catch(err => console.log(err))
  }

  module.exports = {loginUser, registerUser}