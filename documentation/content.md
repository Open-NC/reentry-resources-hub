# Content Architecture & Design

The content is stored in files within the ````content```` directory. The use of files
rather than a database makes it much simpler to maintain and replicate the site since
everything is checked into this repository.

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
