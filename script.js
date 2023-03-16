"use strict";

//Buttons
const powerBtn = document.querySelector(".calc__power");
const soundBtn = document.querySelector(".calc__sound");
const clearBtn = document.querySelector(".clear");
const delBtn = document.querySelector(".del");
const resultBtn = document.querySelector(".result");
const btnElement = document.querySelectorAll(".btn");
const soundIcon = document.querySelector(".sound-icon");

//Screens
const calcScreen = document.querySelector(".calc__screen");
const outputScreen = document.querySelector(".calc__output");
const inputScreen = document.querySelector(".calc__input");

//Sounds
const powerSound = new Audio("sounds/beep.wav");
const clickSound = new Audio("sounds/click.wav");
const errorSound = new Audio("sounds/error.wav");

//Functions
//to simulate a button click animation
const clickedButtonAnimation = (btnElement) => {
  btnElement.classList.add("btn--clicked");
  clickSound.play();

  setTimeout(() => {
    btnElement.classList.remove("btn--clicked");
  }, 200);
};

//to display the button value to the screen
const inputScreenDisplay = (clickedValue) => {
  inputScreen.value += clickedValue;
};

const calculationAlgorithm = () => {
  try {
    //to calculate input and print on output screen
    outputScreen.value = eval(inputScreen.value);
    //to check for divide-by-0 errors and input errors while calculating input
    if (
      isNaN(outputScreen.value) ||
      outputScreen.value === Infinity ||
      outputScreen.value === -Infinity
    ) {
      throw new Error("Cannot divide by zero");
    }
  } catch (error) {
    //to print an error message to the output screen with an error sound
    clickSound.pause();
    errorSound.play();
    outputScreen.value = "Wahala!";
    calcScreen.classList.add("error-screen");
    outputScreen.classList.add("error-screen");
    setTimeout(() => {
      calcScreen.classList.remove("error-screen");
      outputScreen.classList.remove("error-screen");
    }, 200);
  }
};

// to clear the entire screen
const clearScreen = () => {
  outputScreen.value = "";
  inputScreen.value = "";
};

//to delete a single character from the screen
const deleteChar = () => {
  let inputScreenArray = [];
  inputScreenArray = inputScreen.value.split("");
  inputScreenArray.pop();
  inputScreen.value = inputScreenArray.join("");
};

//to toggle sound
const soundLogic = () => {
  if (soundIcon.src.includes("volume-1")) {
    powerSound.muted = true;
    errorSound.muted = true;
    clickSound.muted = true;
    soundIcon.src = "icons/volume-2.svg";
  } else {
    powerSound.muted = false;
    errorSound.muted = false;
    clickSound.muted = false;
    clickSound.play();
    soundIcon.src = "icons/volume-1.svg";
  }
};

//to initiate an off state
const offState = () => {
  clearScreen();
  inputScreen.setAttribute("placeholder", "");

  for (const item of btnElement) {
    item.classList.add("power-off");
  }

  powerBtn.classList.remove("power-off");
  soundBtn.classList.remove("power-off");
};

offState();

// Power button click event
powerBtn.addEventListener("click", function () {
  if (powerBtn && !this.classList.contains("power-on")) {
    //to simulate a power on sequence
    for (const item of btnElement) {
      setTimeout(() => {
        item.classList.remove("power-off");
      }, 500);

      setTimeout(() => {
        inputScreen.setAttribute("placeholder", "0");
        powerSound.play();
      }, 1000);
    }
    this.classList.add("power-on");
  } else {
    //to initiate a power off sequence
    setTimeout(() => {
      offState();
    }, 500);

    this.classList.remove("power-on");
  }
});

//to loop over all the Button elements and add button animation to clicked buttons
for (const item of btnElement) {
  item.addEventListener("click", function () {
    clickSound.play();
    clickedButtonAnimation(this);

    //to ensure that only numbers and operators are printed to the input screen
    if (this.value && !this.classList.contains("power-off")) {
      inputScreenDisplay(this.value);
    }

    //to print calculated result to the output
    //only when the calculator is on and the result button is clicked
    if (
      this.classList.contains("result") &&
      !this.classList.contains("power-off")
    ) {
      calculationAlgorithm();
    }

    //clears both screens when "C" button is clicked
    if (this.classList.contains("clear")) {
      clearScreen();
    }

    //removes one character from the screen when "DEL" button is clicked
    if (this.classList.contains("del")) {
      deleteChar();
    }

    //toggles sound when sound button is clicked
    if (this.classList.contains("calc__sound")) {
      soundLogic();
    }
  });
}

//Keyboard press events
document.addEventListener("keypress", function (event) {
  const keyPressed = event.key;

  // to display the button value on key press
  for (const item of btnElement) {
    if (keyPressed === item.value) {
      if (item.value && !item.classList.contains("power-off")) {
        inputScreenDisplay(item.value);
      }
      clickedButtonAnimation(item);
    }
  }

  //to calculate input and print result on key press
  if (keyPressed === "Enter" || keyPressed === "=") {
    calculationAlgorithm();
    clickedButtonAnimation(resultBtn);
  }

  //to delete a character from the screen on key press
  if (keyPressed === "d" || keyPressed === "D") {
    deleteChar();
    clickedButtonAnimation(delBtn);
  }

  // to clear the screen on keypress
  if (keyPressed === "c" || keyPressed === "C") {
    clearScreen();

    clickedButtonAnimation(clearBtn);
  }

  // to toggle sound on key press
  if (keyPressed === "m" || keyPressed === "M") {
    soundLogic();

    clickedButtonAnimation(soundBtn);
  }
});
