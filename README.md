# Bowling Game Score Calculator

This is a server application for calculating bowling game scores. It is built using MongoDB and Node.js. The application allows players to enter their names and calculates their scores based on the rules of the game.

## Rules of the Game

1. The game consists of 10 frames.
2. Each frame, a player has two opportunities to knock down 10 pins.
3. A spare occurs when the player knocks down all 10 pins in two rolls. The bonus for that frame is the number of pins knocked down by the next roll.
4. A strike occurs when the player knocks down all 10 pins on the first try. The bonus for that frame is the value of the next two balls rolled.
5. In the tenth frame, a player who rolls a spare or strike is allowed to roll an extra ball to complete the frame, but no more than three balls can be rolled.
6. The score of a frame is the total number of pins knocked down, plus bonuses for strikes and spares.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/g4lb/bowling-server.git
```

2. Navigate to the project directory:

```bash
cd bowling-server
```

3. Install the dependencies using npm:

```bash
npm install
```

4. Set up MongoDB:
   - Make sure you have MongoDB installed and running on your system.

5. Start the server:

```bash
npm start
```

## API Endpoints

use the attached postman file
