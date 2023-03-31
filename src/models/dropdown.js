export class Dropdown {
    constructor(data) {
        this.recipes = data.data
        this.$wrapper = data.wrapper
        this.placeholder = data.placeholder
        this.class = data.class ?? data.class

        this.$dropdown = document.createElement('div')
        this.$dropdown.classList.add('dropdown__content', this.class)
    }

    create() {
        const content = `
        <input type="button" value="${this.placeholder}" id="${this.placeholder}" id="searchDropdown">
        <i class="fas fa-chevron-up chevron_down"></i>
        <ul class="dropdown__list hidden ${this.class || ""}">
        </ul>
        `
        this.$dropdown.innerHTML = content
        this.$wrapper.appendChild(this.$dropdown)
        this.fillList()
        this.handleDropdown()
        this.onSearch()
    }

    fillList() {
        const ul = this.$dropdown.querySelector('ul')
        ul.innerHTML = ''
        this.recipes.map((el) => {
            const li = document.createElement('li')
            li.innerHTML = el
            return li
        }).forEach(el => ul.appendChild(el))
    }

    onSearch() {
        const input = this.$dropdown.querySelector('input')
        const ul = this.$dropdown.querySelector('ul')

        input.addEventListener('input', (e) => {

            const { value } = e.target

            if (value.length >= 3) {
                ul.innerHTML = "";
                [...this.recipes]
                    .filter(recipe => recipe.toLowerCase().includes(value.toLowerCase()))
                    .map(el => {
                        const li = document.createElement('li')
                        li.innerHTML = el
                        return li
                    }).forEach(r => ul.appendChild(r))
            } else {
                this.fillList()
            }
        })

    }

    handleDropdown() {
        const dropdown = this.$wrapper.querySelector(`#${this.placeholder}`)

        dropdown.addEventListener('click', (e) => {
            const element = e.target.parentNode
            const list = element.querySelector('.dropdown__list')
            const chevron = element.querySelector('.fa-chevron-up')

            if (element.classList.contains('dropdown__content-active')) {
                e.preventDefault()
                element.classList.remove('dropdown__content-active')
                list.classList.add('hidden')
                chevron.classList.add('chevron_down')
                e.target.setAttribute('type', 'button')
                e.target.setAttribute('value', this.placeholder)
            } else {
                element.classList.add('dropdown__content-active')
                list.classList.remove('hidden')
                chevron.classList.remove('chevron_down')
                e.target.setAttribute('type', 'input')
                e.target.setAttribute('value', '')
                e.target.setAttribute('placeholder', "Rechercher des " + this.placeholder)
            }
        })
    }


}