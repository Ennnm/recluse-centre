<div id="top"></div>



# Recluse Centre

##### Recluse centre is an interactive virtual space where you can roam, chat, customize spaces and host links. 

<!-- TABLE OF CONTENTS -->

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#usage-steps">Usage Steps</a>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#built-with">Built With</a></li>
	 <li><a href="#roadmap">Roadmap</a></li>
	 <li><a href="#retrospective">Retrospective</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->

## About The Project

![screenshot of 2D grid world](/images/kai-ss.png)

With the emergence of COVID-19, students and professionals worldwide exchanged physical offices and classrooms for remote learning and online conferencing.

Recluse Centre simulates the experience of real-life social interactions and working environments with a 2-D virtual world to facilitate discussions and co-working.

#### With Recluse Centre, you can:

- Have "world"-wide discussions with peers in your 2-D world
- Design social and co-working spaces by creating rooms with walls and colouring them, and assigning room names to said walls.
- Set meeting agendas, create video conferencing, or simply set up useful tools for your co-working peers with our build tool's external link creator.
- Explore the social spaces created by your peers in your 2-D world, and interact with the links and objects in the world. 

You can find the deployed app [here](https://fast-reef-85640.herokuapp.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

## Usage Steps

<img width="1440" alt="Screenshot 2022-01-12 at 1 04 59 AM" src="https://user-images.githubusercontent.com/7672836/148988417-5247e9e6-2bad-42e1-8d5f-ba2d5aa4e398.png">

1. Starting from [our landing page](https://fast-reef-85640.herokuapp.com/), log in or register for an account.

![screenshot of 2D grid world](/images/kai-ss.png)

2. Upon logging in, you should land in a world. The instructions for moving your character, opening the build tool and interacting with objects and links will be in the yellow alert below the top navigation bar.

![query other user](/images/query-user.png)

![query link](/images/query-link.png)

3. Standing next to a link (or a character, or an object), you can press E on your keyboard to interact with it. Interacting with it opens a tooltip with its description, and a link (if any). For external link objects, you can also open them in a new window by clicking on them.

<img width="427" alt="Screenshot 2022-01-12 at 1 12 32 AM" src="https://user-images.githubusercontent.com/7672836/148989493-664efe32-760a-4bb8-b75c-67163a5dac98.png">

4. Pressing B on your keyboard opens the build tool. There should be 4 options available. In this example, we will select the Wall tool.

<img width="770" alt="Screenshot 2022-01-12 at 1 14 36 AM" src="https://user-images.githubusercontent.com/7672836/148989814-173b8c36-cd8d-4899-8709-e7ad6920cf7b.png">

5. Clicking on the Wall tool should open a palette of colours you can use for your wall. Click on any one you prefer. For this demo, we just clicked on the red colour.

<img width="765" alt="Screenshot 2022-01-12 at 1 16 11 AM" src="https://user-images.githubusercontent.com/7672836/148990091-d617ed8d-bbf8-4741-83bb-d453be4d2e09.png">

6. Click any unoccupied tile on the grid map immediately after selecting your colour to add the wall. In the screenshot above, we just created a red wall to the left of the character Chuan Xin. This "click on a tile immediately after selecting and filling up the required information" interface is also used for the other 3 build tools: adding a character to a wall, adding a external link, erasing a wall or object. Press B again or click on the cross on the right-hand side of the build menus to exit from the interface.

<img width="1440" alt="Screenshot 2022-01-12 at 1 31 46 AM" src="https://user-images.githubusercontent.com/7672836/148992471-6bf0b6da-ee8c-49cf-aa88-0f80ef13e364.png">

7. Click on the blue button in the bottom-right hand corner of the page to expand or collapse the chat interface. Scroll up or down to view the chat messages. The input box in the bottom-left hand corner of the page allows you to type out a message. Hitting Enter or clicking on the green button allows you to submit your typed message to broadcast to visitors of the world. Your messages will persist throughout the entire lifetime of the world.

<p align="right">(<a href="#top">back to top</a>)</p>

## Built With

##### Frontend

- [React.js](https://reactjs.org/)

##### Backend

- [Express](https://expressjs.com/)
- [Sequelize/PostgreSQL](https://sequelize.org/v7/)

##### Realtime user movement and chat

- [Socket.IO](https://socket.io/)

##### Styling

- [Bootstrap](https://getbootstrap.com/docs/5.1/getting-started/introduction/)
- [Tailwind](https://tailwindcss.com/)

##### Planning 

- [Google docs - Ideation phase 1](https://docs.google.com/document/d/1ggej_FtYsL5dBJW8s3Qk8hh0hhrvsOpd3jtBLpsdVX0/edit#heading=h.jbzkpjk7nxct)
- [Google docs - Ideation phase 2](https://docs.google.com/document/d/1fQhvfqzocZeyBxOy1r0T87QU6TS7LFvhEnjATlzulaQ/edit#)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Missing username when user first enters the world. Username only appears after said user moves.
- [ ] Inability to press B to re-open Build tool immediately after user closes it by clicking the cross button on the Build menu. The user can press B to re-open it only after moving your character.
- [ ] User can create multiple worlds.

See the [open issues](https://github.com/Ennnm/recluse-centre/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- RETROSPECTIVE -->

## Retrospective

WIP

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->

## Contact

[Jia En](https://github.com/Ennnm) - [@ennnm_](https://twitter.com/ennnm_) - jiaen.1sc4@gmail.com

[Chuan Xin](https://github.com/leechuanxin) - chuanxin.lee@gmail.com

Project Link: [https://github.com/Ennnm/recluse-centre](https://github.com/Ennnm/recluse-centre)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

* [Recurse Center Virtual RC](https://www.recurse.com/virtual-rc)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
