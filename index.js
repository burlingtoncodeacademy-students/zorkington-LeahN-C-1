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
}

/* ------------------ Item Class Constructor ------------------ */

class Item {
  constructor(name, description, location, takeable) {
    this.name = name;
    this.description = description;
    this.location = location;
    this.takeable = takeable;
  }
}

/* -------------------- Room Descriptions --------------------- */

let bedroom = new Room(
  "bedroom",
  "You are in the bedroom. \nThere is a map on the bedside table. ",
  ["map", "key"],
  false
);

let bathroom = new Room(
  "bathroom",
  "You are in the bathroom. \nOn the mirror is a sticker. ",
  ["sticker"],
  true
);

let livingRoom = new Room(
  "livingRoom",
  "You are in the living room. \nThere is a book on the table. ",
  ["book"],
  false
);

let kitchen = new Room(
  "kitchen",
  "You are in the kitchen. \nThere is a microwave in here. ",
  ["microwave"],
  false
);

let porch = new Room(
  "porch",
  "You are on the porch. \nThere is a chair. ",
  ["chair", "keypad"],
  false
);

let outside = new Room(
  "outside",
  "You escaped! Great job :) \nYou may now move between rooms freely or end the game. ",
  [],
  true
);

/* -------------------- Item Descriptions --------------------- */

let map = new Item(
  "map",
  "You pick up the map and start reading. There is a note at the top. \nIt reads: 'You are locked in this room and must find the key to get out. \nOnce you leave this room, you will need to find the exit and leave the house to win the game. \nAt any point, you may type 'quit' or 'q' to quit the game. \nYou may type 'inventory' or 'i' to view your inventory. \nYou may use words like 'take' and 'examine' to interact with items in the house.' \nYou see on the map that you are in the bedroom and there are 4 more rooms in the house: the bathroom, the living room, the kitchen and the porch. \nAs you look around, you notice a key in the corner. ",
  "bedroom",
  false
);
let key = new Item(
  "key",
  "You pick up the key. It looks like it fits in the locked door. ",
  "bedroom",
  true
);
let sticker = new Item(
  "sticky map",
  "You pick up the sticky map. All that is written on it is the number '3'. ",
  "bathroom",
  false
);
let book = new Item(
  "book",
  "Inside of the book, someone has written the number '6'. ",
  "livingRoom",
  false
);
let microwave = new Item(
  "microwave",
  "You notice that on the door of the microwave, there is a '7' written. ",
  "kitchen",
  false
);
let chair = new Item(
  "chair",
  "When you look more closely, you see that there is a mumber on the left arm of the chair. The number is '4'. \nYou look around and see a keypad on the door to outside. ",
  "porch",
  false
);
let keypad = new Item(
  "keypad",
  "The keypad has a bunch of numbers. ",
  "porch",
  false
);

/* -------------------- Room Lookup Table --------------------- */

let roomLookup = {
  bedroom,
  bathroom,
  "living room": livingRoom,
  kitchen,
  porch,
  outside,
};

/* -------------------- Item Lookup Table --------------------- */

let itemLookup = {
  map,
  key,
  sticker,
  book,
  microwave,
  chair,
  keypad,
};

/* ----------------------- Player Info ------------------------ */

//Player starts with no inventory
let player = {
  inventory: [],
  location: null,
};
//The starting location is bedroom
let currentLocation = "bedroom";

/* ----------------------- State Machine ---------------------- */

//Allowed transitions
let roomStateMachine = {
  bedroom: ["bathroom"],
  bathroom: ["bedroom", "livingRoom"],
  livingRoom: ["bathroom", "kitchen"],
  kitchen: ["livingRoom", "porch"],
  porch: ["kitchen", "outside"],
  outside: ["porch"],
};

/* ---------------------- Sanitize input ---------------------- */

//Function to make sure that all input turns into lowercase strings
function sanitize(userInput) {
  let cleanUp = userInput.toString().trim().toLowerCase();
  return cleanUp;
}

/* ----------------- Function to Change Rooms ----------------- */

