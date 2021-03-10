<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
***
***
***
*** To avoid retyping too much info. Do a search and replace for the following:
*** vikinatora, foodlance-delivery, twitter_handle, vikktoort@gmail.com, Smart Strength Client, project_description
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/vikinatora/foodlance-delivery">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Foodlance Delivery</h3>

  <p align="center">
    Freelance delivery web application implemented using the MERN stack
    <br />
    <a href="https://github.com/vikinatora/foodlance-delivery"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/vikinatora/foodlance-delivery">View Demo</a>
    ·
    <a href="https://github.com/vikinatora/foodlance-delivery/issues">Report Bug</a>
    ·
    <a href="https://github.com/vikinatora/foodlance-delivery/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This project started as a university project. At that time I was really on the React hype train and decided to go the MERN stack on this project. At some point while I was coding, I realized that having a web application for this purpose is pretty useless, unless it's a PWA. It would have been much better if I had decided to make a native mobile application... However it was too late to start over as I had a deadline and stuck with it.

Nevertheless, the server can be extracted and used with a different client. In the future maybe I will get back to this project and reimplement it as a mobile app.

### Built With

* [React](https://reactjs.org/)
* [React Leaflet](https://react-leaflet.js.org/)
* [Ant Design](https://ant.design/)
* [NodeJS](https://nodejs.org/en/)
* [Express.js](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites
* [NodeJS](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/vikinatora/foodlance-delivery.git
   ```
2. Install server dependencies
  ```sh
   cd server
   ```
   ```sh
   npm install
   ```
   ```sh
   npm run tsc
   ```
3. Start server
   ```sh
   npm run server
   ```
4. Install client dependencies
   ```sh
   cd foodlance
   ```
   ```sh
   npm install
   ```
5. Run the client
  ```sh
   npm start
   ```
6. Open project
   ```sh
   http://localhost:3000/
   ```

<!-- USAGE EXAMPLES -->
## Usage
After launching the app the users sees a map of the region he is in. Depending on the browser they may need to allow location tracking and refresh the browser.
![Map](https://imgur.com/0pY61qX)

In order to make or accept orders users have to register.
![Register form](https://imgur.com/K0nPeIp)

After registering the users will be redirected to the main screen with the map. Double clicking on the map will set a point for his order. After confirming the point they can fill in the order form and create an order request.
![Order form](https://imgur.com/7YB2FhZ)

This is the way the requester sees his order 
![Requester order on map](https://imgur.com/rUhKgwv)

The other users see other users' orders as potential deliveries.
![Deliverer order on map ](https://imgur.com/l7s9YB1)

If user accepts an order he has 20 minutes to complete the order. 
![Deliverer accepts order](https://imgur.com/lNg88ej)

The requester receives a real time update that his order has been accepted. 
![Requester sees order has been accepted](https://imgur.com/tZDzNHh)

After both the requester and the deliverer press the button that confirms that the order has been completed, the order is finished. The requester receives experience points and the deliverer receives the tips from the order.
![Requester profile](https://imgur.com/scTMmU9)
![Deliverer profile ](https://imgur.com/L6BvjD4)

<!-- CONTRIBUTING -->
## Contributing

This repo isn't maintained anymore. 
You can clone/fork it and use it for your projects if it suits you. 

Just let me know, I would love to know that it helped someone. 😊

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Viktor Todorov - vikktoort@gmail.com

Project Link: [https://github.com/vikinatora/foodlance-delivery](https://github.com/vikinatora/foodlance-delivery)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/vikinatora/foodlance-delivery.svg?style=for-the-badge
[contributors-url]: https://github.com/vikinatora/foodlance-delivery/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/vikinatora/foodlance-delivery.svg?style=for-the-badge
[forks-url]: https://github.com/vikinatora/foodlance-delivery/network/members
[stars-shield]: https://img.shields.io/github/stars/vikinatora/foodlance-delivery.svg?style=for-the-badge
[stars-url]: https://github.com/vikinatora/foodlance-delivery/stargazers
[issues-shield]: https://img.shields.io/github/issues/vikinatora/foodlance-delivery.svg?style=for-the-badge
[issues-url]: https://github.com/vikinatora/foodlance-delivery/issues
[license-shield]: https://img.shields.io/github/license/vikinatora/foodlance-delivery.svg?style=for-the-badge
[license-url]: https://github.com/vikinatora/foodlance-delivery/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/viktor-todorov-8a7434122
