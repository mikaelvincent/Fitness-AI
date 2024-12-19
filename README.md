# API Server Setup Guide

## Overview

This guide provides step-by-step instructions to configure and initialize the **Fitness AI** API server, developed using
Laravel.

## Prerequisites

Before proceeding, ensure your local environment meets the following requirements:

- **PHP** (version 8.0.30)
  > **Note**: PHP 8.0.30 is the tested and supported version. Compatibility with other versions is unverified.

- **Composer**

- **Database Management System (DBMS)**
  > **Note**: Laravel supports various DBMS options, such as MySQL, PostgreSQL, and SQLite.

## Configuration

Follow these steps to set up the API server:

1. **Navigate to the API Directory**

   Access the `api-server` directory of the project:

   ```bash
   cd api-server
   ```

2. **Environment Configuration**

   Duplicate the example environment configuration file:

   ```bash
   cp .env.example .env
   ```

   > **Note**: Update the `.env` file with settings specific to your environment, including database credentials, API
   keys, and other configuration details.

3. **Install Dependencies**

   Install the required PHP packages using Composer:

   ```bash
   composer install
   ```

4. **Generate Application Key**

   Create a unique application key for encryption and security:

   ```bash
   php artisan key:generate
   ```

5. **Database Setup**

   Create the database in your DBMS, then run migrations to set up the necessary tables:

   ```bash
   php artisan migrate
   ```

## Testing

To verify that the application is functioning as expected, execute the test suite:

```bash
php artisan test
```

## Running the Application

Start the application server with the following command:

1. **Start the Application Server**

   ```bash
   php artisan serve
   ```

2. **Start the Queue Worker**

   In a separate terminal window, start the queue worker to process queued jobs:

   ```bash
   php artisan queue:work
   ```

   > **Note**: The queue worker must be running to handle asynchronous tasks such as OpenAI API calls.

---

# Mail Server Setup

## Overview

Configure Mailpit, a local email testing tool, for the Fitness AI API server to capture and inspect outgoing emails
during development.

## Prerequisites

- **Mailpit (latest version)**
  -**Installation Methods:**
    - Docker
    - Homebrew (macOS)
    - Direct Binary Download

## Installation

### Using Docker:

```bash
docker run -d -p 1025:1025 -p 8025:8025 mailpit/mailpit
```

- SMTP: localhost:1025
- Web Interface: http://localhost:8025

### Using Homebrew (macOS)

```bash
brew install mailpit
mailpit
```

### Direct Binary Download:

Download from [Mailpit](https://mailpit.axllent.org/docs/install/) Releases, extract, and add to your PATH.

## Configuration

1. Navigate to the API Directory

```bash
cd api-server
```

2. Update .env File

```bash
MAIL_MAILER=smtp
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=your-email@example.com
MAIL_FROM_NAME="Fitness AI"
```

## Running Mailpit

- **Docker:**

```bash
docker run -d -p 1025:1025 -p 8025:8025 mailpit/mailpit
```

- **Homebrew:**

```bash
mailpit
```

## Testing

1. Start API Server

```bash
php artisan serve
```

2. Trigger an Email Action by registering a new user or sending a password reset email.
3. View Emails

- **SMTP:** localhost:1025
- Open http://localhost:8025 to see captured emails.

## Tips

- Clear Emails via Mailpit web interface.
- Persistent Storage: Configure Docker volumes if needed.
- Security: Set up authentication as per [Mailpit Docs](https://mailpit.axllent.org/docs/).

---

# Frontend Setup Guide

## Overview

This guide provides step-by-step instructions to configure and initialize the **Fitness AI** frontend application,
developed using React.

## Prerequisites

Before proceeding, ensure your local environment meets the following requirements:

- **Node.js** (v16+)
  > **Note**: Node.js version 16.x is the tested and supported version. Compatibility with other versions is unverified.

- **npm** or **Yarn**
  > **Note**: Either package manager can be used based on your preference.

## Configuration

Follow these steps to set up the frontend application:

1. **Navigate to the Frontend Directory**

   Access the `frontend` directory of the project:

   ```bash
   cd frontend
   ```

2. **Environment Configuration**

   Duplicate the example environment configuration file:

   ```bash
   cp .env.example .env
   ```

   > **Note**: Update the `.env` file with settings specific to your environment, such as the backend API URL:

   ```bash
   REACT_APP_API_URL=<YOUR_BACKEND_API_URL>
   ```
    - Example:
      ```bash
      REACT_APP_API_URL=http://127.0.0.1:8000
      ```

3. **Install Dependencies**

   Install the required Node packages using your preferred package manager:

    - Using **npm**:
      ```bash
      npm install
      ```  
    - Using **Yarn**:
      ```bash
      yarn install
      ```

## Running the Application

Start the development server with the following command:

- **With npm**:
   ```bash
   npm run dev
   ```  

- **With Yarn**:
   ```bash
   yarn dev
   ```

The application will be accessible at:

```bash
http://localhost:5173
```

> **Note**: Ensure the backend API server is running and reachable at the specified `REACT_APP_API_URL`.

## Build for Production

To generate an optimized production-ready build of the application:

- **With npm**:
   ```bash
   npm run build
   ```  

- **With Yarn**:
   ```bash
   yarn build
   ```

The build files will be output to the `build` directory, ready for deployment.
