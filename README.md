Visit this url: https://www.dropbox.com/s/ilhz8sh59hegoxq/pokerAppDemo2.mov?dl=0 
to see a brief demonstration of this application.

Prime Scholarship Fund
The Prime Scholarship Fund is a full-service database application that is intended to be used by three types of users: applicants, admins, and donors.

Applicants can use the service to apply for scholarships to Prime Digital Academy. Admins can review and process applicants through the cycle of an application. Donors may donate through the secure Stripe API which has been integrated into the application.

Built With
React
Express
PostgreSQL
Material UI
Passport
Stripe
SweetAlerts
Getting Started
Prerequisites
Node.js
Postico
Installing
Clone the GitHub repository down to your machine.
Navigate to the folder in your Terminal.
Create a .env file at the root of the repository.
Inside the .env file, add following lines of code:
SERVER_SESSION_SECRET=6JMTbuM6tVUkQYCyv8rQsNOLYwoMaQr0
NODE_ENV=test
Run the command npm install to install the dependencies.
Run the commands npm run server and npm run client in two separate Terminal tabs.
Database Set-Up
Using Postico, create a database called prime_scholarship.
Run the CREATE TABLE queries for the person, form, contact, demographics, income, and expenses tables located in the database.sql file. \
Ex.:

CREATE TABLE "person" (
    "id" serial PRIMARY KEY NOT NULL,
    "username" varchar(20) NOT NULL UNIQUE,
    "password" varchar(100) NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT 'false'
);
CREATE TABLE "form" (
    "id" serial PRIMARY KEY NOT NULL,
    "status" varchar(100),
    "person_id" integer NOT NULL REFERENCES "person" ("id"),
    "archived" BOOLEAN NOT NULL DEFAULT 'false',
    "comments" varchar(1000) NOT NULL DEFAULT ''
);
If you wish to have test data, run the INSERT INTO queries located in the database.sql file to insert the test data into the database tables. 
Ex.:
INSERT INTO person ("username", "password", "admin")
    VALUES ('administrator', '1234', true),
    ...
