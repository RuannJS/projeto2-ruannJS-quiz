// FORM ELEMENTS

const radioForm = document.forms.form
const form = document.getElementById('form')
const quizName = document.getElementById('quizName')
const quizTheme = document.getElementById('quizTheme')
const timerRadio = radioForm.elements.timer
const sizeRadio = radioForm.elements.size
let globalId = ""
let id = 1

form.addEventListener('submit', quizInfo)
form.addEventListener('submit', customizeQuestions)






// SENDING QUIZ HEADER TO BACKEND
function quizInfo(event) {
    event.preventDefault()
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            quizName: quizName.value,
            quizTheme: quizTheme.value,
            quizTime: timerRadio.value,
            quizSize: sizeRadio.value
        })
    }
    fetch("/newquiz/header", options)
        .then(res => console.log(res))
        .catch(err => {
            return err
        })
}

// FORM ELEMENTS

const quizElement = document.getElementById('quiz-form')
const title = document.getElementById('title')



// CREATING CUSTOM QUESTIONS
function customizeQuestions() {

    fetch("/newquiz/questions")
        .then(res => {
            return res.json()
        })
        .then(json => {
            const quizHeader = JSON.parse(json)
            quizHeader.forEach((quiz) => {
                title.innerText = `${quiz.name} Quiz`
                quizElement.innerHTML =
                    `
                    <form id="create-question">
                        <fieldset id="fieldset">
                            <div id='quiz-header-data' class="m-1">
                                    <span id='theme'> ${quiz.theme} - </span>
                                    <span id='time'> ${quiz.time} seconds - </span>
                                    <span id='size'> ${quiz.size} questions</span>
                                </div>
                                <div id='add-questions' class="mt-3">
                                    <div id='question'>
                                        <label class="form-label" for="questionValue">
                                            <h4 class="fw-bolder">ADD A QUESTION</h4>
                                            </label><br>
                                        <input class="form-control form-control-lg" placeholder="Ex: Who's worst at Dota?" type='text'
                                            id="questionValue" name="questionValue" required>
                                </div>
                                <div id="options" class="mt-3">
                                    <div id="values">
                                        <div id="right-value">
                                            <label class="form-label" for="correctValue">
                                                <h5>Insert the <span class="fw-bolder text-success">CORRECT</span> answer!</h5>
                                            </label><br>
                                            <input class="form-control form-control-lg" placeholder="Ex: Slucaverd" type="text"
                                                id="correctValue" name="correctValue" required>
                                        </div>
                                        <div id="wrong-values">
                                            <div id="wrong-value-1" class="mt-3">
                                                <label class="form-label" for="wrongValue1">
                                                    <h5><span class="fw-bolder text-danger">Wrong Answer </span> - 1</h5>
                                                </label><br>
                                                <input class="form-control form-control-lg" placeholder="Ex: Fugazl" type="text"
                                                    id="wrongValue1" name="wrongValue1" required>
                                            </div>
                                            <div id="wrong-value-2" class="mt-3">
                                                <label class="form-label" for="wrongValue2">
                                                    <h5><span class="fw-bolder text-danger">Wrong Answer </span> - 2</h5>
                                                </label><br>
                                                <input class="form-control form-control-lg" placeholder="Ex: Andy" type="text"
                                                id="wrongValue2" name="wrongValue2" required>
                                            </div>
                                            <div id="wrong-value-3" class="mt-3">
                                                <label class="form-label" for="wrongValue3">
                                                    <h5><span class="fw-bolder text-danger">Wrong Answer </span> - 3</h5>
                                                </label><br>
                                                <input class="form-control form-control-lg" placeholder="Ex: Gustavo" type="text"
                                                    id="wrongValue3" name="wrongValue3" required>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class='pt-3 pb-3'>
                                <input id="submit-btn" class='submit me-2 btn btn-lg btn-outline-success' value="Submit" type="submit">
                                <input id="reset-btn" class='btn btn-lg btn-outline-dark' type='reset' value='Reset'>
                            </div>
                        </fieldset>
                    </form>
                    `

                quizElement.addEventListener('submit', getQuestion)
                quizElement.addEventListener('submit', addModal)
                quizElement.addEventListener('submit', addModalButtons, { once: true })
                quizElement.addEventListener('submit', enableModalButtons)
                quizElement.addEventListener('submit', addQuestion)
                quizElement.addEventListener('submit', closeAlert)
            })
        })
}


// RECEIVING DATA AND UPDATING INPUT
function getQuestion() {

    const question = document.getElementById('questionValue')
    const correct = document.getElementById('correctValue')
    const wrong1 = document.getElementById('wrongValue1')
    const wrong2 = document.getElementById('wrongValue2')
    const wrong3 = document.getElementById('wrongValue3')

    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id++,
            question: question.value,
            correct: correct.value,
            wrong1: wrong1.value,
            wrong2: wrong2.value,
            wrong3: wrong3.value
        })
    }

    fetch('/newquiz/add', options)
        .then(res => {
            if (res.ok) {
                question.value = ""
                correct.value = ""
                wrong1.value = ""
                wrong2.value = ""
                wrong3.value = ""
            }
        })
        .catch(error => console.log(error))
}



