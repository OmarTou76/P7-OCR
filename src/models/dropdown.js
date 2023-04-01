export class Dropdown {
    constructor(data, selectedTags) {
        this.recipes = data.data
        this.$wrapper = data.wrapper
        this.section = data.section
        this.class = data.class ?? data.class

        this.selectedTags = selectedTags

        this.$dropdown = document.createElement('div')
        this.$dropdown.classList.add('dropdown__content', this.class ?? this.class)

        this.$tagWrapper = document.querySelector('.tags-container')
    }

    create() {
        const content = `
        <input type="button" value="${this.section}" id="${this.section}" id="searchDropdown">
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
        this.recipes
            .filter(tag => !this.selectedTags[this.section.toLowerCase()]?.includes(tag))
            .map((el) => {
                const li = document.createElement('li')
                li.innerHTML = el
                this.onSelectTag(li)
                return li
            }).forEach(el => ul.appendChild(el))
    }

    onSelectTag(element, textInput = "") {
        element.addEventListener('click', (e) => {
            const elementSelected = e.target.innerHTML
            this.createTag(elementSelected)
            if (textInput) {
                this.onInput(textInput)
            } else {
                this.fillList()
            }
        })
    }

    saveTag(tag) {
        if (this.selectedTags.hasOwnProperty(this.section.toLowerCase())) {
            this.selectedTags[this.section.toLowerCase()].push(tag)
        } else {
            this.selectedTags[this.section.toLowerCase()] = [tag]
        }
    }

    createTag(tag) {
        const btn = document.createElement('button')
        btn.classList.add("tag", this.class)

        const content = `
            <span>${tag}</span>
            <i class="far fa-times-circle"></i>
        `
        btn.innerHTML = content

        this.$tagWrapper.appendChild(btn)
        this.saveTag(tag)
        this.onDeleteTag(btn, tag)
    }

    onDeleteTag(btn, tag) {
        btn.addEventListener('click', () => {
            this.selectedTags[this.section.toLowerCase()] = this.selectedTags[this.section.toLowerCase()].filter(element => element !== tag)
            this.fillList()
            btn.remove()
        })
    }

    onSearch() {
        const input = this.$dropdown.querySelector('input')

        input.addEventListener('input', (e) => {

            const { value } = e.target

            if (value.length >= 3) {
                this.onInput(value)
            } else {
                this.fillList()
            }
        })

    }

    onInput(value) {

        const ul = this.$dropdown.querySelector('ul')

        ul.innerHTML = "";
        [...this.recipes]
            .filter(recipe => recipe.toLowerCase().includes(value.toLowerCase()) && !this.selectedTags[this.section.toLowerCase()]?.includes(recipe))
            .map(el => {
                const li = document.createElement('li')
                li.innerHTML = el
                this.onSelectTag(li, value)
                return li
            }).forEach(r => ul.appendChild(r))
    }

    handleDropdown() {
        const dropdown = this.$wrapper.querySelector(`#${this.section}`).parentNode
        const list = dropdown.querySelector('.dropdown__list')
        const input = dropdown.querySelector('input')
        const chevron = dropdown.querySelector('.fa-chevron-up')

        dropdown.addEventListener('click', (e) => {

            const chevronTarget = e.target.classList.contains('fa-chevron-up')

            if (dropdown.classList.contains('dropdown__content-active') && chevronTarget) {
                dropdown.classList.remove('dropdown__content-active')
                list.classList.add('hidden')
                chevron.classList.add('chevron_down')
                input.setAttribute('type', 'button')
                input.setAttribute('value', this.section)
            } else {
                dropdown.classList.add('dropdown__content-active')
                list.classList.remove('hidden')
                chevron.classList.remove('chevron_down')
                input.setAttribute('type', 'input')
                input.setAttribute('value', '')
                input.setAttribute('placeholder', "Rechercher des " + this.section)
            }
        })
    }
}