# Stampix Node.js & Serverless challenge

## Setting
Cloud-based AWS Lambda functions with a Node.js 12 runtime written in TypeScript.

## Goal
This repository contains a populated SQLite database consisting of 50 users. The goal is to create 3 functions, corresponding to 4 operations on the database: creation, retrieving, listing & searching.

The following REST API is set up already for you (see Practical):

1. A list of users: `GET http://localhost:3000/users`
2. Get a specific user: `GET http://localhost:3000/user/{id}`
3. Create a user: `POST http://localhost:3000/user`

Endpoint one should both be able to:

1. List all users
2. Find all users with a specific first name

Endpoint two and three are straight-forward.

## Practical
1. Clone this repo and install the already existing development dependencies.
3. Write your functions according to AWS Lambda standards using the Node.js 12 runtime inside `/src/*.ts`
4. Start the compiler using `yarn watch`, this will pro-actively compile your changes .
5. In another terminal, run a local server using `yarn start`, this will make the local endpoints available.

## Requirements
1. The 3 functions should do what they are supposed to do according to the goals of this challenge.
2. You should add automatic testing and make sure that `yarn test` does what could be expected of it in a CI/CD context.
3. Document your code as you would in any collaborative project

## Food for thought
Think about the following questions and formulate an answer below. Think about the difficulties or edge-cases you would encounter. How would you tackle these?

The number of users suddenly increases to over 10,000. What comes to your mind with relationship to the functionality you just wrote?

Have a look at the datastructure of the database (i.e. have a look at `scripts/populate.js`). Now assume that we are not using SQLite, but MySQL 8. What would you do differently?

Suppose we want to set up a search function for the users where we can search with an arbitrary input value. How would you do this?

### Your answers

#### 1. Scalability (# of users increases over 10,000)

If the amount of users increases, our database will get a lot more records as each user has its own record. So I would start with doing additional research on our database technology to make sure that our database is able to scale and will not cause any bottlenecks. Additionally, searching based on names will become slower as the amount of records increases. For this reason looking towards indexes for data fields like first_name and last_name that are used to seach for users can be beneficial. I would also try make sure that my AWS Functions are as lightweight as possible. Tools like serverless-plugin-reducer could be used to make sure that only the necessary dependencies are uploaded. 

#### 2. Different database

When using a different database or migrating our application to a different database, I would make sure to define the database models, rather than just creating a database with a script. A possible way of doing this, is by creating a class for each model in our database. This enables us to separate the service and business concerns from our database related stuff. In other words, we can keep our database related methods in their own separate modules. This eases the development of additional API endpoints and unit tests and could also eliminate some duplicate code. 

#### 3. Search function for users with arbitrary input

The first solution that comes to mind is to add the type of attribute that is used when searching. This could then be substituted into our query. Another solution could use MySQL's composite indexes. These are indexes which span over a max of 16 columns and thus could enable us to search for an index over multiple columns. 

## Delivery
- Anything that is not enforced in the base repository (tools, dependencies, architecture, frameworks, ...) is free of choice
- Push your solution to your Git platform of choice, as long as it's public.

**Note**: There's no need to actually use the AWS Cloud.
