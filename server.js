const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");
const path = require('path');
const Rollbar = require('rollbar');

const app = express();

const publicDirectoryPath = path.join(__dirname, 'public');
app.use(express.static(publicDirectoryPath));

const playerRecord = {
  wins: 0,
  losses: 0,
};

app.use(express.json());

// Initialize Rollbar with your Rollbar project's access token
const rollbar = new Rollbar({
  accessToken: 'YOUR_ROLLBAR_ACCESS_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true
});

// Add Rollbar middleware to catch errors and log them to Rollbar
app.use(rollbar.errorHandler());

// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    // Log Rollbar events
    rollbar.info('Endpoint accessed: /api/robots');

    res.status(200).send(botsArr);
  } catch (error) {
    // Log error to Rollbar
    rollbar.error(error);

    console.error("ERROR GETTING BOTS", error);
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    // Log Rollbar events
    rollbar.info('Endpoint accessed: /api/robots/shuffled');

    let shuffled = shuffle(bots);
    res.status(200).send(shuffled);
  } catch (error) {
    // Log error to Rollbar
    rollbar.error(error);

    console.error("ERROR GETTING SHUFFLED BOTS", error);
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      res.status(200).send("You lost!");
    } else {
      playerRecord.losses += 1;
      res.status(200).send("You won!");
    }
  } catch (error) {
    // Log error to Rollbar
    rollbar.error(error);

    console.log("ERROR DUELING", error);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    // Log Rollbar events
    rollbar.info('Endpoint accessed: /api/player');

    res.status(200).send(playerRecord);
  } catch (error) {
    // Log error to Rollbar
    rollbar.error(error);

    console.log("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
  }
});

app.listen(8000, () => {
  console.log(`Listening on 8000`);
});
