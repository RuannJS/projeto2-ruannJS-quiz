document.addEventListener('DOMContentLoaded', () => {
    createCategories()
    createModal()
    editModal()
})

const showCategory = document.getElementById('category')

function createCategories() {
    editModal()

    const buttonsPerRow = 2
    let addedButtons = 0

    showCategory.innerHTML += `<div class="row"></div>`

    fetch('/categories')
        .then(res => {
            return res.json()
        })
        .then(json => {
            const categories = JSON.parse(json)

            categories.forEach(category => {
                const id = category.themeID
                const name = category.themeName
                const image = category.bgImage
                if (addedButtons % buttonsPerRow == 0) {
                    showCategory.innerHTML += `<div class="row"></div>`
                }
                const row = document.querySelector(".row:last-child")

                row.innerHTML +=
                    `
                    <button 
                        id="${id}" 
                        class="modal-button border border-secondary border-opacity-25 btn col m-4" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                        data-bs-name="${name}" data-bs-image="${image}">
                        <h2>${name}</h2>
                        <img src="../assets/categoryIcon/${image}.svg" width="150px" height="150px" alt="${image}">
                    </button>
                    `
                addedButtons++
            })
        })
        .catch(err => console.log(err))

}

function createModal() {
    showCategory.innerHTML +=
        `
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div id="content" class="modal-content">
                <div id="staticBackdropLabel" class="bg-warning bg-opacity-25 modal-body">
                    <p>You've selected: 
                        <p id="modal-text" class="fs-1"></p>
                    </p>
                    <img class="m-3" id="modal-image" width="200px" heigth="200px">
                    <p id="modal-sub-text" class="fs-2">Want to continue?</p>
                </div>
                <div class="justify-content-center bg-warning bg-opacity-50 modal-footer">
                    <button onclick="modalForm()" type="button" class="btn btn-lg  btn-outline-success">Yes</button>
                    <button data-bs-dismiss="modal" type="button" class="btn btn-lg  btn-outline-danger">No</button>
                </div>
            </div>
        </div>
    </div>
    `
}

function editModal() {

    fetch('/categories')
        .then(res => res.json())
        .then(() => {

            const modalText = document.getElementById('modal-text')
            const modalImage = document.getElementById('modal-image')
            const buttons = showCategory.querySelectorAll('.modal-button')
            buttons.forEach(button => {
                button.addEventListener('click', event => {
                    const target = event.currentTarget

                    const name = target.getAttribute('data-bs-name')
                    const image = target.getAttribute('data-bs-image')
                    modalText.textContent = name
                    modalImage.setAttribute('src', `../assets/categoryIcon/${image}.svg`)
                    modalImage.setAttribute('alt', image)
                })
            })
        })
}

function modalForm() {

    const form = document.getElementById('content')

    const name = document.getElementById('modal-text').textContent
    const image = document.getElementById('modal-image').getAttribute('alt')


    form.innerHTML =
        `
            <div class="bg-warning bg-opacity-25 modal-body">
                <h4 id="category-name">${name}</h4>
                <img id="category-image" alt="${image}" src="../assets/categoryIcon/${image}.svg" class="m-2" width="85px">
            </div>
            <div class="bg-warning bg-opacity-25">
                <form id="form">   
                    <h2>Quiz Settings</h2>
                    <div class='pt-3'>
                        <label class='form-label'>
                            <h5>Quiz Timer(in seconds)</h5>
                        </label><br>
                        <div class='form-check form-check-inline'>
                            <label class='form-check-label' for='ten-seconds'>10</label>
                            <input class='form-check-input' type='radio' id='ten-seconds' name='timer' value='10'
                                required>
                        </div>
                        <div class='form-check form-check-inline'>
                            <label class='form-check-label' for='thirthy-seconds'>30</label>
                            <input class='form-check-input' type='radio' id='thirthy-seconds' name='timer' value='30'>
                        </div>
                        <div class='form-check form-check-inline'>
                            <label class='form-check-label' for='sixty-seconds'>60</label>
                            <input class='form-check-input' type='radio' id='sixty-seconds' name='timer' value='60'><br>
                        </div>
                    </div>
                    <div class='pt-3'>
                        <label class='form-label'>
                            <h5>How many questions?</h5>
                        </label><br>
                        <div class='form-check form-check-inline'>
                            <label class='form-check-label' for='five-questions'>5</label>
                            <input class='form-check-input' type='radio' id='five-questions' name='size' required
                            value='5'>
                        </div>
                        <div class='form-check form-check-inline'>
                            <label class='form-check-label' for='ten-questions'>10</label>
                            <input class='form-check-input' type='radio' id='ten-questions' name='size' value='10'>
                        </div>
                        <div class='form-check form-check-inline'>
                            <label class='form-check-label' for='fifteen-questions'>15</label>
                            <input class='form-check-input' type='radio' id='fifteen-questions' name='size' value='15'
                            disabled><br>
                        </div>
                        <div class='pt-3 pb-5'>
                            <button onclick="getSettings()" class='me-2 btn btn-lg btn-outline-success'>Start Quiz</button>
                        </div>
                    </div>
                </form>    
            </div>
        `
}

function getSettings() {

    const formElements = document.forms.form
    const timer = formElements.elements.timer
    const size = formElements.elements.size
    const categoryName = document.getElementById('category-name')
    const image = document.getElementById('category-image')
    const imageName = image.getAttribute('alt')


    formElements.addEventListener('submit', event => {
        event.preventDefault()
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category: categoryName.textContent,
                time: timer.value,
                size: size.value,
                image: imageName
            })
        }

        fetch('/premade/newpremade', options)
            .then(res => console.log(res))
            .then(window.location.replace('/playquiz'))
            .catch(err => console.log(err))

    })


}


