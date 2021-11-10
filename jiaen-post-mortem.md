# Post-Mortem Meeting (Recluse center react app)

### Technical Review

###### "Technical" refers to software logic and syntax.

##### What went well? Please share a link to the specific code.

- extracting favicon from websites for active objects
- UserModal for player description, objects description, buildTools
- handling events for different keystrokes

##### What were the biggest challenges you faced? Please share a link to the specific code.

- drilling too many variables from grid to the square and to the UserModal

- figuring to use useRef() to track the client and use it activate pop-ups

- number of layers of grid 3 vs 1 vs 2. the performance issues when it was 1 layer is finally not a react issue but a rendering one. ( 2 images of the users from writing over the grid where the sockets's player lagged behind)

- decision to save transient player positions in memory instead of the db, when compared to wall building that updates the db, it is faster

- wonder how to make the performance better for multiple users.

- getting user information to update from a blank slate is inconsistent as the player and their name tag is rendered before they get the name from the axios api call from the first useEffect. received suggesting to do a set interval, not sure how.

  > const [userObj, setUserObj] = useState({
  >
  >  id: userId,
  >
  >  realName: '',
  >
  >  username: '',
  >
  >  description: '',
  >
  > });

  This problem cascaded to make it not possible for me to overlap the user ontop of others as their names will be rewritten to ' '

- Initially tried to make axios call for user information from the sockets handler in the back-end and faced error in connection. Shifted to making axios calls from the client instead. Are there scenarios where information is get from the backend without axios calls? is it standard?

- Getting playergrid, world grid to update accordingly using sockets + state change -> rendering 

  

##### What would you do differently next time?

- wonder how much of the "you may not need to use useContext, useCallback..." talk was useful. if its more of a discussing with pro/cons, tradeoffs it would be more productive

### Process Review

###### "Process" refers to app development steps and strategy.

##### What went well?

- concept of socket rooms. is this simplified computer networking?
- use of tailwind library
- starting grid development early

##### What could have been better?

- The app could have been more complete with the ability to create new worlds, explore different existing ones, the sockets and db were set up for this
- Have a feeling that the grid development was very developed, and it might have cannibalized other functions like the chat 

##### What would you do differently next time?

- follow kanban more

  