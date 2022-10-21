# Swadesh Assignment v1.0

This is the server of the Assignment. It is an express server with Typescript and Prisma with Postgres. Built this alternate flavour to enable db transactions.

## Features

- add user with unique UUID
- fetch user with UUID
- create transaction with all given validations and constraints  
- fetch all the transactions of a certain user
- delete transactions of a certain user
- db transactions enabled

## Important

if you have a local instance of postgres server running on your local machine then add a .env file in the root directory of the server and add the following lines

    DATABASE_URL="postgresql://<postgresusername>:<postgres password>@localhost:5432/swadesh?schema=public"

if not installed then use docker to create a local instance of postgres server

    docker run --name swadesh-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

## Local Setup

once you have a postgres instance up and running then you need to run prisma to create the database and tables for you

    yarn
    yarn prisma db push //pushes the schema to the database
    yarn prisma studio //opens the prisma studio to see the tables on http://localhost:5555
    yarn dev

this will install all the dependencies, set up your db and start the server on [localhost:8080](http://localhost:8080).

then you got to go to <http://localhost:5555> and after going to the user table add a record with uuid as "admin" and update the balance to "1000000"

