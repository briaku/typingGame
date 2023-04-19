const words="the of and a to in is you that it he was for on are as with his they I at be this have from or one had by word but not what all were we when your can said there use an each which she do how their if will up other about out many then these so some her would make like him into time has look two more write go see number no way could people my than first water been call who oil its now find long down day did get come made may part".split(' ');

const wordsCount= words.length; 
const currentRecordWpm= document.getElementById("savedResult");
let myValueStored = localStorage.getItem("savedRes");
if (myValueStored == null) {
    currentRecordWpm.innerHTML= "Record: Wpm 0";
}
if (myValueStored!= null) {

    currentRecordWpm.innerHTML= `Record: Wpm ${myValueStored} `;
}

const gameTime = 30 * 1000; // 30 seconds game time
window.timer=null;
 window.gameStart= null;
function addClass(el,name) {
    el.className += ' '+name;
  }
  function removeClass(el,name) {
    el.className = el.className.replace(name,'');
  }
function randomWord() {
    const randomIndex = Math.ceil (Math.random() * wordsCount); //0 to length of wordcount by rounding it down with math ceil
    return words[randomIndex-1];
}
function formatWord(word) {
    return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
    document.getElementById("words").innerHTML= ""; // when the function is called we are going to replace the words div with empty content 
    for (let i =0 ; i<200; i++){
        document.getElementById("words").innerHTML += formatWord(randomWord()); // appending to the innerhtml document

    }
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    document.getElementById("info").innerHTML = (gameTime/1000) + " ";
    window.timer=null; // when we start our new game we set the timer to be null
}



function getWpm() {
    const words=[...document.querySelectorAll(".word")];
    const LastTypedWord = document.querySelector(".word.current")
    const LastTypedWordIndex= words.indexOf(LastTypedWord); // gets the index of the last typed word (represents all the words that have been typed to the index)
    const typedWords = words.slice(0, LastTypedWordIndex); // this represents all wards attempted to the last typedWord index
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children]; // make this a array of the letters
        const redLetter = letters.filter( letter=> letter.className.includes("incorrect") );
        const correctLetter = letters.filter(letter=> letter.className.includes("correct"));
        return redLetter.length ===0 && correctLetter.length === letters.length; // return what words have 0 incorrect letterse and  words taht have the correct letters correct beging the length of the number of letters in the word.
    });
    return correctWords.length / gameTime * 60000;
}


function gameOver() {
    clearInterval(window.timer); // stop the timer 
    addClass (document.getElementById("game") , "over");
    const result= getWpm();
    console.log(result);
    document.getElementById("info").innerHTML =`WPM: ${result}`;

}



