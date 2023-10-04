<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# The database for the Morning Hour website

## Authentication
done

## Dockerization
create a (DockerFile) and (docker-compose.yml)


## Filters in backend
done

## Sorting in backend
done

## Pagination in backend
done


## Error handling 
done

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
- we need an email service using an email provider (use node mailer or send grid)
- we will use it to send confirmation emails to users


## DB localization
we need to send all data with the requested language


## Admin panel (dashboard)
done


## Testing
perform unit tests and integration tests