function changeRoom(newLocation) {
  newLocation = roomLookup[newLocation];
  //Look at the roomStateMachine for current location
  let allowedTransitions = roomStateMachine[currentLocation];
  //If current location is connected to the new location
  if (allowedTransitions.includes(newLocation) && newLocation.locked === false) {
    //Then current location becomes the new location
    currentLocation = newLocation;
    //And computer prints the new room's description
    console.log(roomLookup[currentLocation].description);
  }
  //If the new location's door is locked
  else if (newLocation.locked === true) {
    console.log("You need to unlock the door first. ");
  }
  //If currentLocation and newLocation are not connected
  else {
    console.log(
      "You cannot move directly from " +
        currentLocation +
        " to " +
        newLocation +
        ". "
    );
  }

  //The player's location is the same as current location
  player.location = roomLookup[currentLocation];
}

/* ------------------ Function to Take Items ------------------ */

function takeItem(suggestedItem) {
  if (
    roomLookup[currentLocation].inventory.includes(suggestedItem) &&
    itemLookup[suggestedItem].takeable === true
  ) {
    console.log("Taken");
    player.inventory.push(suggestedItem);
  } else if (
    roomLookup[currentLocation].inventory.includes(suggestedItem) &&
    itemLookup[suggestedItem].takeable === false
  ) {
    console.log("You cannot take that! ");
  } else {
    console.log("I don't see a " + suggestedItem + ". ");
  }
}

/* ---------------- Function to Start the Game ---------------- */

start();

//Intro function
async function start() {
  const welcomeMessage =
    "\nYou wake up in a bed. Your vision is blurry, so you rub your eyes. \nWhen you're able to see more clearly, you see that there is a map on the bedside table next to you. ";
  //Print welcome message
  console.log(welcomeMessage);
  //Call the function to begin playing the game
  playGame();
}

//Function to begin playing the game
async function playGame() {
  //While shit and stuff is truthy (meaning the user has not typed "quit")
  while (true) {
    //Ask this question after every response
    let answer = await ask("\nWhat would you like to do? \n>_");
    //Use sanitize function (above) to clean user's answer
    answer = sanitize(answer);
    //Split answer by spaces into an array of words
    let splitAnswerIntoArray = answer.split(" ");
    //Find the last word in the user's sentence
    let lastWordInAnswer =
      splitAnswerIntoArray[splitAnswerIntoArray.length - 1];
    //If the user's input includes "read" and "map" and current location is bedroom, read the map's description
    if (
      (answer.includes("read") || answer.includes("examine")) &&
      answer.includes("map") &&
      currentLocation === "bedroom"
    ) {
      console.log(map.description);
    }
    //If the user's input includes "take", run the item through takeItem() function
    else if (answer.includes("take")) {
      takeItem(lastWordInAnswer);
    } else if (answer.includes("inventory") || answer === "i") {
      console.log("Your inventory includes: " + "[ " + player.inventory + " ]");
    } else if (
      player.inventory.includes("key") &&
      (answer.includes("open") || answer.includes("unlock") || answer.includes("bathroom"))
    ) {
      bedroom.locked === false;
      bathroom.locked === false;
      changeRoom("bathroom");
    } else if (
      answer.includes("bedroom") ||
      answer.includes("bathroom") ||
      answer.includes("kitchen") ||
      answer.includes("porch") ||
      answer.includes("outside")
    ) {
      console.log(lastWordInAnswer);
      changeRoom(lastWordInAnswer);
    } else if (answer.includes("bedroom")) {
    } else if (answer.includes("bathroom")) {
    } else if (answer.includes("living room")) {
      changeRoom("livingRoom");
    } else if (answer.includes("3674")) {
      outside.locked === false;
      console.log(outside.description);
    } else if (answer === "quit" || answer === "q") {
      console.log("Goodbye");
      process.exit();
    } else {
      console.log("I do not know how to " + answer + ". ");
    }
  }
}

//Function to play the game

//Print explaination of game details
// Can quit at any time
// Can use action words : take, use,

//While loop for as long as the game is played

//if the user's response includes "map" and "read" and they are in the bedroom, read the map

//else if the user's response includes "take" and "key" and they are in the bedroom, print "taken" and add key to player's inventory

//else if the user's response includes "open" or "unlock" and "door" AND player's location is the bedroom, change location to bathroom and print bathroom description

//else if user's response includes "take" and "map" and player's location is bathroom, print "taken" and add sticky map to inventory

//

//else if the user's response

//

//else if user's response includes "take", print "you cannot take that"

//else if the user types "quit", quit the game

//else "I don't know how to..."
