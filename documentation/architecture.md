# General Architecture
The reentry resources hub is a simple website consisting of a few standard topic pages.
Each page is generated from a combination of common (national and state-wide) information and
local information. 

# Public Site
A simple Node Express site is used to generate pages for the public site, based on parameters
that are either explicitly in the URL or stored for a mapped domain.

# Administrative Site
The administration of the site is performed through a separate React App ...

## Additional Scripts
There is also an ````init```` directory that contains a script and some template files
that may be used to create a new clean copy of the content directory. 

