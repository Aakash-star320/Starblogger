# Blog Web Application

A web application designed for creating, viewing, updating, and deleting blog posts. This application provides a simple interface for managing content with session-based interactions.

## Features

- **Create Posts**: Write new blog posts with titles, tags, and content.
- **View Posts**: Distinct view for reading blog posts.
- **Update/Edit**: Modify existing posts.
- **Delete**: Remove posts you no longer need.
- **Session Management**: Uses Redis for handling user sessions.
- **In-Memory Storage**: Blog posts are stored temporarily in application memory.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript templating), CSS
- **Session Store**: Redis (via `connect-redis` and `redis` client)

## Prerequisites

Before running this application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [Redis](https://redis.io/) (for session management)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd Blog_Web_Application
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

## Configuration

The application uses Redis for session storage. You may need to configure the connection settings in `index.js` if your Redis instance is not running on the default local settings or the hardcoded specific host.

Open `index.js` and locate the Redis client initialization:

```javascript
let redisClient = createClient({
  socket: {
    host: 'YOUR_REDIS_HOST', // e.g., 'localhost' or your cloud provider host
    port: 2800,              // Update port if necessary (default Redis port is usually 6379)
    timeout: 10000,
  },
});
```

> [!NOTE]
> The default port in the code is set to `2800`. Standard Redis port is `6379`. Ensure this matches your Redis server configuration.

## Usage

1.  **Start the server:**

    ```bash
    node index.js
    ```

    The server will start on port **4000** by default.

2.  **Access the application:**

    Open your web browser and navigate to:
    `http://localhost:4000`

## Project Structure

- `index.js`: Main entry point of the application. Handles server setup, routes, and Redis connection.
- `views/`: Contains EJS templates for the frontend (`index.ejs`, `write.ejs`, `update.ejs`).
- `public/`: (Optional) Static files like CSS and images.

## Important Notes

- **Data Persistence**: Currently, blog posts are stored in an in-memory array (`posts` variable in `index.js`). **Restarting the server will result in the loss of all created posts.**
- **Sessions**: Session data is stored in Redis.

## License

ISC
