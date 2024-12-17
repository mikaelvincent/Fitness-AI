# API Server Setup Guide

## Overview

This guide provides step-by-step instructions to configure and initialize the **Fitness AI** API server, developed using Laravel.

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

   > **Note**: Update the `.env` file with settings specific to your environment, including database credentials, API keys, and other configuration details.

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
