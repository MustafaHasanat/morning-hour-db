<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# The database for the Morning Hour website

## Authentication
use the roles of users to build guards to limit their access to the endpoints accordingly

admin:
- no limits 

member: 
- create, edit, and delete Reviews and Orders
- edit a user
- can't create or edit anything else
- get Orders

public: 
- create a user
- can't create or edit anything else
- get Authors, Categories, Items, Reviews


## Dockerization
create a (DockerFile) and (docker-compose.yml)


## Filters in backend
like (get items which their titles starts-with/contains a string)


## Sorting in backend
like (get items sorted by their titles ascending)


## Pagination in backend
return the data rows as pages of 25 items at a time (25 is the default, we can give it 50, 75, 100)
this will be applied to all endpoints that return data (the GET requests)


## Error handling 
never return 500, return specified codes for all possible scenarios 


## Notification
- add a new column (notification) that will be linked to each user (many-to-one) which represents a 
notification for that user like (welcome message after signing-in, someone edited your data, ...)
- add a new field to the users entity (notifications) which will hold the notifications for that user 
- the frontend side will only need to check the notifications for that user to show them to him

- notification entity:
  - id
  - userId
  - message
  - isRead


## Email service
- add a password reset
- we need an email service using an email service (use node mailer, send grid)
- we will use it to send confirmation emails to users


## DB localization
we need to send all data with the requested language


## Admin panel (dashboard)
- make a table (access levels for users)
- make a special endpoints for admins only


## Testing
perform unit tests and integration tests

