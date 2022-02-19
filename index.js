/* --------------------- Boiler Plate ----------------------- */

const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

/* ----------------- Room Class Constructor ------------------ */

class Room {
  constructor(name, description, inventory, locked) {
    this.name = name;
    this.description = description;
    this.inventory = inventory;
    this.locked = locked;
  }
  //STRUGGLING HERE
  pickUp(itemName, player) {
    if (this.inventory.includes(itemName)) {
      player.inventory.push(itemName);
      console.log("Taken")
    } else if (!this.inventory.includes(itemName)) {
      console.log("You cannot take that. ")
    }
  }
}

/* ------------------ Item Class Constructor ------------------ */

class Item {
  constructor(name, description, takeable) {
    this.name = name;
    this.description = description;
    this.takeable = takeable;
  }
}

/* -------------------- Room Descriptions --------------------- */

let bedroom = new Room("bedroom", "You are in the bedroom", ["note", "key"], true);

let bathroom = new Room("bathroom", "You're in the bathroom", ["//inventory"], true);

let livingRoom = new Room("livingRoom", "You're in the living room", ["//inventory"], true);

let kitchen = new Room("kitchen", "You're in the kitchen", ["//inventory"], true);

let porch = new Room("porch", "You're on the porch", ["//inventory"], false);

let outside = new Room("outside", "You are outside", ["//inventory"], false)

/* -------------------- Item Descriptions --------------------- */

let note = new Item("note", "You pick up the note and start reading. \nThe note reads: 'You are locked in this room and must find the key to get out. \nOnce you leave this room, you will need to find the exit and leave the house to win the game. \nAt any point, you may type 'quit' or 'q' to quit the game.' \nAs you look around, you notice a key in the corner. ", false);
let key = new Item("key", "You pick up the key. ")

/* -------------------- Room Lookup Table --------------------- */

let roomLookup = {
  bedroom: bedroom,
  bathroom: bathroom,
  "living room": livingRoom,
  kitchen: kitchen,
  porch: porch,
  outside: outside
}

/* -------------------- Item Lookup Table --------------------- */

let itemLookup = {
  note: note,
  key: key,
};

/* ----------------------- Player Info ------------------------ */

//Player starts with no inventory
let player = {
  inventory: [],
  location: null,
};

player.location = bedroom;
let currentLocation = player.location;

/* ----------------------- State Machine ---------------------- */

let roomStateMachine = {
  bedroom: ["bathroom"],
  bathroom: ["bedroom", "livingRoom"],
  livingRoom: ["bathroom", "kitchen"],
  kitchen: ["livingRoom", "porch"],
  porch: ["kitchen", "outside"],
  outside: ["porch"]
};


/* ---------------------- Sanitize input ---------------------- */

//Function to make sure that all input turns into lowercase strings
function sanitize(userInput) {
  let cleanUp = userInput.toString().trim().toLowerCase();
  return cleanUp;
}

/* ---------------- Function to Start the Game ---------------- */

start();

//Intro function
async function start() {
  const welcomeMessage =
    "\nYou wake up in a bed. Your vision is blurry, so you rub your eyes. \nWhen you're able to see more clearly, you see that there is a note on the bedside table next to you. ";
    //Print welcome message
    console.log(welcomeMessage);
    //Call the function to begin playing the game
    playGame();
}


//Function to begin playing the game
async function playGame() {
  //While shit and stuff is truthy
  while (true) {
    //Question asked to user throughout the game
  let answer = await ask("\nWhat would you like to do? \n>_");
  //Use sanitize function (above) to clean user's answer
  answer = sanitize(answer);
  let itemInAnswer = answer.length - 1;
  if (answer.includes("read") && answer.includes("note") && currentLocation === bedroom) {
    console.log(note.description);
  } else if (answer.includes("take")) {
    //THIS DOESN'T WORK
    roomLookup[currentLocation].pickUp(itemInAnswer)
  } 
  //THIS WORKS
  else if (answer === "quit" || answer === "q") {
    console.log("Goodbye")
    process.exit();
  } else {
    console.log("I do not know how to " + answer + ". ")
  }
}
}