# Appetize
Initial project started @Codeworks: 1 week (21.04.21-28.04.21) Solo Project

Appetize is a full responsive social media application for local food, where user can upload their image from the filesystem,
add a title, description, and recipe and then publish it within their postal zip code area (currently only german postal zip codes are supported).
A simple voting system enables to vote for favourite dishes.

`Hint`: Next planned steps are to make the app more robust in functionality and performance, add CI / CD pipeline with Travis, add tests with Jest and Cypress.

<table>
<tr><th>Tech Stack</th><th>API</th></tr>
<tr><td>

 <sub> React </sub> |<sub>  Redux <sub>| <sub> Material-UI </sub> | <sub> Node.js </sub> | <sub> Express </sub> | <sub> MongoDB </sub> | <sub> Mongoose </sub> |  <sub> JavaScript </sub> |  <sub> Jest </sub> 
|--|--|--|--|--|--|--|--
[<img src="https://github.com/nik-neg/appetize/blob/main/techstack_images/react.svg" alt="drawing" width="50"/>](https://reactjs.org/) | [<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redux/redux-original.svg" alt="redux" width="40" height="40"/>](https://redux.js.org) | [<img src="https://github.com/nik-neg/appetize/blob/main/techstack_images/material-ui.svg" alt="drawing" width="50"/>](https://material-ui.com/) | [<img src="https://github.com/nik-neg/appetize/blob/main/techstack_images/nodejs.svg" alt="drawing" width="50"/>](https://nodejs.org/en/) | [<img src="https://github.com/nik-neg/appetize/blob/main/techstack_images/express.svg" alt="drawing" width="50"/>](https://expressjs.com/) |  [<img src="https://github.com/nik-neg/appetize/blob/main/techstack_images/mongodb.svg" alt="drawing" width="50"/>](https://www.mongodb.com/) |  [<img src="https://github.com/nik-neg/appetize/blob/main/techstack_images/mongoose.png" alt="drawing" width="50"/>](https://mongoosejs.com/) |  [<img src="https://github.com/nik-neg/appetize/blob/main/techstack_images/javascript.svg" alt="drawing" width="50"/>](https://www.javascript.com/) |  [<img src="https://github.com/nik-neg/appetize/blob/main/techstack_images/jest.svg" alt="drawing" width="50"/>](https://www.javascript.com/)
 </td><td>
 
[Zip Code API](https://zipcodebase.com/)
</td></tr> </table> 

# Login/Register page
![alt text](https://github.com/nik-neg/Appetize/blob/main/images/1_login.png)

# Upload with preview
![alt text](https://github.com/nik-neg/Appetize/blob/main/images/2_dropzone_preview.png)

# Profile page
![alt text](https://github.com/nik-neg/Appetize/blob/main/images/3_favourite_food.png)

# Published local food
![alt text](https://github.com/nik-neg/Appetize/blob/main/images/4_area_food.png)
 
# Responsive design
 Profile page             |  Published local food
:-------------------------:|:-------------------------:
![alt text](https://github.com/nik-neg/Appetize/blob/main/images/3_favourite_food_responsive.png) |  ![alt text](https://github.com/nik-neg/Appetize/blob/main/images/4_area_food_responsive.png)

# Demo:
https://youtu.be/_8mGjuWzNS0

# Getting started
 
get your `API KEY` at `https://zipcodebase.com` and put it into the .env file of the server
 
with Docker:
 - set `USE_DOCKER` environmental variable in the .env file in the server folder to `1`
 - run `docker-compose build` in the root folder, where the docker compose file is
 - run `docker-compose up` in the root folder, where the docker compose file is

or follow these steps...

- run `npm i` in the server & client folder
- run the mongodb server, e.g. `sudo mongod`
- run `nodemon index.js` in the server folder
- run `npm start` in the client folder
