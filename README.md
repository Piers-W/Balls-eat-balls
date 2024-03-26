# Balls eat balls

## Author: Zhi Wang

## Term: Spring 2024
### How to use
You can direcly view the page by [Firebase deploy](https://balls-eat-balls-6c000.web.app)

### clone thisrepository
Make sure you have installed [Node.js](https://nodejs.org/en).

Then install packages:

```plaintext
npm install
```

To run the application locally:

```plaintext
npm run dev
```

## Demo video
[link](https://youtu.be/4HBJIFm5MkQ)

## Introduction

"Balls Eat Balls" is a web-based mini-game developed using React. Use Firebase to store player game scores. Its basic rules involve players controlling a small ball to eat food and grow larger, ultimately aiming to devour larger opponent balls to achieve victory.

## Gameplay

In PvE mode, you control the blue ball using WASD, avoiding monsters (red balls), eating green balls (food) to increase your size. Avoid the poison(black balls), they shrink you by 10%. Ultimately, grow bigger than the monsters to eat them or achieve victory; being eaten by a monster results in failure. After the game ends, you can choose to play again or return to the game mode selection screen.
In PvP mode, the basic rules are the same as in PvE mode. Player 1 controls the red ball with WASD, and Player 2 controls the blue ball with arrow keys. Eating the opponent player leads to victory

## Main Features

### component
Translate all class components into functional components. Keep only basic functionality for all components except for PvP and PvE. Migrate other functionalities to the main control component.

#### PveGame
Add difficulty selection functionality, record scores for different difficulty levels to Firebase, and include a feature to clear all difficulty scores.

#### PvpGame
 Players can input their name and room number to record their scores to the database, with scores recorded according to different room numbers. If no input is provided, it defaults to local mode, without uploading the score. At the end of the game, players can choose "OK" to upload their score or click "Cancel" to discard the score for that round.

### Main Page
#### App.jsx
Add leaderboard functionality to record the scores of the latest 5 games.

## Technologies
React, Vite, Html, CSS, firebase

## License

This project is licensed under the [MIT License](https://github.com/Piers-W/Balls-eat-balls_function/blob/main/LICENSE).


