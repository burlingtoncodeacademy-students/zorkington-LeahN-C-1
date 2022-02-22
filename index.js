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
  "\nYou are in the bedroom. \nThere is a map on the bedside table. ",
  ["map", "key"],
  false
);

let bathroom = new Room(
  "bathroom",
  "\nYou walk into the bathroom. \nOn the mirror is a sticker. ",
  ["sticker"],
  true
);

let sunroom = new Room(
  "sunroom",
  "\nYou are now in the sunroom. \nThere is a book on the table. ",
  ["book"],
  false
);

let kitchen = new Room(
  "kitchen",
  "\nYou are in the kitchen. \nThere is a microwave in here. ",
  ["microwave"],
  false
);

let porch = new Room(
  "porch",
  "\nYou go onto the porch. \nThere is a chair. ",
  ["chair", "keypad"],
  false
);

let outside = new Room(
  "outside",
  "\nYou escaped!!! Great job 🥳 💃🏻 \n\nYou may now move between rooms freely or end the game. \nIf you go back inside, you will need to use the keypad to get out again, so remember the code! ",
  [],
  true
);

/* -------------------- Item Descriptions --------------------- */

let map = new Item(
  "map",
  "\nYou pick up the map and start reading. There is a note at the top. \nIt reads: 'You are locked in this room and must find the key to get out. \nOnce you leave this room, you will need to find the exit and leave the house to win the game. \nAt any point, you may type 'quit' or 'q' to quit the game. \nYou may type 'inventory' or 'i' to view your inventory. \nYou may use words like 'take' and 'examine' to interact with items in the house. \nLook closely at the map, this part is important (you may want to take notes...)' \nYou see on the map that you are in the bedroom and there are 4 more rooms in the house: the bathroom, the living room, the kitchen and the porch. \nThey are connected in that order. The porch leads to outside. \n\nAs you look around, you notice a key in the corner. ",
  "bedroom",
  false
);
let key = new Item(
  "key",
  "\nYou pick up the key. It looks like it fits in the locked door. ",
  "bedroom",
  true
);
let sticker = new Item(
  "sticky map",
  "\nYou pick up the sticker. All that is written on it is the number '3'. ",
  "bathroom",
  false
);
let book = new Item(
  "book",
  "\nInside of the book, someone has written the number '6'. ",
  "sunroom",
  false
);
let microwave = new Item(
  "microwave",
  "\nYou notice that on the door of the microwave, there is a '7' written. ",
  "kitchen",
  false
);
let chair = new Item(
  "chair",
  "\nWhen you look more closely, you see that there is a mumber on the left arm of the chair. The number is '4'. \nYou look around and see a keypad on the door to outside. ",
  "porch",
  false
);
let keypad = new Item(
  "keypad",
  "\nWhich numbers would you like to enter? ",
  "porch",
  false
);

/* -------------------- Room Lookup Table --------------------- */