document.getElementById("game").addEventListener("keyup",(event) => {
    const key= event.key;
    const currentWord= document.querySelector(".word.current") ; 
    const currentLetter = document.querySelector(".letter.current");
    const expected = currentLetter?.innerHTML || ' '; // current letter pointed 
    const isLetter = key.length ===1 && key !== " "; // if the key is of single length and that it does not equal the backspace 
    const isBackspace = key === "Backspace"
    const isFirstLetter= currentLetter === currentWord.firstChild;
    if (document.querySelector("#game.over")) { // if the game div has the class name over then you should not be allowed to type 
        return; // return nothing so that script stops there 
    }
    console.log({key, expected});
    if (!window.timer && isLetter) {
        window.timer = setInterval(() => {
            if (!window.gameStart) {
                window.gameStart= (new Date()).getTime();
            }
            const currentTime = (new Date()).getTime();// everysecond game the current time
            const msPassed = currentTime - window.gameStart; // cals the timepassed in minitues based on the current time and when what time the gamestart was initilized
            const  sPassed = Math.round(msPassed / 1000);
            const sLeft= (gameTime /1000) - sPassed; 
            // this will count down the timer as 30*1000 = seconds of gametime and div gets us 30 and substracting it from secondpassed counts down
            if (sLeft<= 0){
                gameOver();
                return; // need to stop it here and not replace it with seconds left but the wpm
                
            }
           
            document.getElementById("info").innerHTML= sLeft + "";
        },  1000); // repeatly calls the function everysecond
        alert("start timer");

    }
    



   if (isLetter) {
    if (currentLetter){
        addClass(currentLetter, key==expected ? "correct" : "incorrect" );
        removeClass(currentLetter, "current");
        if (currentLetter.nextSibling) {
            addClass(currentLetter.nextSibling, "current");

        }
       

    }
    else { // if there is no current letter  as in no nextsibling 
         const incorrectLetter= document.createElement("span"); // create a new span for the letter 
         incorrectLetter.innerHTML= key; // adding every keypress
         incorrectLetter.className= "letter incorrect extra";// new classname
         currentWord.appendChild(incorrectLetter); // adding this element or letter to the current word pointed
    }

   }
   if (key === " ") {  // if the keypress was instead a space 
    if (  expected!== " ") { // if the current word we are pointed as was not a space
        const lettersToInvalidate =  [...document.querySelectorAll('.word.current .letter:not(.correct)')]; // invalidates all the letters in the current word
        lettersToInvalidate.forEach(letter=> {addClass(letter, 'incorrect');
        });
    }
    removeClass(currentWord, "current"); // remove the current word class and add it to the next sibling 
    addClass(currentWord.nextSibling, "current ");
    if (currentLetter) { // remove the currentletter as becausae we hit spacebar we need to point to a new word and a new current letter
        removeClass(currentLetter, "current");

    }
    addClass(currentWord.nextSibling.firstChild, "current"); // nextword and points to the first letter to add the class current
   }


   if (isBackspace) {
        if (currentLetter && isFirstLetter) { // if your starting at the first word then do this 
            //make prev word current and last letter current
            removeClass(currentWord, "current");
            addClass(currentWord.previousSibling, "current"); // going back a word and starting at the first letter 
            removeClass(currentLetter, "current");
            addClass(currentWord.previousSibling.lastChild, "current");
            removeClass(currentWord.previousSibling.lastChild, "incorrent");
            removeClass(currentWord.previousSibling.lastChild, "correct");
        }
        if (currentLetter && !isFirstLetter) {
            //move back oine letter, invalidate letter - remove class name
            removeClass(currentLetter, "current");
            addClass(currentLetter.previousSibling, "current");
            removeClass(currentLetter.previousSibling, "incorrect"); // just get rid of any calss highlighting
            removeClass(currentLetter.previousSibling,"correct");

        }
        if (!currentLetter) { 
            addClass( currentWord.lastChild, "current");
            removeClass(currentWord.previousSibling, "incorrect"); // just get rid of any class highlighting 
            removeClass(currentWord.previousSibling,"correct");
        }
   }

   // move lines and words to scroll text up 
   if (currentWord.getBoundingClientRect().top >220 ) {
    const words = document.getElementById("words");
    const margin = parseInt(words.style.marginTop || "0px"); // if there is not margin top then default to 0px(no margin)
    words.style.marginTop = (margin - 35) + "px" ; // keep substracting the margin by 35 to scroll through
   }
    //move cursor 
    const nextLetter = document.querySelector(".letter.current");
    const nextWord= document.querySelector(".word.current");
    const cursor = document.getElementById("cursor");
    if (nextLetter) {
        cursor.style.top = nextLetter.getBoundingClientRect().top+ 2+ "px";
        cursor.style.left=nextLetter.getBoundingClientRect().top + "px";
    }
    else { 
        cursor.style.top = nextWord.getBoundingClientRect().top + 2 + "px";
        cursor.style.left = nextWord.getBoundingClientRect().left + "px";
    }
    
    
});
const saveButton= document.getElementById("Save");
saveButton.addEventListener("click" , ()=> {
    const finalwpm = document.getElementById("info").innerHTML;
    localStorage.setItem("savedRes", finalwpm);





});


document.getElementById("newGameButton").addEventListener("click", ()=> {
    gameOver();
    newGame();



});



newGame();