# Reentry Resources Hub

We built the [Buncombe Reentry Resources Hub](http://www.buncombereentryhub.org/) to help those returning
to the community after a period of incarceration or suffering the consequences of a criminal conviction
on their record. Now we are working to scale this resource to every county in North Carolina.
We need help from developers ((Node, React) and writers.

If you are interested in helping, check out the tasks [here](https://github.com/CodeForNC/reentry-resources-hub/projects/3).
This is where we put tasks that don't require deep knowledge of all aspects of the project. If you are an experienced
developer and willing to commit more effort over a longer term, check out the tasks
on [this page](https://github.com/CodeForNC/reentry-resources-hub/projects/2).


## Installation
Make sure you have [Node](https://nodejs.org/en/) >= 4 installed (we strongly recommend using Node >= 6 and npm >= 3).
We prefer to use the [yarn](https://yarnpkg.com/) npm client.

To install, clone this repository and a suitable content directory and ensure that the content directory set in ./src/config.js points to it. If you clone the [nc-reentry-resources-content](https://github.com/CodeForNC/nc-reentry-resources-content) repository side-by-side with this repository, the default configuration will work. From within the directory, run:

````
    cd reentry-resources-hub
    yarn
    yarn start
````

If you prefer to use npm, the equivalent procedure is:

````
    cd reentry-resources-hub; 
    npm install
    npm start
````

The application is running at http://localhost:3000/. The server is also running, but at http://localhost:3001/.

## Basic architecture

The server side is implemented via Express. The public site is a Universal React App rendered on the server on initial request, and subsequent requests are rendered by the client. The administrative front end is a React app built
using [create-react-app](https://github.com/facebookincubator/create-react-app) and Bootstrap.
We've integrated that with the server based
on [this blog post](https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/).
