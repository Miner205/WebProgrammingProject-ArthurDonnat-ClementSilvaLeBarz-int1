
var nbAttempt = 0;

function submitQuiz() {
    //First we check that all questions are answered
    var allquiz = document.querySelectorAll('.quiz');
    var required = [];
    allquiz.forEach(item => {
        required.push(item.querySelectorAll('input:checked').length);
    });
    let sum = 0;
    required.forEach(item => { sum += item; });
    let allFilled = (document.querySelectorAll('.questions').length == sum);
    if (!allFilled) {
        alert("Please fill in all fields before submiting!");
    }
    else {
        //Then we ask if the user really wants to submit
        var res = confirm("Are you sure you want to submit?");
        if (res == true) {
            alert("Ok, here the results :");

            //Then we compute the results
            var score = 0;
            const answers = ['a', 'c'];
            const radios = document.querySelectorAll('input[name*="q"]:checked');
            for (let i = 0; i < radios.length; i++) {
                if (radios[i].value === answers[i]) {
                    score += 1;
                }
            };
            console.log("score : " + score);

            //put the score in the table
            const tableBody = document.getElementById("quiz-results").getElementsByTagName('tbody')[0];
            let newRow = tableBody.insertRow(-1);
            let display_attempt = newRow.insertCell(0);
            display_attempt.innerHTML = ++nbAttempt;
            let display_score = newRow.insertCell(1);
            display_score.innerHTML = score;

            if (nbAttempt >= 5) { //No more than 5 attempts
                allquiz.forEach(item => {
                    item.disabled = true;
                });
            }
            else {
                allquiz.forEach(item => { //Erase the quiz when submited
                    item.querySelectorAll('input').forEach(i => {
                        i.checked = false;
                    });
                });
            }
        }
    }
}