// ADDING MODAL

function addModal() {
    quizElement.innerHTML +=
        `<div class="modal fade" id="modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Question</h1>
                    <button class="btn-close" type="button" data-bs-dismiss="modal"></button>
                </div>
            <form id="modal-form">
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="modalQuestion" class="col-form-label">Question:</label>
                        <input required type="text" name="question" class="form-control" id="modalQuestion">
                    </div>
                    <div class="mb-3">
                        <label for="modalCorrect" class="col-form-label">Correct Answer:</label>
                        <input required type="text" class="form-control" id="modalCorrect">
                    </div>
                    <div class="mb-3">
                        <label for="modalWrong1" class="col-form-label">Wrong Answer¹:</label>
                        <input required type="text" class="form-control" id="modalWrong1">
                    </div>
                    <div class="mb-3">
                        <label for="modalWrong2" class="col-form-label">Wrong Answer²:</label>
                        <input required type="text" class="form-control" id="modalWrong2">
                    </div>
                    <div class="mb-3">
                        <label for="modalWrong3" class="col-form-label">Wrong Answer³:</label>
                        <input required type="text" class="form-control" id="modalWrong3">
                    </div>
                </div>
                <div class="modal-footer">
                    <div id="alertPlaceHolder"></div>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button onclick="editQuestion()" id="editBtn" type="button" class="btn btn-primary">Save Changes</button>
                </div>
            </form>
            </div>
        </div>
    </div>`
}


// SHOW & EDIT QUESTIONS

function addModalButtons() {
    for (let index = 1; index <= sizeRadio.value; index++) {
        if (index == 1) {
            quizElement.innerHTML +=
                `<button type="button" 
                class="m-2 btn btn-success" 
                data-bs-toggle="modal" 
                data-bs-target="#modal"
                data-bs-questionNumber="${index}">
               ${index}
               </button>`
        } else {
            quizElement.innerHTML +=
                `<button type="button" 
                id="disabledButton"
                 class="m-2 btn btn-success disabled" 
                 data-bs-toggle="modal" 
                 data-bs-target="#modal"
                 data-bs-questionNumber="${index}">
                ${index}
                </button>`
        }
    }
}


function editQuestion() {

    const modal = document.getElementById('modal')

    const selectedQuestion = modal.querySelector('.modal-body #modalQuestion')
    const selectedCorrect = modal.querySelector('.modal-body #modalCorrect')
    const selectedWrong1 = modal.querySelector('.modal-body #modalWrong1')
    const selectedWrong2 = modal.querySelector('.modal-body #modalWrong2')
    const selectedWrong3 = modal.querySelector('.modal-body #modalWrong3')

    if (selectedQuestion.value == '' || selectedCorrect.value == '' ||
        selectedWrong1.value == '' || selectedWrong2.value == '' || selectedWrong3.value == '') {

        const inputs = modal.querySelectorAll('.modal-body input')

        inputs.forEach(input => {
            if (input.value == '') {
                input.classList.add('invalid')
            }
            else {
                input.classList.add('valid')
            }
        })
        alert('All fields must be filled out!', 'danger')
    } else {



        const options = {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(
                {
                    index: globalId,
                    question: selectedQuestion.value,
                    correct: selectedCorrect.value,
                    wrong1: selectedWrong1.value,
                    wrong2: selectedWrong2.value,
                    wrong3: selectedWrong3.value
                })
        }

        fetch('/newquiz/edit', options)

            .then(res => { console.log(res) })
            .catch(err => { console.log(err) })

        fetch('/newquiz/show')
            .then(res => { return res.json() })
            .then(json => {
                const input = JSON.parse(json)
                const question = modal.querySelectorAll('.modal-body #modalQuestion')
                const correct = modal.querySelectorAll('.modal-body #modalCorrect')
                const wrong1 = modal.querySelectorAll('.modal-body #modalWrong1')
                const wrong2 = modal.querySelectorAll('.modal-body #modalWrong2')
                const wrong3 = modal.querySelectorAll('.modal-body #modalWrong3')

                question.forEach(question => {
                    question.value = input[globalId].question
                    question.classList.add('fulfilled')
                    if (question.classList.contains('valid') || question.classList.contains('invalid')) {
                        question.classList.remove('valid', 'invalid')
                    }
                })
                correct.forEach(correct => {
                    correct.value = input[globalId].correct
                    correct.classList.add('fulfilled')
                    if (correct.classList.contains('valid') || correct.classList.contains('invalid')) {
                        correct.classList.remove('valid', 'invalid')
                    }
                })
                wrong1.forEach(wrong1 => {
                    wrong1.value = input[globalId].wrong1
                    wrong1.classList.add('fulfilled')
                    if (wrong1.classList.contains('valid') || wrong1.classList.contains('invalid')) {
                        wrong1.classList.remove('valid', 'invalid')
                    }
                })
                wrong2.forEach(wrong2 => {
                    wrong2.value = input[globalId].wrong2
                    wrong2.classList.add('fulfilled')
                    if (wrong2.classList.contains('valid') || wrong2.classList.contains('invalid')) {
                        wrong2.classList.remove('valid', 'invalid')
                    }
                })
                wrong3.forEach(wrong3 => {
                    wrong3.classList.add('fulfilled')
                    wrong3.value = input[globalId].wrong3
                    if (wrong3.classList.contains('valid') || wrong3.classList.contains('invalid')) {
                        wrong3.classList.remove('valid', 'invalid')
                    }
                })

                alert(`Question ${globalId} changes applied!`, 'info')
                addQuestion()

            })
    }
}

