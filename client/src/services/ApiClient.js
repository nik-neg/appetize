const baseUrl = 'http://localhost:3001';

const registerUser = async (user) =>
  fetch(`${baseUrl}/register`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
    .then((data) => data.json())
    .then((userData) => userData)
    .catch((err) => console.log(err));

const loginUser = async (user) =>
  fetch(`${baseUrl}/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
    .then((data) => data.json())
    .then((userData) => userData)
    .catch((err) => console.log(err));

const uploadImage = async (id, data, chosenImageDate, imageURL) => {
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
    .then((data) => data)
    .then((data) => data)
    .catch((err) => console.log(err));
};

const removeUnusedImagesFromDB = async (id) =>
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

const confirmZipCode = async (id, zipCode) =>
  fetch(`${baseUrl}/profile/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zipCode),
    })
    .then((data) => data.json())
    .then((userData) => userData)
    .catch((err) => console.log(err));

const publishToDashBoard = async (id, data) =>
  fetch(`${baseUrl}/profile/${id}/dashboard`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    .then((dailyTreatData) => dailyTreatData)
    .then((dailyTreatData) => dailyTreatData)
    .catch((err) => console.log(err));

const getDishesInRadius = async (id, radius, filter, pageNumber, geoLocationPolygon) =>
{
  let url = new URL(`${baseUrl}/profile/${id}/dashboard`)
  url.search = new URLSearchParams({
    id,
    radius,
    filter,
    pageNumber,
    geoLocationPolygon
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

const voteDish = async (id, dailyTreatsID, upDownVote) => {
  let url = new URL(`${baseUrl}/profile/${id}/dashboard/${dailyTreatsID}`)
  url.search = new URLSearchParams({
    upDownVote
  })
  return fetch(
    url,
  {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  })
  .then((data) => data.json())
  .then((data) => data)
  .catch((err) => console.log(err));
}

const deleteDish = async (id, dailyTreatID) =>
  fetch(`${baseUrl}/profile/${id}/dashboard/${dailyTreatID}`,
  {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  .then((data) => data.json())
  .then((data) => data)
  .catch((err) => console.log(err));

const updateDish = async (id, dailyTreatsID, dishData) => {
  let url = new URL(`${baseUrl}/profile/${id}/dashboard`)
  url.search = new URLSearchParams({
    dailyTreatsID
  })
  return fetch(
    url,
  {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dishData),
  })
  .then((data) => data.json())
  .then((data) => data)
  .catch((err) => console.log(err));
}

export default {
  loginUser,
  registerUser,
  uploadImage,
  removeUnusedImagesFromDB,
  confirmZipCode,
  publishToDashBoard,
  getDishesInRadius,
  voteDish,
  deleteDish,
  updateDish
};
