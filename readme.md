npm init --yes -> Initialize the paxkage.json with default configuration/settings

--------------------------------------------------------------------------------------------------------
Node supports only ES5 fetaures.
So we cannot write ES6 features like  ->  import express from 'express';
Therefore we have to use ->  const express = require('express');

But we can converte ES6 to ES5 feature using BABEL :) to do convert our ES6 code to ES5 code
Goto > https://babeljs.io/setup#installation

->  npm install --save-dev babel-cli babel-preset-env


NOTE: Above dependencies have been installed as -D or --save-dev as -> DevDependencies (i.e- only use this
dependency in development envirnomnet but not in prod)

-> After that create .babelrc (file)
then add -> {
    "presets": ["env"]
}

-> Goto package.json -
    "start": "nodemon server/app.js --exec babel-node --presets env"

Now we can use ES6 fetaure in Nodejs using babel (dev dependency)
THe above code works for dev envirnomnent, for production env ->

Add below command in package.json-
"build": "babel server -d dist --source-maps",
"serve": "node dist/app.js"

run cmd -
npm run build (create a dist folder)
npm run serve (will run/execute files in dist folder, which for production env)

--------------------------------------------------------------------------------------------------------
EsLint -> For checking code quality in Nodejs (i.e- to be specific for .js file) we will use eslint

$ npm install -g eslint
$ eslint --init
$ eslint <folder_name (or) file_name>

To fix an eslint issue cmd-> $ eslint <folder_name (or) file_name> --fix

TO SET ESLINT visit -> https://eslint.org/docs/rules/

--------------------------------------------------------------------------------------------------------
#Debugging Node Application -

$ npm run build-copy-all
$ npm run debug-dist

-> open chrom browser > visit - chrome://inspect > click on inspect link > opens new browser > 
   Source (tab) > +Add folder to workspace (open workspace which u want to debug) >
   Apply break.points where you want to debug 


#Alternate way of debugging-
Using VSCode debugger >
 Add Configuration > Select Nodemon > (Add this configuration)
       {
            "type": "node",
            "request": "launch",
            "name": "nodemon",
            "runtimeExecutable": "nodemon",
            "program": "${workspaceFolder}/dist/app.js",
            "restart": true,
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen",
            "sourceMaps": true
        },
Click play button and apply break points in the server folder (dev code), bcoz we have used property
"sourceMaps": true in above code.
And Remebere the use of sourceMaps :) which we use to generate in our dist folder while executing build cmd

--------------------------------------------------------------------------------------------------------
Joi -> 
npm i joi

This is joi, joi allows you to create blueprints or schemas for JavaScript objects (an object that stores information) to ensure validation of key information.

Note: Joi is mainly used to validate the request body recieved from frontend is valid (i.e- has required
fileds/property, has valid data-type, length of the field/property).
Thus Instead of we validting this code by manually/programtically, we can use JOI

  
------------------------------------------------------------------------------------------------------
Google Authentication-
https://console.developers.google.com/
Create New Project > Project Name : Social Authentication > Select Social Authenticatio project >
APIs and Service -> Library > Search for : Google+ API > Enable > APIs and Service -> Credentials >
OAuth Conset Screen (tab) >
                           Application Name : Social Authentication , (same Name as Proj Name)
                           Save    
Credentials(tab) >                           
Create Credentials > OAuth Client ID > Web Application > 
                           Name : Invoice-Builder
                           Authorize redirect uri: http://localhost:3000/api/auth/google/callback 
                           Create  
 You Will get ClientId and Client Secret (copy that, or else download that json file itself)

Intall -> passport-google-oauth


------------------------------------------------------------------------------------------------------
Twitter Authentication- 
https://developer.twitter.com/  (first login to ur twitter account)


Apps (https://developer.twitter.com/en/apps) >   create a developer account >
                 Choose User Profile - sabunkartejas@gmail.com
                 Account details - I am requesting access for my own personal use   
                                    account Name : InvoiceBuilder
                Use Case Details - (select appropriate, or else like prev ur account wuld be suspeneded)
                Terms of Services - Submit application   

 (you will recieve confirmation mail, confirm that link)

 (select ur Project InvoiceBuilder)   > Create an App(row select) >  Create an App(button) >                             App Name : InvoiceBuilder
              Application description :  Invoice Builder Application for MEAN Stack Application
              Website URL :   https://github.com/tsabunkar
              Allow this application to be used to sign in with Twitter : Enable (select)
              Callback URLs : http://localhost:3000/api/auth/twitter/callback
                                              (or)
                              http://192.168.56.1:3000/api/auth/twitter/callback
                                              (or)
                              http://127.0.0.1:3000/api/auth/twitter/callback
             Desription : (Detail description of our application)

             Create


Keys and tokens (tab) > Here u will find COnsumer API keys and Access token and access token secerte

Install -> npm i passport-twitter


------------------------------------------------------------------------------------------------------
Github Authentication-
https://github.com/tsabunkar

Settings > Developers Settings > Register a new application > 
        Application name: InvoiceBuilder
        Homepage URL: http://localhost:3000
        Authorization callback URL: http://localhost:3000/api/auth/github/callback
    Register application

(you will get clientId and Client Secret)

Install -> npm install passport-github


------------------------------------------------------------------------------------------------------
Facebook Authentication-
https://developers.facebook.com

Create New App > 
            Display Name: InvoiceBuilder
            Contact email: sabunkartejas@gmail.com
            Submit 

Select a Scenario > Integrate Facebook Login

Note down (BasicSetting) - AppID : 324422161747848
                           App Secret : a24bffadd5f76b31763745d8bd5efff6
                           Add platform - Select (web)
                           Site Url: http://localhost:3000

Settings > Advanced > 
                    Client token : (cpopy this value)

Dashboard > Make sure facebook login extnension or plugin is installed

Facebook Login > Quick Start > Follow the pocedure


Install -> npm install passport-facebook


------------------------------------------------------------------------------------------------------
To Send Email to the end-client use -> Nodemailer 

for SMTP (Simple Mail Transfer Protocol ) service use -> https://ethereal.email/

username - v5zy7qcua45cedpd@ethereal.email
password - fDgpCYCeyJ5gfpqnaX

Install ->
npm i nodemailer
npm i html-to-text
------------------------------------------------------------------------------------------------------