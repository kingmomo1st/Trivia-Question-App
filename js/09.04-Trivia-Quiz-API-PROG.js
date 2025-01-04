// Lesson 09.04 Trivia Quiz API - PROG

// OpenTDB
// Trivia API
// The Open Trivia Database provides a completely free JSON API for use in programming projects. Use of this API does not require an API Key, just generate the URL below, and use it in your own application to retrieve trivia questions.
// This is the url for 1 question, Any Category (simplest request possible -- 1 question chosen at random from some random category such as Film, Sports, History, etc.)
// https://opentdb.com/api.php?amount=1
// the above url returns a rand obj like:
/* 
{
    "response_code":0,
    "results":[
        {
            "category": "Sports",
            "type": "multiple",
            "difficulty": "medium",
            "question": "Who won the 2018 Monaco Grand Prix?","correct_answer":b"Daniel Ricciardo",
            "incorrect_answers": [
                "Sebastian Vettel",
                "Kimi Raikkonen",
                "Lewis Hamilton"
            ]
        },
    ]
}
*/

// 1. Go to https://www.opentdb.com and click the API tab at the top of the home page

// 2. Use the select menus to customize your data request:
//    For Number of Questions, enter 1 
//    For Select Category, choose General Knowledge
//    For Select Difficulty, choose Any Difficulty
//    For Select Type, choose Multiple Choice

// 3. At the bottom of the page, click GENERATE API URL.
//   Copy the generated API URL which will appear at the top of the page 
//   Come back here to your JS file and paste the URL (we'll come back for it later):

/*
How the API URL Querystring works:
if "Any Difficulty" is selected, querystring does NOT include difficulty variable
https://opentdb.com/api.php?amount=1&category=9&type=multiple
the same query as above, BUT with difficulty level set to "easy":
https://opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=multiple
for our Quiz Game, our queries will always have amount=1 and type=multiple
category number will be set by the select menu value, which is a number
difficulty level is set by Radio Buttons, all of which have name="difficulty"
*/

// DOM Elements required by JS for this application
// JS will be needing:

// Get the DOM elements: 

// 4. Get the select menu for choosing a category and have it call the fetchTriviaQuestion function:
const categoryMenu = document.getElementById('category-menu');
categoryMenu.addEventListener('change', fetchTriviaQuestion);

// 5. Get the button for fetching a question and 
//    have it call the fetchTriviaQuestion function:
const getTriviaBtn = document.getElementById('get-trivia-btn');
getTriviaBtn.addEventListener('click', fetchTriviaQuestion);

// 6. Get the score box div:
const scoreBox = document.getElementById('score-box');

// 6B. get the needle that moves with the score:
const needle = document.getElementById('needle');

// 7. Get the question box, where the question and 4 answer choices appear:
const questionBox = document.getElementById('question-box');

// 8. Get the h3 that holds the question
const questionH3 = document.querySelector('h3');

// 9. Get all 4 answer choice buttons at once w querySelectorAll;
//    this returns a Node List (Array) of all 4 answer choice buttons
const answerBtns = document.querySelectorAll('.answer-choice-btn');
console.log('answerBtns:', answerBtns);

// 10. Loop the array of 4 answer choice buttons, assigning each a listener that runs an anonymous callback arrow function which compares the answer choice to the correct answer; the id of the button tells the function which button was clicked, i.e. what the answer choice is
answerBtns.forEach(btn => btn.addEventListener('click', evalAnswer));

// 11. Get all 4 radio "buttons" at once w querySelectorAll; 
//    this returns a Node List (Array) of all 4 radio input elems
const radioBtns = document.querySelectorAll('.radio-btn');
console.log('radioBtns:', radioBtns);

// Global Variables
// the correct answer is required by two functions, 
// and as such must be in the global scope
// fetchTriviaQuestions() fetches a question, which includes the correct answer
// evalAnswer() compares the user's choice to the correct answer

