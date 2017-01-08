# Reentry Resources Hub

Reentry resources site that provides information for all 100 NC counties (and, in principle, could be
replicated for other states). This is the follow-on effort to
the [Buncombe County Reentry Resources Hub](http://www.buncombereentryhub.org/).

If you are interested in helping, check out the tasks [here](https://github.com/CodeForNC/reentry-resources-hub/projects/1).


## Installation
Make sure you have [Node](https://nodejs.org/en/) >= 4 installed (we strongly recommend using Node >= 6 and npm >= 3).
We prefer to use the [yarn](https://yarnpkg.com/) npm client. 

To install, clone this repository. From within the directory, run:

````
    yarn
    cd client; yarn; cd ..
    yarn start
````

If you prefer to use npm, the equivalent procedure is:

````
    npm install
    cd client; npm install; cd ..
    npm start
````

The application is running at http://localhost:3000/. The server is also running, but at http://localhost:3001/.
