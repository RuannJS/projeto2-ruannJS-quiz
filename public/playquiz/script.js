const referrer = document.referrer
const adress = 'http://192.168.0.209:3000/'


const categoryName = document.getElementById('category-name')
const categoryImage = document.getElementById('category-image')
const timer = document.getElementById('timer')
const size = document.getElementById('size')

const usedID = []
let score = 0

const questionTitle = document.getElementById('question-title')
const result = document.getElementById('answer-result')
const answers = document.getElementsByClassName('answer')


let initialSizeValue = 1
let finalSizeValue = 0
let intervalID


function alert(msg, type) {

    const wrapper = document.createElement('div')

    wrapper.innerHTML = [
        `<div class="alert alert-${type}" role="alert">`,
        `<div>${msg}</div>`,
        `</div>`
    ].join('')

    result.append(wrapper)
}

function setQuizTimer(time, display) {
    const allButtons = document.querySelectorAll('.btn')
    const originalTime = time
    display.textContent = `00:${time}`

    if (!intervalID) {
        intervalID = setInterval(() => {
            time--
            display.textContent = `00:0${time}`

            if (time <= 5) {
                display.classList.add('text-danger')

                if (time <= 0) {
                    const noTimeMessage = ["Times'up! 😴", "Quicker!😵", "Too slow!😫"]
                    time = originalTime
                    alert(`${noTimeMessage[(Math.random() * 2).toFixed(0)]}`, 'info')
                    setTimeout(resetQuiz, 1000)
                    allButtons.forEach(button => {
                        button.classList.add('disabled')
                    })
                }
            }
            else if (time >= 10) {
                display.textContent = `00:${time}`
            }
        }, 1000)

    }
    allButtons.forEach(button => {
        button.addEventListener('click', () => {
            time = originalTime
        })
    })

}

function* randomize(list) {
    let index = list.length

    while (index--) {
        yield list.splice(Math.floor(Math.random() * (index + 1)), 1)[0]
    }
}


