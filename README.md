# Balls eat balls

## Author: Zhi Wang

## Term: Spring 2024
Part 1 is in the document [balls_eat_balls.pdf](https://github.com/Piers-W/Balls_eat_balls/blob/main/Balls_eat_balls.pdf)

### How to use

1.  Install [node.js](https://nodejs.org/en)
2.  Download project
3.  install vite:
    
    ```plaintext
    npm install vite --save-dev
    ```
  
4.  run the code:
    
    ```plaintext
    npm run dev
    ```
5. Navigate to the webpage http://localhost:5173/

## Demo video
[link](https://youtu.be/l1iBOLPZsI4)

## Introduction

"Balls Eat Balls" is a web-based mini-game developed using React. Its basic rules involve players controlling a small ball to eat food and grow larger, ultimately aiming to devour larger opponent balls to achieve victory.

## Gameplay

In PvE mode, you control the blue ball using WASD, avoiding monsters (red balls), eating green balls (food) to increase your size. Avoid the poison(black balls), they shrink you by 10%. Ultimately, grow bigger than the monsters to eat them or achieve victory; being eaten by a monster results in failure. After the game ends, you can choose to play again or return to the game mode selection screen.
In PvP mode, the basic rules are the same as in PvE mode. Player 1 controls the red ball with WASD, and Player 2 controls the blue ball with arrow keys. Eating the opponent player leads to victory

## Main Features

### component
#### Food
This code is responsible for rendering a representation of food as a small green circle on the screen. The component receives a prop called position, which contains the coordinates of the food item. Based on these coordinates (position.x and position.y), the component renders a green circle at that position using absolute positioning (position: 'absolute'). The circle is styled with a width and height of 10 pixels, a green background color, and a border radius of 50% to make it appear as a circle. Additionally, it is centered at the specified position using the transform: 'translate(-50%, -50%)' CSS property.

#### Poison
This code renders a small black circle representing poison on the screen. It takes two props: position (containing coordinates) and size (determining the circle's size, defaulting to 10 pixels if not provided).

Using absolute positioning, it places the poison circle at the specified coordinates. The circle's size is determined by the size prop, with a default of 10 pixels. Styled with a black background color and a border radius of 50% for a circular appearance, it's centered at the specified position using CSS transformation.

#### ScoreBoard
The ScoreBoard component displays a scoreboard at the top center of the screen in a fixed position. It showcases the scores and names of two players, styled with a light gray background, padding, a set width, margin, border radius, and box shadow for an attractive look. The scores and player labels are presented inside the component, with an emphasis on clarity, separated by dashes for easy reading.

#### Monster
Chasing Logic: Upon mounting, the Monster starts chasing the player by calculating the direction towards the player's position and moving towards it.
Updating Position: The Monster updates its position in the state and notifies the parent component whenever its position changes.
Dynamic Styling: The size and position of the monster are dynamically updated based on the props passed to it (position and size). The size of the monster is directly proportional to its radius, and its font size adjusts dynamically based on its size.
Unmounting: Clears the interval for chasing the player when the component is unmounted to prevent memory leaks.

#### Player
Keyboard Input Handling: Listens for keyboard input events (keydown and keyup) to track the movement of the player.
Continuous Position Update: Continuously updates the player's position based on the current movement state (left, right, up, down) and speed.
Event Listeners: Sets up event listeners for keyboard input when the component mounts and removes them when the component unmounts to prevent memory leaks.
Rendering: Renders a circular representation of the player on the screen using a <div> element with absolute positioning. The size, color, and initial position of the player are determined by the props passed to it.

#### PveGame
Game Initialization: Initializes the game state, including positions, sizes, scores, and game over flags.
Game Loop: Sets up a game loop using setInterval() to continuously update the game state.
Collision Detection: Detects collisions between the player and food/poison items, updating player size and score accordingly.
Game Over Handling: Stops the game loop and prompts the user to restart the game when a game over condition is met.
Viewport Management: Updates the viewport offset to keep the player centered within the game canvas.
Rendering: Renders the game canvas, including the player, monster, food, poison, and scoreboard components.

#### PvpGame
Game Initialization: Initializes the game state, including positions, sizes, scores, and canvas dimensions.
Game Loop: Sets up a game loop using setInterval() to continuously update the game state.
Collision Detection: Detects collisions between players and food/poison items, updating player size and score accordingly.
Game Over Handling: Stops the game loop and prompts the users to restart the game when a game over condition is met.
Rendering: Renders the game canvas, including players, food, poison, and scoreboard components.

### Main Page
#### App.jsx
Game Mode Selection: Renders a screen allowing the user to choose between Player vs. Environment (PvE) mode or Player vs. Player (PvP) mode.
Game Mode Rendering: Renders the appropriate game component (PvEGame or PvPGame) based on the user's selection.
Game Rules Display: Displays the rules of each game mode to inform the user about how to play.
Event Handling: Listens for button clicks to trigger the selection of a game mode.
State Management: Manages the state to keep track of the selected game mode (PvE or PvP).


### Player and Monster Attributes

- Position
- Weight
- Speed"

## Project Structure

```
├── public
│   ├── vite.svg
├── src
│   ├── assrts
│   │    ├── react.svg
│   ├── components
│   │    ├── Food.jsx       Generate Food
│   │    ├── Poison.jsx     Generate Poison 
│   │    ├── ScoreBoard.jsx Generate Scoreboard
│   │    ├── Monster.jsx    Generate Monster,Movement and Update state Methods
│   │    ├── player.jsx     Generate player,Movement and Update state Methods
│   │    ├── PveGame.jsx    PvE Mode Game Management
│   │    └── PvpGame.jsx    PvP Mode Game Management
│   ├── App.css
│   ├── App.jsx             Select Game Mode，Game Rules Explanation
│   └── index.css
    └── mian.jsx
```

## Technologies
React, Vite, Html, CSS

## License

This project is licensed under the [MIT License](https://github.com/Piers-W/Balls_eat_balls/blob/main/LICENSE).


