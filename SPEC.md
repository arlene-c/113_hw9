# App Specification

## Overview

I would like to create a personal dictionary app that saves a user's American sign language words. The purpose is to help people remember and practice signs they may have already learned and organize them in one space. Inputting these vocabulary words into their personal dictionary can reinforce learning, and they can use it as a study tool or language helper when needed. The target audience is mainly students or anyone who wants to learn ASL.

## Core Features

- The app should have a home page displaying a welcome message and name of the app.
- The home page should give a brief description of the app and how to use it.
- It should let the user log in to their account or sign up with an account (email and password).
- Then, there should be two other pages: a page dedicated to adding signs to your dictionary and a page that displays/formats/organizes your current dictionary in a way that allows the user to go through and practice their old signs.
- After logging in, the user should directed to their dictionary page first (empty if first time user).
- There should be a navigation bar at the bottom to toggle between these two pages.
- The "add sign to dictionary" page should show a camera (so the app should be using some expo go camera module) and a button to take a picture OR video.
- When the user takes a picture or video, they should have the option to replay or watch it and retake it again if wanted.
- There should also be an input box for the user to type in what that sign means or translates to in English -- this is the "dictionary" definition component, it can be a word or a phrase
- Once they are satisifed, there should be a button to save both the video/picture and corresponding definition, to their personal dictionary, and there should be a confirmation message confirming that ASL sign was added.
- On the second page, the user's actual personal dictionary, it should be formatted in an organized and readable way similar to the "photos app". 
- The user should be able to scroll through their photos/videos and click into it -- when clicked into it, it should display the video/picture and the definition should be presented right below it. The user should be able to swipe left or right to get to their next dictionary word or phrase 
- In this page, the user should also be able to delete a word if they would like to.


## Screens & Navigation

There are three main screens as described above: 
- Home screen or landing page: this is what is shown when the user opens the app -- a welcome and introduction to the app and the option to log in or sign up
- Add to your dictionary page: this should display a camera where users can take a picture or video, input into a text box what the definition is, and save it 
- Personal dictionary: this should display all the saved words in the format described above


## API & Backend

There should be authentication related to logging in users and saving their information. Use external API, backend services, and Expo API routes as you see fit. You will likely need some sort of Expo module to activate the camera component of this application. You can modify the files in this application, but also add necessary files as you see fit.  


## Design & Branding

- Color palette: pastel pink and yellow colors of varying shades; a very light, refreshing, summertime look 
- Typography: use an elegant font throughout like playfair display when displaying the text
- Style direction:
    - Ensure that in the home page, there is an aesthetic visual to the introduction and welcome. There should be some photo, animation, visual related to american sign language displayed. It should get the user excited to use this app
    - In the camera page, make a pretty border around the camera screen 
    - In the dictionary page, just ensure that there are proper margins and gaps between the pictures/videos as the user scrolls so that it is readable and clear 

## Platform Targets

The target platform for this is iOS devices.


## Error handling and Open Questions

- If the user does not input something into the text box on the camera page, display a warning saying that they need to add something before adding to their dictionary
- Before a user deletes a definition from their personal dictionary, give a pop up for confirmation saying this will be deleted. 