function defaultQuiz() {

    fetch('/premadeList')
        .then(res => res.json())
        .then(json => {


            let randomAnswer = randomize([0, 1, 2, 3])
            let randomID = randomize([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

            const correctAnswer = answers.item(randomAnswer.next().value)
            const wrongAnswer1 = answers.item(randomAnswer.next().value)
            const wrongAnswer2 = answers.item(randomAnswer.next().value)
            const wrongAnswer3 = answers.item(randomAnswer.next().value)


            const questionList = JSON.parse(json)
            const question = questionList[(randomID.next().value)]


            if (!usedID.includes(question.id)) {

                questionTitle.textContent = question.question

                correctAnswer.parentElement.classList.add('correct')
                correctAnswer.textContent = question.answers.correct
                correctAnswer.parentElement.addEventListener('click', handleAnswerClick)

                wrongAnswer1.parentElement.classList.add('wrong')
                wrongAnswer1.textContent = question.answers.wrong1
                wrongAnswer1.parentElement.addEventListener('click', handleAnswerClick)

                wrongAnswer2.parentElement.classList.add('wrong')
                wrongAnswer2.textContent = question.answers.wrong2
                wrongAnswer2.parentElement.addEventListener('click', handleAnswerClick)

                wrongAnswer3.parentElement.classList.add('wrong')
                wrongAnswer3.textContent = question.answers.wrong3
                wrongAnswer3.parentElement.addEventListener('click', handleAnswerClick)

                usedID.push(question.id)
            }
            else {
                defaultQuiz()
            }
        })
}

function resetQuiz() {

    const icons = document.querySelectorAll('.icon')
    const answers = document.querySelectorAll('.answer')
    const correctButton = document.querySelectorAll('.correct')
    const wrongButtons = document.querySelectorAll('.wrong')

    correctButton.forEach(button => {
        button.classList.remove('correct', 'wrong', 'border', 'border-2', 'border-dark', 'disabled')
        button.classList.replace('btn-success', 'btn-dark')
    })

    wrongButtons.forEach(button => {
        button.classList.remove('correct', 'wrong', 'border', 'border-2', 'border-dark', 'disabled')
        button.classList.replace('btn-danger', 'btn-dark')

    })

    icons.forEach(icon => {
        icon.setAttribute('src', '')
    })

    answers.forEach(answer => {
        answer.classList.remove('correct', 'wrong')
    })

    result.innerHTML = ''
    timer.classList.remove('text-danger')

    initialSizeValue++
    size.textContent = `${initialSizeValue}/${finalSizeValue}`

    if (initialSizeValue > finalSizeValue) {
        endQuiz()
    } else {
        if (referrer == adress + 'premadequiz/') {
            defaultQuiz()
        } else if (referrer == adress + 'newquiz/') {
            createQuiz()
        }
    }
}

function handleAnswerClick(event) {

    const passMessage = ['Good Job! 🥳✅', 'NICE!💪💪', 'Keep it up!😄🥳']
    const failMessage = ['Wrong Answer! 😞😖', 'Try Again! 😓😣', 'You Failed! 😢']

    const target = event.target

    if (target.classList.contains('correct')) {

        target.classList.replace('btn-dark', 'btn-success')
        target.lastElementChild.setAttribute('src', '../assets/images/correct-answer.svg')
        target.classList.add('disabled', 'border', 'border-2', 'border-dark')
        const wrongAnswers = document.querySelectorAll('.wrong')
        wrongAnswers.forEach(answer => {
            answer.classList.replace('btn-dark', 'btn-danger')
            answer.classList.add('disabled')
        })

        score++
        alert(`${passMessage[(Math.random() * 2).toFixed(0)]}`, 'info')

    } else if (target.classList.contains('wrong')) {

        const correctAnswer = document.querySelector('.correct')
        target.classList.replace('btn-dark', 'btn-danger')
        target.classList.add('disabled', 'border', 'border-2', 'border-dark')
        const wrongAnswers = document.querySelectorAll('.wrong')
        wrongAnswers.forEach(answer => {
            answer.classList.replace('btn-dark', 'btn-danger')
            answer.classList.add('disabled')
        })

        correctAnswer.classList.replace('btn-dark', 'btn-success')
        correctAnswer.classList.add('disabled')
        correctAnswer.lastElementChild.setAttribute('src', '../assets/images/correct-answer.svg')

        alert(`${failMessage[(Math.random() * 2).toFixed(0)]}`, 'danger')
    }

    setTimeout(resetQuiz, 1000)
}

function endQuiz() {

    const tryAgainButton =
        `
            <button onclick="redirect()" class="btn btn-outline-primary btn-lg"> Try Again </button>
        `
    let buttonMessage = ''
    let finalMessage = ''
    let image = ''
    let medal = ''
    const scorePercentage = (score / finalSizeValue) * 100


    if (scorePercentage <= 25) {
        clearInterval(intervalID)
        intervalID = null
        finalMessage = "You must be feeling like you don't deserve to live in this world being that dumb."
        buttonMessage = `But don't worry! You can ${tryAgainButton}  and be sure of that feeling!`
        image = `../assets/images/endQuiz/zero.png`
    }
    else if (scorePercentage <= 50) {
        clearInterval(intervalID)
        intervalID = null
        finalMessage = "Not as dumb you think you were, but still bellow average."
        buttonMessage = `But don't worry! You can ${tryAgainButton}  and confirm that you are mediocre at best!`
        image = `../assets/images/endQuiz/twenty.jpg`
    }
    else if (scorePercentage <= 75) {
        clearInterval(intervalID)
        intervalID = null
        finalMessage = "Ok, you're not as dumb as the others, but that does not mean a thing."
        buttonMessage = `But don't worry! You can ${tryAgainButton}  and realize that this quiz is a waste of your time!`
        image = `../assets/images/endQuiz/fifty.gif`
    }
    else if (scorePercentage <= 99) {
        clearInterval(intervalID)
        intervalID = null
        finalMessage = "Good job! You did great at this completely meaningless quiz!"
        buttonMessage = `But don't worry! You can ${tryAgainButton}  and brag yourself about your 200+ IQ!`
        image = `../assets/images/endQuiz/seventy.gif`
    }
    else if (scorePercentage == 100) {
        clearInterval(intervalID)
        intervalID = null
        finalMessage = "Wow! Just wow! Can i get an autograph from the smartest person alive?"
        buttonMessage = `Not a single joke in mind right now, can you just ${tryAgainButton} please?`
        image = `../assets/images/endQuiz/hundred.gif`
        medal = `../assets/images/endQuiz/medal.svg`
    }

    const layout = document.getElementById('layout')

    layout.innerHTML =

        `
        <div>
            <div class="mb-4">
                <img height="300px" src="${image}">
            </div>
            <div>
                <h2 class="mb-3 text-danger">You got ${score} answer(s) correctly!</h2>
                <h3 class="mb-3 text-dark">${finalMessage}</h3>
                <h4 class="mb-3 text-dark">${buttonMessage}</h4>
                <h5 class="mb-3 text-danger"> Thank you for playing!</h5>
                <img height="200px" src="${medal}">

            </div>
        </div>
    `

}

function redirect() {

    initialSizeValue = 1
    finalSizeValue = 0
    score = 0
    usedID.length = 0


    window.location.assign(adress)
}


if (referrer == adress + 'premadequiz/') {


    fetch('/premade')
        .then(res => res.json())
        .then(json => {
            const settings = JSON.parse(json)
            settings.forEach(setting => {
                categoryName.textContent = setting.category
                categoryImage.setAttribute('src', `../assets/categoryIcon/${setting.image}.svg`)
                setQuizTimer(setting.time, timer)
                size.textContent = `${initialSizeValue}/${setting.size}`
                finalSizeValue = setting.size
            })
        })
        .then(() => defaultQuiz())
}

// PREMADE

// NEW QUIZ

else if (referrer == adress + 'newquiz/') {
    fetch('/newquiz/questions')
        .then(res => res.json())
        .then(json => {
            const settings = JSON.parse(json)
            settings.forEach(setting => {
                categoryName.textContent = setting.theme
                categoryImage.setAttribute('src', `../assets/categoryIcon/customquiz.svg`)
                setQuizTimer(setting.time, timer)
                size.textContent = `${initialSizeValue}/${setting.size}`
                finalSizeValue = setting.size
            })
        })
        .then(() => createQuiz())

}

function createQuiz() {

    fetch('/newquiz/show')
        .then(res => res.json())
        .then(json => {


            let randomAnswer = randomize([0, 1, 2, 3])
            let randomID

            if (finalSizeValue = 5) {
                randomID = randomize([1, 2, 3, 4, 5])
            }
            else if (finalSizeValue = 10) {
                randomID = randomize([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

            }

            const correctAnswer = answers.item(randomAnswer.next().value)
            const wrongAnswer1 = answers.item(randomAnswer.next().value)
            const wrongAnswer2 = answers.item(randomAnswer.next().value)
            const wrongAnswer3 = answers.item(randomAnswer.next().value)


            const questionList = JSON.parse(json)

            const question = questionList[(randomID.next().value)]
            console.log(questionList)
            console.log(question)

            if (!usedID.includes(question.id)) {

                questionTitle.textContent = question.question

                correctAnswer.parentElement.classList.add('correct')
                correctAnswer.textContent = question.correct
                correctAnswer.parentElement.addEventListener('click', handleAnswerClick)

                wrongAnswer1.parentElement.classList.add('wrong')
                wrongAnswer1.textContent = question.wrong1
                wrongAnswer1.parentElement.addEventListener('click', handleAnswerClick)

                wrongAnswer2.parentElement.classList.add('wrong')
                wrongAnswer2.textContent = question.wrong2
                wrongAnswer2.parentElement.addEventListener('click', handleAnswerClick)

                wrongAnswer3.parentElement.classList.add('wrong')
                wrongAnswer3.textContent = question.wrong3
                wrongAnswer3.parentElement.addEventListener('click', handleAnswerClick)

                usedID.push(question.id)
            }
            else {
                createQuiz()
            }
        })
}






