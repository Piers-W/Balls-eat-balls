# Balls eat balls

## Author: Zhi Wang

## Term: Spring 2024

### clone thisrepository
The testing code is on the testing branch.
Then install packages:

```plaintext
npm install
```

To run the application locally:

```plaintext
npm run dev
```

```plaintext
npx cypress open
```
select e2e testing then select electron. click balls.cy.js

## Demo video
[link](https://youtu.be/HNMiohADZ_A)

### Game Mode Selection
PvE Mode Selection
Objective: To verify that selecting the PvE mode navigates to the difficulty selection screen.
Procedure: The test clicks on the "Play PvE" button and checks if the "Select Difficulty" header exists on the screen that follows.

PvP Mode Selection
Objective: To verify that selecting the PvP mode displays the interface for entering player names and room numbers.
Procedure: The test clicks on the "Play PvP" button and checks for the presence of the "Enter Player Names and Room Number" header.

### PvE Difficulty Selection
Easy Mode
Objective: To check if selecting "Easy" sets the monster's size within a specific range.
Procedure: The test selects "Easy" and verifies the monster's size is between 90 and 105.
Medium Mode
Objective: To verify that "Medium" difficulty adjusts the monster's size appropriately.
Procedure: After selecting "Medium," the test ensures the monster's size is between 135 and 155.
Hard Mode
Objective: To ensure "Hard" mode sets the correct size for the monster.
Procedure: On choosing "Hard," the test checks if the monster's size falls between 180 and 205.

### Player Movement
Objective: To test that the player can be moved upwards using the "W" key.
Procedure: After starting a game in PvE "Easy" mode, the test simulates pressing the "W" key and verifies the player moves up by comparing the initial and subsequent top positions.

### Scoreboard Update on Player-Monster Collision
Objective: To confirm that the scoreboard correctly updates after a player-monster collision.
Procedure: This test waits for a collision to occur in PvE "Easy" mode and checks if the monster's score increases post-collision.

### PvP Room and Player Name Entry
Objective: To validate that entering player names and a room number updates the scoreboard correctly in PvP mode.
Procedure: The test enters "Alice" and "Bob" as player names and "123" as the room number, starts the game, and verifies that the scoreboard displays the entered names.

### Game Over and Return to Main Page
Objective: To ensure the game returns to the main page when a player chooses not to play again after game over in PvE mode.
Procedure: After triggering a game over in PvE "Easy" mode, the test simulates choosing "Cancel" on the confirmation prompt and checks for the presence of the "Welcome to Balls Eat Balls" title on the main page.