function addQuestion() {

    fetch('/newquiz/show')
        .then(res => {
            return res.json()
        })
        .then(json => {
            const input = JSON.parse(json)

            const modal = document.getElementById('modal')
            modal.addEventListener('show.bs.modal', event => {

                const button = event.relatedTarget
                const id = button.getAttribute('data-bs-questionNumber')
                globalId = id

                const title = modal.querySelector('.modal-title')
                const question = modal.querySelectorAll('.modal-body #modalQuestion')
                const correct = modal.querySelectorAll('.modal-body #modalCorrect')
                const wrong1 = modal.querySelectorAll('.modal-body #modalWrong1')
                const wrong2 = modal.querySelectorAll('.modal-body #modalWrong2')
                const wrong3 = modal.querySelectorAll('.modal-body #modalWrong3')


                title.textContent = `Question ${id}`

                question.forEach(question => {
                    question.value = input[id].question
                })
                correct.forEach(correct => {
                    correct.value = input[id].correct
                })
                wrong1.forEach(wrong1 => {
                    wrong1.value = input[id].wrong1
                })
                wrong2.forEach(wrong2 => {
                    wrong2.value = input[id].wrong2
                })

                wrong3.forEach(wrong3 => {
                    wrong3.value = input[id].wrong3
                })
            })
        })
}

// ALERT

function alert(msg, type) {
    const alertPlaceHolder = document.getElementById('alertPlaceHolder')

    const wrapper = document.createElement('div')

    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `<div>${msg}</div>`,
        '<button type="button" class="d-block btn-close" data-bs-dismiss="alert" aria-label="Close"></button',
        '</div>'
    ].join('')

    // ONLY 1 ALERT ALLOWED
    const modal = document.getElementById('modal')
    const alerts = modal.querySelectorAll('[data-bs-dismiss="alert"]')

    alerts.forEach(() => {

        for (let index = 0; index < alerts.length; index++) {
            alertPlaceHolder.innerHTML = ''
        }
    })

    alertPlaceHolder.append(wrapper)

}

function closeAlert() {
    const modal = document.getElementById('modal')
    const dismissModal = modal.querySelectorAll('[data-bs-dismiss="modal"]')
    const alertPlaceHolder = document.getElementById('alertPlaceHolder')
    const inputs = modal.querySelectorAll('.modal-body input')

    dismissModal.forEach(dismiss => {
        dismiss.addEventListener('click', () => {
            alertPlaceHolder.innerHTML = ''
            inputs.forEach(input => {
                input.classList.remove("valid", "invalid", "fulfilled")
            })

        })
    })


}


function enableModalButtons() {
    fetch('/newquiz/show')
        .then(res => {
            return res.json()
        })
        .then(json => {
            const questions = JSON.parse(json)
            const button = document.querySelectorAll('.disabled')

            button.forEach(button => {
                if (questions.length > button.getAttribute('data-bs-questionNumber')) {
                    button.classList.remove('disabled')
                }
            })
            // -1 -> QUESTIONS.LENGTH STARTS AT INDEX 1 
            if (questions.length - 1 == sizeRadio.value) {

                const questionForm = document.getElementById('create-question')
                const fieldset = document.getElementById('fieldset')

                fieldset.setAttribute("disabled", "disabled")

                questionForm.innerHTML +=

                    `
                <div class='pt-3 pb-3'>
                    <button type="button" onclick="window.location='/playquiz'" id="finish-btn" class="me-2 btn btn-lg btn-outline-primary">
                    Click here to start your Quiz!
                    </button>
                    <h4 class="mt-2">You can still <span class="bold">edit</span> your questions!</h4>
                    <h5>Click on the green squares and take a look.</h5>
                </div>
                  `
            }
        })
}



