PROMPT LOG

AI Tools Used: I used VSCODE's integrated AI agent, GitHub Copilot for both the agent and reviewer in this assignment. 

Relevant Prompts:

- Read SPEC.md in this project. Implement the full mobile app exactly as specified. Create all necessary files, components, navigation, core features, and expected behavior. Use any modules or libraries needed. Make sure that appropriate data is persistent. Avoid security risks for sensitive data.  Include proper error handling. Make sure the app starts without errors and displays the home screen correctly.

- Review the React Native/Expo code in this project in all the files, against the spec in SPEC.md. 
For each expected feature and behavior in the SPEC, verify whether the code actually implements it correctly. 
Also check for:
- Bugs (such as logging in errors) or logic errors 
- Missing error handling
- Code quality issues (unclear naming, repeated code, etc.)
- Best practices for React Native or other technologies

Format your review as a numbered list of findings, each marked as [PASS], [FAIL], or [WARN]. 
Be specific. Reference file names and line numbers. 
Export the review as REVIEW.md at the root of the project.

- What does the useAuth do?

- On the app right now, I'm trying to sign up by creating an account with a valid email address (both @ and . characters included) and proper 6 - character long password. However I keep getting an error "sign up failed. invalid key provided to secure store. keys must not be empty and contain only alphanumeric characters.." However, I did adhere to these restrictions. please fix this issue 

- The error still persists. I'm also getting a pop up console error that says uncaught error invalid key like what I stated before. It gives me a code snippet from storage.ts : "export async function getCurrentUserEmail(): Promise<string.....
Does the error have something to do with this part of the code

- Can you walk me through the signup.tsx file because it is still not letting me sign up for a new account?

- Where do you use the expo camera module and how did you implement it?

- Great, that works now. Now, for the camera, can you add an option to reverse/switch the camera for both the front and back camera angles? Also, among all the pages, I noticed the layout is squished upward and the text is not in the frame of my phone. can you change this (probably with padding) so that the text and structure is readable and clear 

- Why was the blur on submit deleted in add.tsx?









