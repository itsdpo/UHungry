Denis Po
101139188
Assignment 4

NOTES: 

1. You will have to run npm install to install all the necessary node modules however sometimes express-session and connect-mongodb-session might need manual npm install.
2. Assuming the mongo daemon is already running, initialize the database by running "node database-initializer.js" in the root folder of the project.
3. I have a node module that starts my application server with the command npm start. Use "npm start" once in the root folder of the assignment.
4. Navigate to localhost:3000 to view the web app

COMPLETED ALL ELEMENTS OF THE ASSIGNMENT
Navigation Header (12 marks): DONE
	3 - Shows correct information when client is logged in DONE
	3 - Shows correct information when client is not logged in DONE
	4 - User can login to the system through a login form in the header or on a login page that can be reached via a link in the header DONE
	2 - User can log out through link/button in header DONE
	
User Registration (16 marks): DONE
	5 - New user can specify a username/password and register through the registration page DONE
	3 - Duplicate names are detected and an error is displayed DONE
	3 - The user is redirected to their profile page after successful registration DONE
	3 - The user is 'logged in' to the system upon successful registration DONE
	2 - New users start with privacy set to false and no order history DONE
	
User Directory (12 marks): DONE
	4 - Returns all usernames that match the search parameter DONE
	4 - Returns only non-private profiles DONE
	4 - Links in provided HTML are to correct profile page resources DONE
	
User Profile Page (20 marks):
	3 - Responds with 403/404 error if profile is private and requesting client is not logged in as the user DONE
	4 - Shows the username and order history if profile is not private or requesting client is logged in as the user DONE
	3 - Order history links are to correct order resources DONE
	7 - If user is logged in and viewing their own profile, they can change their privacy setting and save the changes to the server DONE
	3 - Does NOT show privacy settings if the client is not logged in as the owner of the profile DONE
	
Order Summary Page (15 marks):DONE
	5 - Responds with 403/404 error if user who placed order is set to private and requesting client is not logged in as that user DONE
	6 - Page contains summary of item names and quantities in the order DONE
	4 - Page contains other required data (restaurant name, username, subtotal, tax, delivery fee, total) DONE
	
Order Form (10 marks): DONE
	3 - Order form is only viewable by logged in users DONE
	4 - Order form contains correct navigation header DONE
	3 - Order form supports minimum required functionality DONE

Code Quality and Documentation (15 marks): DONE
Your code should be well-written and easy to understand. This includes providing clear documentation explaining the purpose and function of pieces of your code. You should use good variable/function names that make your code easier to read. You should do your best to avoid unnecessary computation and ensure that your code runs smoothly throughout operation.