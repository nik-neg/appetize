const baseUrl = 'http://localhost:3001';

const registerUser = (user) =>
  fetch(`${baseUrl}/register`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
    .then((data) => data.json())
    .then((userData) => userData)
    .catch((err) => console.log(err));

const loginUser = (user) =>
  fetch(`${baseUrl}/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
    .then((data) => data.json())
    .then((userData) => userData)
    .catch((err) => console.log(err));

const uploadImage = async (id, data, chosenImageDate, imageURL) => { //TODO: use URLSearchParams to pass new Date
  const queryObject = {
    created: chosenImageDate,
  }
  if (imageURL) {
    queryObject.imageURL = imageURL;
  }
  let url = new URL(`${baseUrl}/profile/${id}/upload`)
  url.search = new URLSearchParams(queryObject);
  const formData = new FormData();
  formData.append('file', data.file);

  return fetch(url,
    {
      method: 'POST',
      body: formData,
    })
    .then((data) => data.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};

const removeUnusedImagesFromDB = (id) =>
{
  let url = new URL(`${baseUrl}/profile/${id}/remove-images`)
  return fetch(url,
  {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  .then((data) => data)
  .then((data) => data)
  .catch((err) => console.log(err));
}

const confirmZipCode = (id, zipCode) =>
  fetch(`${baseUrl}/profile/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zipCode),
    })
    .then((data) => data.json())
    .then((userData) => userData)
    .catch((err) => console.log(err));

const publishToDashBoard = (id, data) =>
  fetch(`${baseUrl}/profile/${id}/dashboard`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    .then((imageData) => imageData)
    .then((imageData) => imageData)
    .catch((err) => console.log(err));

const getDishesInRadius = (id, radius, cookedOrdered) =>
{
  let url = new URL(`${baseUrl}/profile/${id}/dashboard`)
  url.search = new URLSearchParams({
    id,
    radius,
    cookedOrdered
  })
  return fetch(url,
  {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  .then((data) => data.json())
  .then((data) => data)
  .catch((err) => console.log(err));
}

const voteDish = (id, dailyTreatsID, upDownVote) =>
  fetch(`${baseUrl}/profile/${id}/dashboard/${dailyTreatsID}/${upDownVote}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    })
    .then((data) => data.json())
    .then((data) => data)
    .catch((err) => console.log(err));

const deleteDish = (id, dailyTreatID) =>
  fetch(`${baseUrl}/profile/${id}/dashboard/${dailyTreatID}`,
  {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  .then((data) => data.json())
  .then((data) => data)
  .catch((err) => console.log(err));

export default {
  loginUser,
  registerUser,
  uploadImage,
  removeUnusedImagesFromDB,
  confirmZipCode,
  publishToDashBoard,
  getDishesInRadius,
  voteDish,
  deleteDish
};
