# Instructions of running the project
1. Git Pull this repo
2. cd to both frontend and backend folder
3. On the frontend, run "npm run dev" to start the frontend service
4. On the backend, run "npm start" to start the provided backend service
5. There you have it

# Discussion Points
This project is built using React, TypeScript, Material UI, Recharts, and Vite. 
=================================================================================
React and TypeScript are the required of this project. 
Material UI for prettier and consistent styling UI.
Recharts for displaying the analysed/processed data into different charts for the CFO to overview. More types of charts and data group can be presented, but due to limited time I only selected a few to display. Of course there is room for improvement. 
Due to limited time, not all of the components are responsive. 
Next.js was originally chosen due to fast start up, good performance, and good routing. However, I found out it runs too slow in the development environment (which can be seen on several discussions online), which wasted a lot of time waiting for it to refresh. Therefore, I switched to Vite and the loading time is wayyyyyy better. This is partly the reason why I used so much time in the development. 
=======================================================================================================
My development flow (I am not available on Tuesday and Thursday Full Day): 
Monday Evening - received the brief, ideas brainstorm and generation, reseacrhed relevant framework/libraries
Wednesday Full Day - wrote actual code, bumped into slow loading issue using Next.js, decided to switch to Vite
Thursday Evening - reviewed the code and wrote this README.md

# Discussion you'd bring to a meeting with the backend developer on how to improve the service
1. Event JSON data structure: I feel like the data structure can be more "normalised", e.g., Restaurant ID should be present in all orders regardless of their state "created, enroute, delivered, cancelled" as this would simplify the frontend data cleaning to display in charts, such as displaying order status by restaurant. 

2.Event filtering at the server side: If the dataset keeps growing, it may not be feasible to receive all data everytime we start the frontend. Can we filter it in the backend before passing it to the frontend? This would improve the loading time in displaying the charts in frontend and ease the bottleneck condition of backend service. 

3. WebSocket scalability: It currently works fine for this small dataset, but if grows large, how can we ensure the loading time won't be slow and crash the application? Are there load balancers or message queues services we can implement in between? 

4. Authentication: Currently we are developing it locally, but what if we publish it as a public service, how can we ensure the security of accessing the backend services and API endpoints? We should implement some authentication measures to meet the best practice like JWT or OAuth. 