// 12. Declare correctAnswer in the global scope as an empty string
//     Also declare variables for score, tries and average (avg = score / tries)
let correctAnswer = "";
let tries = score = avg = 0;

// 13. Since we mention evalAnswer and fetchTriviaQuestion in the listeners, we need to immediately declare these functions; have each function log the id of the button that called it:
function fetchTriviaQuestion() {

    // 14. Clear away the previous question:
    // questionBox.innerHTML = "";

    // Concatenate the API URL, which requires us to plug in a couple of values:

    // 15. Get value of select menu, which gets plugged in as category number:
    let catNum = categoryMenu.value;

    // 16. Get difficulty, which is value of the checked radio button
    //     Start with difficulty declared as empty string
    //     If Any radio button is selected, then it will stay as ""
    //     because the API URL does NOT have a difficulty param if difficulty is Any
    //     only add a difficulty param where difficulty is "easy", "medium" or "hard"
    let difficulty = "";
    // 17. Iterate over the array of 4 radio buttons to see which is checked:
    radioBtns.forEach(rb => {
        // 18. If "easy", "medium" or "hard" radio button is checked:
        if(rb.checked && rb.value != "any") {
            // 19. Set the value of difficulty, preceded by "&" for inclusion in URL:
            difficulty = `&difficulty=${rb.value}`; // &difficulty=medium
        }
    });
    console.log('difficulty=', difficulty);

    // Example API URL: https://opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=multiple
    // 20. Concatenate the API URL using category number from select menu and difficulty radio button:
    let apiUrl = `https://opentdb.com/api.php?amount=1&category=${catNum}${difficulty}&type=multiple`;

    // 21. Call the fetch() method, passing it the API URL as its first argument 
    // Don't end fetch() with a semi-colon, because we need to chain on TWO then() methods
    fetch(apiUrl, { method: "GET" })

    // fetch() returns a Promise object which resolves into the question data in JSON format (with double quotes around all the keys). We need to parse this stringified JSON version of the data to get a usable object

    // 22. Write the first then(), which takes a callback function as its argument; the callback takes the JSON data as its argument, calls .json() on the json and returns the parsed object
    .then(jsonResponse => jsonResponse.json())

    // 23. Write the second then(); its callback takes the object returned by the previous then, as its argument.
    //     We now have access to all the properties of the object provided by the API.
    .then(obj => {
        //    The object has a "results" key, the value of which is an array of one trivia object 
        //    We want: the "question", "correct_answer" and i"ncorrect_answers"
        //    "incorrect_answers" is an array of 3 incorrect answer choices
        /*    "results":[ { "category": "Sports", "type": "multiple", "difficulty": "medium",
                "question": "Who won the 2018 Monaco Grand Prix?","correct_answer":b"Daniel Ricciardo",
                "incorrect_answers": [ "Sebastian Vettel", "Kimi Raikkonen", "Lewis Hamilton" ] }, ] */
        
        // 24. Log the whole object, then save the first item in results array to variable, which is an object, 
        //     and then log that object's "question", "correct_answer" and "incorrect_answers" properties:
        console.log('obj:', obj);
        const result = obj.results[0];
        console.log('obj.result:', result);
        console.log('obj.result.question:', result.question);
        console.log('obj.result.correct_answer:', result.correct_answer);
        console.log('obj.result.incorrect_answers:', result.incorrect_answers);

        // 25. set the value of the global correctAnswer variable
        correctAnswer = result.correct_answer;

        // 26. Output the question to the question h3:
        questionH3.innerHTML = result.question;
        
        // Displaying answer choices: the incorrect answers and the correct answer are separate variables: an array and a string, respectively. We need to combine them into one array of 4 choices:
        
        // 27. Make an array of all choices by passing the array of incorrect answers as well as the correctAnswer string to the new array; use the spread operator (...) to break down the incorrect_answers array into individual items; put an &nbsp; (non-breaking space at the end) of the correct as an "invisible tag" by which we can identify it
        const allAnswers = [...result.incorrect_answers, correctAnswer];
        console.log('allAnswers:', allAnswers);
        // ... '&nbsp;'

        // 28. The correct answer is the last of the 4 items in the allChoices array, so randomize the items so that the correct choice is not always choice "D"
        allAnswers.sort(() => Math.random() - 0.5);
        // For good measure, shuffle again using Fisher-Yates
        for(let i = 0; i < allAnswers.length; i++) {
            let temp = allAnswers[i];
            let r = ~~(Math.random()*allAnswers.length);
            allAnswers[i] = allAnswers[r];
            allAnswers[r] = temp;
        }
        console.log('allAnswers shuffled:', allAnswers);

        // 29. loop the array of 4 buttons and assign them their answer choices from the allChoices arr; begin each answer with its letter as id of the btn:
        answerBtns.forEach((e,i) => {
            e.innerHTML = `${e.id}. ${allAnswers[i]}`;
            // 30. Remove right/wrong answer classes from previous question:
            e.classList.remove('right-answer');
            e.classList.remove('wrong-answer');
        });

    }); // close fetch then then

} // close function fetchTriviaQuestions()

