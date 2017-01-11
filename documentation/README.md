# Reentry Resources Hub Architecture

## Public Site

The reentry resources hub is a website consisting of a topic pages for housing, jobs, education,
benefits, and so on, served by Node Express.

Each page is generated on the server from a combination of common (national and state-wide) information and
local information. The content is stored in files within the ````content```` directory. The use of files
rather than a database makes it much simpler to maintain and replicate the site since
everything is checked into this repository. It also allows us to develop the public site without waiting
for development of the administration function.

The content is divided into common (national and state-level) and local (county)
directories. Each directory contains a set of standard page subdirectories corresponding
to the major topics: Home, Housing, Jobs, Public Benefits, Health Care, Education, Legal,
Support Programs, and Other Resources.

There are 3 types of content on each page:

- HTML block: General topic discussion
- Highlighted resource: Title, link and description of a resource
- Standard resource: Title, link and one-line description.

Each page has the following structure:

- Common description (HTML block - common to all sites)
- Local description (HTML block - optional additional introduction for local site)
- Highlighted resources (combined common and local, with local first)
- List of standard resources
  - Local
  - Regional
  - National


## Administrative Site
The administration of the site will be performed through a separate React App that communicates
with a simple API on the Node Express server (in the client subdirectory). This part of the
application has not been designed yet, but should provide:

- Login capability (probably using Firebase)
- Ability to authorize a user to edit only content in a local (county) section, only common content, or both.
- WYSIWYG editor for any HTML Block content
- Easy-to-use editor for highlighted and standard resources.

It is very important that the administration app be easy to use by non-technical users.

## Additional Scripts
There is also an ````init```` directory that contains a script and some template files
that may be used to create a new clean copy of the content directory. 

