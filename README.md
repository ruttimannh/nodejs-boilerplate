# ASAPP Chat Backend Challenge v1
### Overview
This is a Nodejs based boilerplate which runs an HTTP Server configured to answer the endpoints defined in 
[the challenge you received](https://backend-challenge.asapp.engineering/).
All endpoints are configured in `index.js` and if you go deeper to the controllers
for each route, you will find a *TODO* comments where you are free to implement your solution.

### Prerequisites

Installed Nodejs >= v8.x

### How to run it

```
npm start
```

#### Notes
I asumed that the media was procesed before calling the API. By procesed I mean that the client has access to the metadata
and that can add it to the different data fields. Also, that is stored in a url accesible by the client.

I'm aware that for part of the code I wrote should go on the models instead of the controllers. But I was not not sure where to
draw the line.

I asumed that to send a message you will need to have the sender token and not be anyone with a valid token.
Also I asumed that to get the messages, you will need to have the recipent token to access those messages.


#### Users and tips
You can start testing the API by using the commands:

POST /check just to check that everything is working and the database and tables are ok

POST /user to create a user
json {
  username,
  password
}

POST /login to login. Here are some users to test so you dont have to create them:
username: person1
password: 1person
id: 1
token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImlhdCI6MTYyMjE1NTI1NiwiZXhwIjoxNjIzMzY0ODU2fQ.1LBiBL9W4FZo09jVjG82VG-OwePJ3qoM8l3SjPGXa1o"

username: person2
password: 2person
id: 2
token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjIsImlhdCI6MTYyMjE1NTM0MiwiZXhwIjoxNjIzMzY0OTQyfQ.rYUFpOgz5Syd8teKFWKezc7mOt1jBDiglqA6Xi2eSmo"

username: rutti
password: rutti
id: 3
token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjMsImlhdCI6MTYyMjE1NTMyMywiZXhwIjoxNjIzMzY0OTIzfQ.bXn4Ghyq_iDNYxU0rGxB3jKvdO7azWNsV5RsFnZEimY"

username: hernan
password hernan
id: 4
token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjQsImlhdCI6MTYyMjE1NTMwMywiZXhwIjoxNjIzMzY0OTAzfQ.rBX18TA0AQTINMwe9RPRPThgsUCNpZfWRah2cDY4KTc"

POST /message to send a message to a user. You will need to use the sender id and the recipent id.
Also you need the token for that user to verify the message
For text messages
json{
  recipent,
  sender,
  content{
    type text
    text
  }
}
For media messages
json{
  recipent,
  sender,
  content{
    type image|video
    url
    metaExif
    metaOrd
    metaXmp
    metaIcc
  }
}

GET /message?recipent=&start=&limit= to get messages received by a recipent starting with an specific messageId
Send the limit is optional. Default 100