// evalAnswer() runs when the user clicks any one of the 4 answer choice buttons

// 30. Declare the evalAnswer() function 
function evalAnswer() {

    console.log('this.id:', this.id); // A, B, C or D
    
    // 31. Each choice requires tries variable to be incremented
    tries++;

    // Compare choice button text to correct answer to see if they match

    // 32. remove the letter, dot and space which precedes
    //     answer choice text, e.g. "A. "
    let answerChoice = this.textContent.slice(3); 
    console.log("answerChoice:", answerChoice);
    console.log("correctAnswer:", correctAnswer);

    // 33. Check if the answer choice text matches correct answer:
    if(answerChoice == correctAnswer) {
        // 34. Add the "right-answer" class to the button so it turns green
        this.classList.add("right-answer");
        // 35. Increment the score for a correct answer
        score++;
    // 36. Else, the answer is incorrect, so make the button red:
    } else {
        this.classList.add("wrong-answer");
    }

    // 37. Recalculate the average and round to 3 decimal places:
    avg = (score / tries).toFixed(3);

    // 37. Output the updated score
    scoreBox.innerHTML = `
    Tries: ${tries} &nbsp; &nbsp; &nbsp; 
    Score: ${score} &nbsp; &nbsp; &nbsp; 
    Avg: ${avg}`;

    /* Lab Challenge: 
    The images folder contains two files: 
    needles.png and gauge.png.
    Your challenge is to deploy them to the Trivia Quiz interface, such that:
        - the gauge sits to the right of the Avg; the gauge is a half-circle arch, with color bars from red to green going clockwise
        - the needle is centered in the gauge, but lying flat at zero, to the left, all the way down in the red zone
        - with each update of score, set the needle position correctly
        - if player avg is 1.00 (100%) needle is pinned all the 
        way to the right in the green zone
        - if player avg is 0.500 (50%) needle is standing straight up, totally vertical
        - if player avg is 0.250 (25%) needle is pointing to middle-left in the yellow-orange zone
        - if player avg is 0.750 (75%) needle is pointing to middle-right in the greenish zone
    */
//    let deg = avg * 180;
//    needle.style.transform = `rotate(${deg}deg)`;

    let gauge = new Image();
    gauge.src = `images/gauge.png`;
    gauge.className = 'gauge';
    scoreBox.appendChild(gauge);

    let needle = new Image();
    needle.src = `images/needle.png`;
    needle.className = 'needle';
    scoreBox.appendChild(needle);

    // Degree range 0-180
    // Avg Score range 0-1
    let degree = avg * 180;
    needle.style.transform = `rotate(${degree}deg)`;

} // close function evalAnswer()

// END: Lesson 09.04