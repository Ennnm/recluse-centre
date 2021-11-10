# Technical Review

## What went well? Please share a link to the specific code.

### Socket.io and the Database

I had to figure out how to use Socket.io together with AJAX calls to the database, because tutorials online usually focus on setting up Socket.io on the front-end without consideration of using a database.

Instead of showing you a specific line of code, I will be talking through a series of connected diagrams [here](https://lucid.app/lucidchart/5890a381-f2c4-46b6-a48c-40b64cc7c381/edit?viewport_loc=247%2C184%2C1591%2C719%2Cg2gpeH_JiEd~&invitationId=inv_fcdec2c5-cf91-4e01-b6ae-48370dc1fccb).

Long story short, I will retrieve the message history from the database when the user has first connected to the world. Subsequently, all other messages will be received from Socket.io payloads (as opposed to payloads from AJAX calls), but only when the API call is successful.

### Pairing socket.id with User objects

In order to show if a user has connected or disconnected from a world, I will need to have their user information on connection or disconnection. Unfortunately, my connection and disconnection handlers are on the server side, on `index.mjs`.

This means I will need a way to store a list of users who connected, and match their socket IDs to their user information. And then remove them from the list on disconnection. It took a bit of thinking, but I figured that out [by setting up a global array of connected users on the server side](https://github.com/Ennnm/recluse-centre/blob/main/index.mjs#L79-L152).

## What were the biggest challenges you faced? Please share a link to the specific code.

### Socket.io and Express: 1 Port or 2?

I felt that being able to deploy this project will be key to a successful presentation. This means that our production setup has to be perfect.

Unfortunately, things were not smooth-sailing from the start. Perhaps we were lacking good contextual knowledge about what Express really means. Is it an application / function that runs on the backend? Is it a server? What does a server actually mean? Is a Socket.io instance a server or an app?

We started from an original single port setup. It worked for Jia En for her Project 3 Reversi, so it should be fine right? Unfortunately that setup didn't work on my laptop, and we concluded it might be a Windows computer vs Macbook thing. I couldn't find the Stackoverflow comment anymore, but supposedly WSS changes how this can be set up on Windows computers.

We switched to a 2-port setup for the IO instance and Express initially. You can refer to [the changes in this commit](https://github.com/Ennnm/recluse-centre/commit/f76612eec8c2f4a34f939f07b2d3ad28415d429d). A CORS-handling library had to be set up, because the `localhost` is going to recognise the different ports as different origins.

However, we recognised that may pose problems when deploying later. How do we set Heroku up such that it has 2 ports listening at the same time? Heroku will provide a `PORT` variable in `process.env`, but what about 2 ports?

We quickly realised by changing our way of thinking about servers, we may still have a single port environment which will help a lot with making deployment easier. If a "server" is something that listens to a port, the IO instance _need not_ be a "server".

This is [how we have finally set it up](https://github.com/Ennnm/recluse-centre/commit/d6590c22296432760b196d9e0364944c5c480195). Briefly, we wrapped a HTTP server instance around an Express app instance. We have the IO instance listen to the server instance, and in turn the server instance listens to 1 port. If a "server" is just something that listens to a port, we now only have 1 server ... and the IO instance listens to the server as opposed to another port.

### Deployment: Tailwind, Webpack, and Heroku

Also, while Tailwind CSS worked well in development, we couldn't deploy our application on Heroku despite the recommendations on Tailwind's documentation. I guess we do not yet have a strong understanding of how we can set up Webpack configurations by ourselves.

For reference, [this is how Tailwind recommends we set it up on Webpack](https://github.com/Ennnm/recluse-centre/commit/1f1b33a685f6ed204468c8c2e75c31cd875c941c). I took the easy way out in the end, and decided to import Tailwind using `<link href>` on `index.html` instead. It worked because I realised Jia En is only using Tailwind's utility CSS classes and writing them inline, instead of [their specialised functionalities as stated here](https://tailwindcss.com/docs/installation#using-tailwind-via-cdn).

## What would you do differently next time?

### Consensus on a UI Library

We took a major risk in importing 2 UI libraries at the same time: Bootstrap and Tailwind. I am using Bootstrap because I have been using their UI for my previous projects, and I do not want to spend too much time on setting up the UI for authentication pages again. Jia En has a preference for Tailwind because she wants to try a different UI library and writing her styles inline without having to touch `styles.scss` often.

Thankfully, while looking through Tailwind's documentations, they provided mostly utility CSS classes. This means unlike Bootstrap, they probably do not have specific UI component classes like `.card` or `.navbar` - we are expected to set these up ourselves using their utility classes.

This means that Bootstrap's and Tailwind's CSS classes are unlikely to clash and overwrite one another's. I was worried about Bootstrap's grid system clashing with Tailwind's (if Tailwind even had any), but thankfully Jia En was using CSS grids to set up her grid. I used Bootstrap's grid only for the "auxiliary" pages.

That said, it might be preferable if we have come to a consensus early on the UI library to use. It is usually not recommended to have multiple large UI libraries imported, for fear of clashing styles. We wouldn't want to have Bootstrap and Material UI running at the same time, conflicting each other.

### Consistency in chat timestamps in Socket.io

Let's refer to the diagrams [here](https://lucid.app/lucidchart/5890a381-f2c4-46b6-a48c-40b64cc7c381/edit?viewport_loc=247%2C184%2C1591%2C719%2Cg2gpeH_JiEd~&invitationId=inv_fcdec2c5-cf91-4e01-b6ae-48370dc1fccb) again.

I only realised this bug during the project presentations, because a student from FTBC5 is living in a timezone 1 hour before Singapore time. Namely, the order of the chat messages is rendered correctly on the chat interface, but her timestamp says `9:40:00` instead of `10:40:00` instead.

No particular code to show for this, but I am rendering the timestamps as a string using `${hour}:${min}:${sec}` on `socket.emit` instead of `socket.on('chat:receive')`. Using Socket.io and databases deployed on Heroku, I should not only be considering the differences between client time and server time, but also if the timestamp should be reflecting the one on the client sender's end, or the client recipient's end.

Standardising to set the timestamp string on `socket.on('chat:receive')` will help in ensuring that the timestamp will be printed correctly on the local time of the recipient.

# Process Review

### What went well?

Unlike other teams' workflows, we can't say we are front-end or backend developers. We did a little of both in the end. Perhaps it will be more accurate to say that Jia En is more of a "product engineer" here, and I am more of a "system administrator / devops" person in this project.

I have worked with interns similar to Jia En before: brilliant, very creative, and very productive. I also feel that these creative folks work the best in the least intrusive environment - my process and management agenda for this project is not to step on her toes! Thus, it is indeed heartwarming to hear her occasionally saying she doesn't have to worry much besides working on her favourite parts of the project: world building and interactions.

In group work, we can never have perfect 50-50 allocation of work. In my work experience before Bootcamp, people are unlikely to complain about work allocation if they are passionate about what they are working on 😝.

Yes, I sincerely feel that Jia En was the hard carry for this project in the product engineering sense. However, I knew she was also getting quite tired of typical CRUD apps setups at this point. Thus, I am more than willing to do the dirtier work of authentication setup, routes, registration and login flow. This work is probably less technically challenging but more tedious compared to world building and interactions, but they are still important experiential aspects of a social application.

Despite not working on the aspects most will consider to be the "most fun", I still learnt a lot! It's interesting re-thinking authentication flows in a heavily AJAX-ed application, compared to my previous setups using server-side rendering.

I also accomplished my goal of learning Socket.io this project. Chat is a common "basic" example of learning Socket.io, but I learnt how to integrate Socket.io with an app that has a database. Also, I had to consider when to retrieve information from a database, and when I should simply use the payloads provided by Socket.io.

### What could have been better?

This is completely on me, but we have had a Kanban board that we quickly abandoned towards the end of MVP and at the start of feature freeze.

Despite understanding that a Kanban board is important for communication, I never used the one Jia En set up on the Github project. This is due to my preference for jumping straight into the code and fixing issues as compared to spending time logging the issues.

I felt this is my fault because we could probably have continued the Kanban flow past MVP if I were less lackadaisical about it. This is a pair project, and if 1 party is very lazy with processes, it is unlikely the other party will want to continue with it themselves.

### What would you do differently next time?

We have had an interesting workflow that, very surprisingly, worked for us!

Our approach is completely "asynchronous", meaning that Jia En works in the day like a normal human being, while I tend to sleep in the day and work at night. It fits our working personalities, because we have worked with micromanagers pre-Bootcamp who stifled our work 😝.

However, this approach will probably not fly if we haven't been paired for Project 4. It may not work if I am paired with Justin, or Shen Nan, for instance.

There were also some minor problems with this approach, which thankfully got resolved quickly. An off-sync approach means if any of us were stuck with a blocker for extended periods, we can only talk and discuss about it when the other person is awake.

I guess this "what would I do differently" question doesn't really pertain to the working relationship between Jia En and me, but something I will have to be paying more attention to when paired with other students subsequently.

From an engineering management or simply a man management perspective, knowing your pair buddy (or your team) is key to the success of unorthodox working relationships like ours. I believe a good engineering manager is also very good at emphasizing the strengths and hiding the weaknesses of every colleague or team member.

A strong consensus on the desired workflow should be established from the start, and this means both parties should also have a discussion about their preferred working styles and making compromises to have one befitting both.

I still believe Jia En and I were lucky that we accidentally established this working relationship by chance, and very thankfully it worked out well! A good conversation at the start will be preferred though.
