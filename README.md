# BE-INGCO
## WARNING THIS REPO IS DEPRECATED 
This api migrated to V2 (nest.js + pg and prisma orm)

## Backend API for B2B Shop Ingco

Welcome, repository houses the implementation of REST endpoints tailored for both frontend and CRM systems. These endpoints facilitate seamless control over content and user management within the B2B Shop ecosystem.

## Built with

- TypeScript
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- Joi 
- multer (sharp)
- excel.js
- sendgrid

## Local setup

- clone repository `git clone https://github.com/yourusername/your-repo-name.git`
- navigate to the directory
    `cd your-repo-name`
- set environment variables in `.env` file, look for an example in the `.env.example` file (need MongoDB database as well)
- run the build script `npm run build`
- run script `npm start`
- server ready to serve requests on `http://localhost:{port}/api/{endpoint}`
