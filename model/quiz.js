const categories = require('./categories')
const questionList = require('./questionList')

module.exports = {

    // CREATE QUIZ
    quizModel:
        [

        ],

    questionModel:
        [
            {
                question: 'MODEL',
                correct: 'MODEL',
                wrong1: 'MODEL',
                wrong2: 'MODEL',
                wrong3: 'MODEL',
            }

        ],

    premadeModel:
        [


        ],


    newQuiz(name, theme, time, size) {
        this.quizModel.push({ name, theme, time, size })
    },



    getQuiz() {
        return this.quizModel
    },

    newQuestion(id, question, correct, wrong1, wrong2, wrong3) {
        this.questionModel.push({ id, question, correct, wrong1, wrong2, wrong3 })
    },

    getQuestion() {
        return this.questionModel
    },

    editQuestion(index, newQuestion, newCorrect, newWrong1, newWrong2, newWrong3) {
        this.questionModel.splice(index, 1,
            {
                question: newQuestion,
                correct: newCorrect,
                wrong1: newWrong1,
                wrong2: newWrong2,
                wrong3: newWrong3

            }
        )
    },

    // PREMADE QUIZ

    newPremade(category, time, size, image) {
        this.premadeModel.push({ category, time, size, image })
    },

    getPremade() {
        return this.premadeModel
    },

    getCategoryQuestions() {

        const modelCategory = this.premadeModel.map(model => model.image).pop()
        if (modelCategory == 'question-mark') {

            const randomList = []

            function shuffle(array) {
                for (let index = array.length - 1; index > 0; index--) {
                    const jindex = Math.floor(Math.random() * (index + 1))
                    const temp = array[index]

                    array[index] = array[jindex]
                    array[jindex] = temp
                }
                return array
            }

            for (let question of shuffle(questionList)) {
                randomList.push(question)
            }
            randomList.length = 10

            return randomList

        } else {
            return questionList.filter(question => question.category == modelCategory)
        }

    },

}


