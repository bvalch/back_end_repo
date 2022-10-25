# back_end_repo

To run the backend:

1/To install dependencies run 'npm install' in terminal @ root directory
2/create a .env file, set two variables ACESS_TOKEN_KEY and REFRESH_TOKEN_KEY to equal a secure string of your choice, you can use the core node module crypto to generate a secure hashed string of random charachters.
3/Set up your connection to mongodb by modifying the dbConn.js file in the middleware folder.
4/Modify the default port on which express will run if required,variable is set in the server.js file
5/type 'npm run dev' in console to start the dev server with nodemon, you should see a success message printed in the console when the app initiates

The front end for this project can be forked from 
https://github.com/bvalch/front_end_repo
