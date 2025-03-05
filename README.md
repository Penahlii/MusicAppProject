MusicAppProject
MusicAppProject is a comprehensive music streaming application designed to provide users with seamless access to a vast library of songs, artists, and albums. Built with a microservices architecture, it ensures scalability, maintainability, and efficient development.

Features
User Authentication: Secure user registration and login functionalities.
Music Library: Browse and search for songs, artists, and albums.
Playlist Management: Create, edit, and manage personal playlists.
Music Playback: Stream songs with play, pause, skip, and volume control features.
Responsive Design: Optimized for various devices, including desktops, tablets, and mobile phones.
Project Structure
The solution is organized into multiple projects, each serving a distinct purpose:

ApiGateway: Acts as the entry point for client requests, routing them to appropriate services.
MusicApp.Identity.IdentityService: Manages user authentication and authorization.
MusicApp.Infrastructure.Business: Contains business logic and service implementations.
MusicApp.Infrastructure.Core: Includes core utilities and shared components.
MusicApp.Infrastructure.DataAccess: Handles data persistence and database interactions.
MusicApp.Infrastructure.Entities: Defines data models and entities.
MusicApp.Infrastructure.Middlewares: Implements middleware components for request processing.
MusicApp.Music.MusicService: Manages music-related operations and data.
musicapp.webui.react: Front-end application built with React, providing the user interface.
Technologies Used
Back-End:
C#
ASP.NET Core
Docker
Front-End:
React
TypeScript
CSS
Database:
SQL Server
DevOps:
Docker Compose for container orchestration
Getting Started
To run the application locally, follow these steps:

Clone the repository:

bash
Copy
Edit
git clone https://github.com/Penahlii/MusicAppProject.git
cd MusicAppProject
Set up the environment:

Ensure Docker is installed and running on your machine.
Configure environment variables as needed for each service.
Build and run the services:

bash
Copy
Edit
docker-compose up --build
Access the application:

The API Gateway will be accessible at http://localhost:[PORT].
The React front-end can be accessed at http://localhost:[PORT].
Contributing
Contributions are welcome! Please fork the repository and create a pull request with your proposed changes. Ensure that your code adheres to the project's coding standards and includes appropriate tests.


Contact
For questions or suggestions, please contact the project maintainer:

Name: Ibrahim Penahli
GitHub: Penahlii
