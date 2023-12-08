# MessageBoards

## High-Level Overview
MessageBoards is an application that allows user to post messages on a community board, where users are allowed to post any messages as long as it is not empty, less than 128 characters, and does not include any profanity. Messages on the board are shown from most to least recently posted and users are able to see what date and time the messages were posted. In addition, users can search for messages that were posted on a specific date and go to the next or prev page to see more messages. 

## How to start applications
1. To start the application, open up two terminals; cd to client_server in the first terminal and react_board in the second terminal
2. Run ```npm start``` in client_server terminal; you should see the messages: 
    >client_server@1.0.0 start
    > node server.js
    > Server is running on http://localhost:8001

3. Run ```npm start``` in react_board terminal;  you should see the success message
4. If react_board throws an error saying command not found, please run ```npm install``` in the react_board directory; this will download the modules needed by react to run the application
5. If both succeeded, head to http://localhost:3000 to see the message board if react_board did not auto-direct you to the page


## Tools & Framework
1. Backend Server: NodeJS and Express 
2. Backend Database: Supabase (PostgreSQL)
3. Frontend WebApp: React

## Requirements
1. Users should be able to type a message and post it to the message board. The message must be non-empty, and at most 128 characters long:
    - User can type message in the text box undernead the header of the WebApp. If an user attempts to post a message that is empty, an error message would appear and would not post an empty message. Similarly, if a message that is longer than 128 characters were inserted, an error message would appear. 

2. Users should be able to see messages on the message board from most to least recent.
    - Users can see the most recent messages, along with the date and time posted. They are able to scroll down to see the different messages, and can also go to the next or prev page to see more messages.

3. Users on different computers should be able to post to the same board and view each other’s messages.
    - Users can see each other's messages if they install this project repo and run the application. Though on different computers, they will be able to see each other's messages from before. However, since this project is locally hosted, if they were to insert a new message while the second user has the message board already instantiated, the second user must refresh the page to see the new message. In other words, real-time synchronization of data exists but not webpage. 

## Extra Components
1. Profanity Screening:
    - Similar to empty or long messages, if the user used profanity in their message, they would receive an error message and the application would not insert their message into the database or post it. This is achieved through Profanity Filter API by API-Ninjas
2. Filter by Dates:
    - This feature allows the user to filter the messages by the date they are posted. If someone would find a message or look for messages that were posted on 12-07-2023, they can simply select the date. If they would like to see all the messages again, they can click the reset button.
3. Message Pages:
    - While this is a small feature, the messages are shown in increments of 10. Users can see how many pages there are of the messages and can navigate forward and backward on the pages. 

## Reflections && Future Improvements
Overall, I enjoyed this project a lot because I learned to use many tools that I have not used before. I particularly enjoyed playing around with the fonts and images for just a little bit. If time permitted, I would have love to made the message board more fun and creative visually and also implements some more features including: 
    1. allowing the users to jump from pages to pages instead of manually 
    2. allowing users to delete their messages (DELETE method) and created user accounts since Supabase supported user authentication
    3. optimize the way that data is retrieved whenever a new message is posted 

