# Appetize [![Tests](https://github.com/nik-neg/Appetize/actions/workflows/test.yml/badge.svg)](https://github.com/nik-neg/Appetize/actions/workflows/test.yml)

Appetize is a full responsive social media application for local food, where user can upload their image from the filesystem,
add a title, description, and recipe and then publish it with geolocation API from Web API.
A simple voting system enables to vote for favourite dishes.

`Hint`: Next planned steps are refactoring the backend to be serverless in AWS and go live 🤩.

<div align="center">
<table>
<tr><th>Tech Stack</th></tr>
<tr><td>

 <sub> React </sub> |<sub>  Redux <sub>| <sub> Material-UI </sub> | <sub> Node.js </sub> | <sub> Express </sub> | <sub> MongoDB </sub> | <sub> Mongoose </sub>
|--|--|--|--|--|--|--
[<img src="https://github.com/nik-neg/appetize/blob/main/.techstack_images/react.svg" alt="drawing" width="40" height="40"/>](https://reactjs.org/) | [<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redux/redux-original.svg" alt="redux" width="40" height="40"/>](https://redux.js.org) | [<img src="https://github.com/nik-neg/appetize/blob/main/.techstack_images/material-ui.svg" alt="drawing" width="40" height="40"/>](https://material-ui.com/) | [<img src="https://github.com/nik-neg/appetize/blob/main/.techstack_images/nodejs.svg" alt="drawing" width="40" height="40"/>](https://nodejs.org/en/) | [<img src="https://github.com/nik-neg/appetize/blob/main/.techstack_images/express.svg" alt="drawing" width="40" height="40"/>](https://expressjs.com/) |  [<img src="https://github.com/nik-neg/appetize/blob/main/.techstack_images/mongodb.svg" alt="drawing" width="40" height="40"/>](https://www.mongodb.com/) | [<img src="https://github.com/nik-neg/appetize/blob/main/.techstack_images/mongoose.png" alt="drawing" width="40" height="40"/>](https://mongoosejs.com/) 
</td></tr>
<tr><td>

<sub> JavaScript </sub> |  <sub> Jest </sub>  | <sub> Docker </sub>  | <sub> Travis </sub> | <sub> Cypress </sub> | <sub> AWS </sub> | <sub> Terraform </sub>
|--|--|--|--|--|--|--
[<img src="https://github.com/nik-neg/appetize/blob/main/.techstack_images/javascript.svg" alt="drawing" width="40" height="40"/>](https://www.javascript.com/) |  [<img src="https://github.com/nik-neg/appetize/blob/main/.techstack_images/jest.svg" alt="drawing" width="40" height="40"/>](https://jestjs.io/)  |  [<img src="https://github.com/nik-neg/appetize/blob/main/.techstack_images/docker.svg" alt="drawing" width="40" height="40"/>](https://www.docker.com/)  | [<img src="https://github.com/nik-neg/appetize/blob/main/.techstack_images/travis.svg" alt="drawing" width="40" height="40"/>](https://www.travis-ci.com/) | [<img src="https://github.com/nik-neg/appetize/blob/main/.techstack_images/cypress.svg" alt="drawing" width="40" height="40"/>](https://www.cypress.io/) | [<img src="https://github.com/nik-neg/appetize/blob/cloud/.techstack_images/aws.svg" alt="drawing" width="40" height="40"/>](https://aws.amazon.com/) | [<img src="https://github.com/nik-neg/appetize/blob/cloud/.techstack_images/terraform.svg" alt="drawing" width="40" height="40"/>](https://www.terraform.io/)
</td></tr>
</table>
</div>

# Login/Register page
![alt text](https://github.com/nik-neg/Appetize/blob/main/.images/1_login.png)

# Upload with preview
![alt text](https://github.com/nik-neg/Appetize/blob/main/.images/2_dropzone_preview.png)

# Profile page
![alt text](https://github.com/nik-neg/Appetize/blob/main/.images/3_favourite_food.png)

# Published local food
![alt text](https://github.com/nik-neg/Appetize/blob/main/.images/4_area_food.png)

# Dish details
![alt text](https://github.com/nik-neg/Appetize/blob/main/.images/5_dish_details.png)

# Dish update
![alt text](https://github.com/nik-neg/Appetize/blob/main/.images/6_edit_mode.png)

# Responsive design
 Profile page             |  Published local food
:-------------------------:|:-------------------------:
![alt text](https://github.com/nik-neg/Appetize/blob/main/.images/3_favourite_food_responsive.png) |  ![alt text](https://github.com/nik-neg/Appetize/blob/main/.images/4_area_food_responsive.png)

# Demo:
https://youtu.be/_8mGjuWzNS0

# Getting started

with Docker:
 - set `USE_DOCKER` environmental variable in the .env file in the server folder to `1`
 - set environmental variable like in the .env file `TEST_*` to `0`
 - run `docker-compose build` in the root folder, where the docker compose file is
 - run `docker-compose up` in the root folder, where the docker compose file is

or follow these steps...
- set `USE_DOCKER` environmental variable in the .env file in the server folder to `0`
- set environmental variable in the .env file like `TEST_*` to `0
- run `npm i` in the server & client folder
- run the mongodb server, e.g. `sudo mongod`
- run `nodemon index.js` in the server folder
- run `npm start` in the client folder
