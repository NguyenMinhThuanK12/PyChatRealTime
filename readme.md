# System Architecture

![system architecture](https://github.com/BuiBao3103/PyChat/blob/main/system%20architecture.png)
# Project Setup Guide

This guide will walk you through setting up the project environment for both the server and client components.

## Server Setup

### Step 1: Set Up Virtual Environment

Create a virtual environment named `.venv` in the server directory:
```
python -m venv .venv
```
### Step 2: Activate the Virtual Environment

Activate the virtual environment (for Window):
```
.venv\Scripts\activate
```
### Step 3: Create `.env` File

Create a file named `.env` in the server folder and configure it as needed.

### Step 4: Install Requirements

Install the required Python packages using `pip`:
```
pip install -r requirements.txt
```

### Step 5: Create Database
Create table in database (MySQL):
```
cd server && python database.py
```

## Client Setup

### Step 1: Install Dependencies

Install the required Node.js dependencies:
```
cd client && npm install
```
## Running the Project


In a separate terminal, navigate to the client directory and start the client:
```
cd client && npm start
```
The project should now be up and running! Access the client application in your web browser.

## Contributing

Feel free to contribute to this project by submitting bug reports, feature requests, or pull requests.

## License

This project is licensed under the MIT License.

# Project Structure

## Server
```bash
< server >
│   .env
│   .env.example
│   database.py
│   run.py
│
└───src
    │   auth.py
    │   config.py
    │   errors.py
    │   events.py
    │   forms.py
    │   models.py
    │   __init__.py
    │
    ├───controllers
    │   │   auth_controller.py
    │   │   conversation_controller.py
    │   │   friendship_controller.py
    │   │   message_controller.py
    │   │   user_controller.py
    │   │   view_controller.py
    │   └───__init__.py

    │
    ├───routes
    │   │   auth_routes.py
    │   │   conversation_routes.py
    │   │   friendship_routes.py
    │   │   message.py
    │   │   user_routes.py
    │   │   view_routes.py
    │   └───init__.py
    │
    └───util
        │   api_features.py
        └───util.py
```
