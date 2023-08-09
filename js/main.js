// letters
const letters="abcdefghijklmnopqrstuvwxyz";
// get array from letters
let lettersArray = Array.from(letters);

if(localStorage.getItem("equal")){
    window.localStorage.removeItem('equal');
}
if(localStorage.getItem("wrongAttempts")){
    window.localStorage.removeItem('wrongAttempts');
}

// select letters container

let lettersContainer= document.querySelector(".letters");

lettersArray.forEach(letter =>{
    let span=document.createElement("span");
    let theLetter=document.createTextNode(letter);
    span.appendChild(theLetter);
    span.className="letter-box";
    lettersContainer.appendChild(span)
});

const api="../entries.json";
async function getData(){
    try{
        const response= await fetch(api);
        const data =await response.json();
        printData(data)
    }
    catch(e){
        console.log("Error",e.message);
    }
}
// object of words + categories
const words={
    programming:["HTML","CSS","JavaScript","go","php","r","ruby"],
    movies:[ "prestige","inception","intersteller","whiplash","memento","coco","perfume"],
    people:["Albert Einstein","hitchcock","Alexander","Cleopatra","Mahatma Ghandi"],
    countries:["Syria","Palestine","Yemen","Egypt","Bahrain","Qatar"],
}

//get random property

let allKeys= Object.keys(words);

let randomPropNumber= Math.floor(Math.random()*allKeys.length);
let randomPropName= allKeys[randomPropNumber];
let randomPropValue= words[randomPropName];

let randomValueNumber=Math.floor(Math.random()*randomPropValue.length);
let randomValueValue= randomPropValue[randomValueNumber];


// set category info
document.querySelector(".game-info .category span").innerHTML=randomPropName;

//select letters guess element
let lettersGuessContainer= document.querySelector(".letters-guess");

// convert choosen word to array
let lettersAndSpace= Array.from(randomValueValue);

//create spans depend on word
lettersAndSpace.forEach(letter =>{
    //create empty span
    let emptySpan=document.createElement("span");
    //if letter is space
    if(letter===' '){
        emptySpan.className='has-space';
    }
    lettersGuessContainer.appendChild(emptySpan)
});

let guessSpan=document.querySelectorAll(".letters-guess span");

// set wrong attempts
let wrongAttempts=0;
// selest the draw element
let theDraw=document.querySelector(".hangman-draw");

//handle clicking on letters
document.addEventListener('click',(e)=>{
    //set  the chose status
    let theStatus =false;
    if(e.target.className==='letter-box'){
        e.target.classList.add('clicked');
        //get clicked letter
        let theClickedLetter=e.target.innerHTML.toLowerCase();
        //the chosen word
        let theChosenWord=Array.from(randomValueValue.toLowerCase())
        theChosenWord.forEach((wordLetter,wordIndex)=>{
            let finalWord=[];
            // if the clicked letter equal to one of the chosen word letter
            if(theClickedLetter==wordLetter){

                theStatus=true;
            // loop on all guess span
            
            guessSpan.forEach((span,spanIndex)=>{
                if(wordIndex===spanIndex){
                    span.innerHTML=theClickedLetter;
                }
                finalWord.push(span.innerHTML);
                console.log(finalWord.join(""));
                console.log(theChosenWord.join(""));
                if((finalWord.join(""))==(theChosenWord.join(""))){
                    window.localStorage.setItem("equal",true);
                }
            });
                
            }
        });
        // outside loop
        // if letter is wrong
        if(theStatus !== true){
            //increase the wrong attempts
            wrongAttempts++;
            theDraw.classList.add(`wrong-${wrongAttempts}`);

            document.getElementById("fail").play();

            if(wrongAttempts === 8){
                endGame();
                lettersContainer.classList.add("finished")
            }
            localStorage.setItem("wrongAttempts",wrongAttempts);
        }
        else{
            document.getElementById("success").play();
            }
            if( (localStorage.getItem("equal")) &&( localStorage.getItem("wrongAttempts")>3)){
                winner("Good");
                lettersContainer.classList.add("finished")
        }
        if( (localStorage.getItem("equal")) &&(localStorage.getItem("wrongAttempts") < 3)){
            winner("Super");
            lettersContainer.classList.add("finished")
    }
    }
})

// end game function
function endGame(){
    // create popup
    let div=document.createElement("div");
    let divText=document.createTextNode(`Game Over, The word is ${randomValueValue}`);
    let spanClose=document.createElement("span");
    let spanCloseText=document.createTextNode("X");
    spanClose.appendChild(spanCloseText);
    spanClose.className="spanClose";
    div.appendChild(spanClose);
    div.appendChild(divText);
    div.className="popup";
    document.body.appendChild(div);

}

// win game function
function winner(level){
    let div=document.createElement("div");
    let divText=document.createTextNode(`You are ${level} Winner`);
    let spanClose=document.createElement("span");
    let spanCloseText=document.createTextNode("X");
    spanClose.appendChild(spanCloseText);
    spanClose.className="spanClose";
    let next=document.createElement("span");
    let spanNext=document.createTextNode("Next");
    next.className="spanNext";
    next.appendChild(spanNext);
    div.appendChild(next);
    div.appendChild(spanClose);
    div.appendChild(divText);
    div.className="popup";
    document.body.appendChild(div);
}

let score=0;
let letterBox=document.querySelectorAll(".letters .letter-box");
document.addEventListener('click',function(e){
    if(e.target.className=='spanNext'){
        score++;
        
        window.localStorage.setItem("score",score);
        e.target.parentNode.remove();
        lettersContainer.classList.remove("finished");
        letterBox.forEach((ele)=>{
            ele.classList.remove("clicked");
        })
        guessSpan.forEach((ele)=>{
            ele.innerHTML=""
        })
        
        
    }
})