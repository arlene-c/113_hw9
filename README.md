## Overview

This app is a personal ASL dictionary app. This app allows users to save their own signs into a dictionary, providing them a space to practice past signs and keep a documented diary of vocabulary they learned. I chose this idea because I took sign language classes in high school, and grew to really enjoy the language as well as the history and Deaf culture involved. I wanted to use this mobile app as a stepping stone for the capstone project, where I’ll likely work on more recognition and advanced work with sign language translation. I think this initial mobile app can be a good tool for studying for a class but also just useful for peoople who want to learn a new visual language in general--something like a Duolingo but for ASL. 

The app has three main screens. The first screen is the home page that users are first directed to if they don’t have an account. It displays the name of the app and also gives a description for how to use it. Users can then sign up or log into their existing account. 
The second screen is the “add sign” screen. They can add a new sign to their dictionary by taking a picture of them signing, then inputting a text definition that matches the sign. The user can save this entry. 
Everything saved will appear on the third screen, the personal dictionary tab. They can go into their personal dictionary and review the entries they made—both the actual picture and english definition, scrolling through each entry for easier access. 

One thing I learned about mobile development that surprised me was the skill and efficiency of the AI. After using AI for all the past assigmnents, I think I expected a similar level of efficiency and speed as it reads the SPEC and implements the features I outlined. I was surprised how much slower the AI agent was this time (maybe 10-15 min), as well as the number of terminal commands I needed to approve before it continued running. It noted that it ran into many errors and unexpected bugs, which was unlike how I used agentic development before. At the same time,  I know mobile development is a much bigger project than anything we’ve done in the past so it’s not too surprising that the AI’s efficiency was lower, though I was used to a certain level of speed before. 

## How to set up and run the app
1. Install dependencies
From the project root:
cd /Users/arlene-mac/my-app
npm install

3. Start the app
npm start

or directly:
npx expo start

You can also launch a platform-specific runner:
npm run android
npm run ios
npm run web

## Required tools
Node.js (a current LTS version works well)
npm
Expo tooling via npx expo (no global install required)

## What this app uses
Expo + Expo Router
react-native
expo-camera, expo-av, expo-crypto, expo-secure-store, and other Expo libraries

Local storage:
AsyncStorage for app data
SecureStore for storing hashed credentials
