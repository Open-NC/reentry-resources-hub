# Reentry Resources Hub

The Reentry Resources Hub is intended to help those returning
to the community after a period of incarceration or suffering the consequences of a criminal conviction
on their record. We originally built the [Buncombe Reentry Resources Hub](http://www.buncombereentryhub.org/) covering a single county. This project scales that resource to every county in North Carolina.

## Installation

This repository contains code for both server and client. To develop on your local machine, you will need to install ```node```, ```yarn``` and ```postgresql```. A recent version of ```node`` is required (version >= 7.6). 

On a Mac OSX machine, you may install the dependencies using [Homebrew](https://brew.sh/). Once you have Homebrew installed, run the following commands:

````
    brew install node
    brew install yarn
    brew install postgresql
````

Next, clone this repository (or a fork of this repository) and install dependencies:

````
    git clone https://github.com/Open-NC/reentry-resources-hub.git
    cd reentry-resources-hub
    yarn
````

The descriptions and resource information are stored in a database on AWS. Open an [issue](https://github.com/Open-NC/reentry-resources-hub/issues) and mention [@ejaxon](https://github.com/ejaxon) to obtain credentials or learn how to create a copy of the database. Once you have your username and password, copy the ```server.env.example``` file to ```.env``` and replace the placeholder text with your username and password.

You may then run the site locally by running:

````
    yarn start
````

The application is running at http://localhost:3000/. The server is also running, but at http://localhost:3001/.

## Deployment -- NOT VERIFIED

In one terminal, run `node server/index.js`.  In another terminal, run `yarn build` or `npm run build`.

If you want to push the contents of the build folder to GitHub pages, run `yarn deploy`.
