# SeekPick-Backend

## Folder Structure

```
|--- src
     |--- models
     |--- routes
     |--- utilities
|--- Procfile
|--- package.json
|--- app.js
```

## src
This folder contains all the  functionality of routes and database info in it.

### models
This folder has defination of all the database tables.

### routes
This folder has code for all the apis with their functionality.

### utilities
This contains helper functions and config file needed at various places in  routes.

## app.js
It is the first file which runs on the start of server and connect it to daatabase and define all the routes.

## package.json
It is the complete description of the project with all the info of modules used and scripts.

## Procfile
This file is used for deployment of project on **Heroku** where heroku is informed to run the app.js via this file.
