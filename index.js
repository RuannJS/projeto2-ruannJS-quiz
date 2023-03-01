
const express = require('express')
const path = require('path')
const app = express()
const PORT = 3000
const quiz = require('./model/quiz')
const questionList = require('./model/questionList')
const categories = require('./model/categories')

app.use('/', express.static(path.join(__dirname, '/public')))


app.listen(PORT, () => {
    console.log('Quiz 2.0 running on PORT' + PORT)
})

// NEWQUIZ

app.get('/newquiz', (req, res) => {

    res.sendFile('./public/newQuiz/index.html')


})

app.get('/newquiz/questions', (req, res) => {

    res.json(JSON.stringify(quiz.getQuiz()))

})
app.get('/newquiz/show', (req, res) => {

    res.json(JSON.stringify(quiz.getQuestion()))

})

app.post('/newquiz/header', express.json(), (req, res) => {


    const name = req.body.quizName
    const theme = req.body.quizTheme
    const time = req.body.quizTime
    const size = req.body.quizSize

    quiz.newQuiz(name, theme, time, size)

    res.send("Header Added")

})

app.post('/newquiz/add', express.json(), (req, res) => {

    const id = req.body.id
    const question = req.body.question
    const correct = req.body.correct
    const wrong1 = req.body.wrong1
    const wrong2 = req.body.wrong2
    const wrong3 = req.body.wrong3

    quiz.newQuestion(id, question, correct, wrong1, wrong2, wrong3)


    res.send('Question Added')
})

app.put('/newquiz/edit', express.json(), (req, res) => {


    const index = req.body.index
    const question = req.body.question
    const correct = req.body.correct
    const wrong1 = req.body.wrong1
    const wrong2 = req.body.wrong2
    const wrong3 = req.body.wrong3

    quiz.editQuestion(index, question, correct, wrong1, wrong2, wrong3)

    res.send('Question Modified Successfully!')

})


// PREMADE QUIZ

app.get('/categories', (req, res) => {

    res.json(JSON.stringify(categories))

})

app.get('/premade', (req, res) => {
    res.json(JSON.stringify(quiz.getPremade()))
})

app.get('/premadeList', (req, res) => {
    res.json(JSON.stringify(quiz.getCategoryQuestions()))
})

app.post('/premade/newpremade', express.json(), (req, res) => {

    const category = req.body.category
    const time = req.body.time
    const size = req.body.size
    const image = req.body.image

    quiz.newPremade(category, time, size, image)

    res.send('Success')
})