let roomLookup = {
  bedroom,
  bathroom,
  sunroom,
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
  bathroom: ["bedroom", "sunroom"],
  sunroom: ["bathroom", "kitchen"],
  kitchen: ["sunroom", "porch"],
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
  //Look at the roomStateMachine for current location
  let allowedTransitions = roomStateMachine[currentLocation];
  //If requested room is connected to current room
  if (allowedTransitions.includes(newLocation)) {
    //The requested room becomes the current room (change to that room)
    currentLocation = newLocation;
    //Print the description of the new room
    console.log(roomLookup[currentLocation].description);
  }
  //If currentLocation and newLocation are not connected
  else {
    //Print this
    console.log(
      "\nYou cannot move directly from " +
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
  //If the player already has the item in inventory
  if (player.inventory.includes(suggestedItem)) {
    //Then the item is no longer takeable
    itemLookup[suggestedItem].takeable === false;
    //Tell user that they have already picked up that item
    console.log(
      "You already picked up " +
        suggestedItem +
        " and it is in your inventory."
    );
  }
  //If the current location has the requested item and the item is takeable
  else if (
    roomLookup[currentLocation].inventory.includes(suggestedItem) &&
    itemLookup[suggestedItem].takeable === true
  ) {
    //Print this and add to player's inventory
    console.log("\nTaken");
    player.inventory.push(suggestedItem);
  }
  //If the room has the item but the item is not takeable
  else if (
    roomLookup[currentLocation].inventory.includes(suggestedItem) &&
    !itemLookup[suggestedItem].takeable
  ) {
    //Print this
    console.log("\nYou cannot take that! ");
  }

  //Otherwise, if the item is not in the room
  else {
    //Inform user can't see the item
    console.log("\nI don't see a " + suggestedItem + ". ");
  }
}

/* ------------------ Function to Drop Items ------------------ */

function dropItem(inventoryItem) {
  //If player has an item in inventory and the item is from the current room
  if (
    player.inventory.includes(inventoryItem) &&
    roomLookup[currentLocation].inventory.includes(inventoryItem)
  ) {
    //Drop the item into the current room
    let droppedItem = player.inventory.splice(
      player.inventory.indexOf(inventoryItem)
    );
    droppedItem.push(inventoryItem);
    //And inform user that it has dropped
    console.log(
      "\nYou dropped the " + inventoryItem + " from your inventory. "
    );
  } //If the item doesn't belong in the current room, tell player to drop in the right room
  else {
    console.log("\nPlease put that back where you found it. ");
  }
}

/* -------------------------- Keypad Puzzle ----------------------- */

function keypadPuzzle(numbers) {
  //If user enters the correct code
  if (numbers === "3674") {
    //The door becomes unlocked
    outside.locked === false;
    //And player is outside
    changeRoom("outside");
  }
  //Otherwise, the door remains locked and user needs to try code again
  else {
    outside.locked === true;
    console.log("\nThe password is incorrect. Please type 'a' to try again. ");
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
    console.log(
      "\n- current location: " +
        currentLocation +
        " -\n- " +
        " connects to: " +
        roomStateMachine[currentLocation] +
        " -"
    );

    //Ask this question after every response
    answer = await ask("\nWhat would you like to do? \n>_");
    //Use sanitize function (above) to clean user's answer
    answer = sanitize(answer);
    //Split answer by spaces into an array of words
    let splitAnswerIntoArray = answer.split(" ");
    //Find the last word in the user's sentence
    let lastWordInAnswer =
      splitAnswerIntoArray[splitAnswerIntoArray.length - 1];
    //If the user's input includes "read" or "examine" and "map" and current location is bedroom, read the map's description
    if (
      (answer.includes("read") ||
        answer.includes("look at") ||
        answer.includes("examine")) &&
      answer.includes("map") &&
      currentLocation === "bedroom"
    ) {
      //Print map's description
      console.log(map.description);
    }
    //If the input includes "open" or "unlock" or "bathroom" and player does not have a key in inventory
    else if (
      (answer.includes("open") ||
        answer.includes("unlock") ||
        answer.includes("bathroom")) &&
      player.inventory.includes("key") === false
    ) {
      //Tell user to unlock the door first
      console.log("\nYou need a key to unlock the door. ");
    }
    //If input includes "open" or "unlock" and current location is bedroom, run "bathroom" through changeRoom() function
    else if (
      (answer.includes("open") || answer.includes("unlock")) &&
      currentLocation === "bedroom"
    ) {
      console.log(currentLocation);
      changeRoom("bathroom");
    }
    //If the user's input includes "take" or "pick up", run the item through takeItem() function
    else if (answer.includes("take") || answer.includes("pick up")) {
      takeItem(lastWordInAnswer);
    }
    //If the input includes "inventory" or "i", inform user of whats's in inventory
    else if (answer.includes("inventory") || answer === "i") {
      console.log("Your inventory includes: " + "[ " + player.inventory + " ]");
    }
    //If the input includes "drop" or "put down", run item through dropItem() function
    else if (answer.includes("drop") || answer.includes("put down")) {
      dropItem(lastWordInAnswer);
    } else if (
      outside.locked === false &&
      answer.includes("outside") &&
      currentLocation === "porch"
    ) {
      changeRoom("outside");
    }
    //If input includes "outside" and "porch", the outside stays locked and user is prompted to use keypad
    else if (answer.includes("outside") && currentLocation === "porch") {
      outside.locked === true;
      console.log("\nUse the keypad to unlock the door. ");
    }
    //If input includes any of these words
    else if (
      answer.includes("bedroom") ||
      answer.includes("bathroom") ||
      answer.includes("sunroom") ||
      answer.includes("kitchen") ||
      answer.includes("porch") ||
      answer.includes("outside")
    ) {
      //Run the word through changeRoom() function
      changeRoom(lastWordInAnswer);
    }
    //If input includes "examine" or "look at" and any of the item words below, print the item's description
    else if (
      (answer.includes("examine") || answer.includes("look at")) &&
      answer.includes("sticker")
    ) {
      console.log(sticker.description);
    } else if (
      (answer.includes("examine") || answer.includes("look at")) &&
      answer.includes("book")
    ) {
      console.log(book.description);
    } else if (
      (answer.includes("examine") || answer.includes("look at")) &&
      answer.includes("microwave")
    ) {
      console.log(microwave.description);
    } else if (
      (answer.includes("examine") || answer.includes("look at")) &&
      answer.includes("chair")
    ) {
      console.log(chair.description);
    }
    //If input includes "examine" or "look at" and "keypad", or if input is "a" and current location is "porch", await ask keypad's description and run answer through keypadPuzzle() function
    else if (
      (((answer.includes("examine") ||
        answer.includes("look at") ||
        answer.includes("use")) &&
        answer.includes("keypad")) ||
        answer === "a") &&
      currentLocation === "porch"
    ) {
      answer = await ask(keypad.description);
      keypadPuzzle(answer);
    }
    //If user types "quit" or "q", end the game
    else if (answer === "quit" || answer === "q") {
      console.log("Goodbye");
      process.exit();
    }
    //Otherwise, print this
    else {
      console.log("I do not know how to " + answer + ". ");
    }
  }
}
