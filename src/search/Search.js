export class Search {
    constructor(app) {
        this.app = app

        this._initialState = []
        this._filteredSearch = []

        this._tags = []
        this._selectedTags = {}

        this.subscribers = []

        this._query = ""

        this.$mainSearch = document.getElementById('mainSearch')
        this.onInput()
    }


    update() {

        this.filter()

    }

    filter() {
        this.filterbyTags()

        this.app.displayRecipe(this.currentState)

        this.saveTags()
        this.notify()

    }

    filterByInput() {
        if (!this._query) return [...this.initialState]

        const result = []
        const recipes = [...this.initialState]

        for (let i = 0; i < recipes.length; i++) {

            let match = false
            const values = [recipes[i].name, recipes[i].description]

            const { ingredients } = recipes[i]

            for (let j = 0; j < ingredients.length; j++) {
                values.push(ingredients[j].ingredient)
            }

            for (let k = 0; k < values.length; k++) {
                if (values[k].toLowerCase().includes(this._query.toLowerCase().trim())) {
                    match = true
                    break
                }
            }

            if (match) {
                result.push(recipes[i])
            }
        }
        return result
    }

    filterbyTags() {

        const entries = Object.entries(this.selectedTags)

        if (entries.length === 0 && !this._query) {
            this._filteredSearch = []
            return
        }

        const recipes = this.filterByInput()

        const result = []

        for (let i = 0; i < recipes.length; i++) {
            let match = true

            const tags = {
                appliance: recipes[i].appliance,
                ustensils: recipes[i].ustensils,
                ingredients: []
            }

            const { ingredients } = recipes[i]

            for (let j = 0; j < ingredients.length; j++) {
                tags.ingredients.push(ingredients[j].ingredient)
            }

            for (let k = 0; k < entries.length; k++) {
                const [key, value] = entries[k]

                for (let v = 0; v < value.length; v++) {
                    const isExist = tags[key].indexOf(value[v])
                    if (isExist === -1) {
                        match = false
                        break
                    }
                }
            }

            if (match) {
                result.push(recipes[i])
            }
        }


        this._filteredSearch = result
    }


    onInput() {

        this.$mainSearch.addEventListener('input', (e) => {
            const { value } = e.target
            if (value.length < 3) {
                this._query = ""
            } else {
                this._query = value
            }
            this.filter()

        })
    }

    notify() {
        this.subscribers.forEach(element => element.update())
    }

    subscribe(element) {
        this.subscribers.push(element)
    }


    initialize(data) {
        this._initialState = data
        this.saveTags()
    }

    saveTags() {
        const recipes = this.currentState

        this._tags["ingredients"] = this.getIngredients(recipes)
        this._tags["ustensils"] = this.getUstensils(recipes)
        this._tags["appliance"] = this.getAppliance(recipes)
    }

    getIngredients(recipes) {
        return recipes.reduce((ingredientsArr, current) => {
            if (!ingredientsArr) ingredientsArr = []
            current.ingredients.forEach(recipe => {
                const isExist = ingredientsArr.findIndex(element => element.toLowerCase() === recipe.ingredient.toLowerCase())
                if (isExist === -1) {
                    ingredientsArr.push(recipe.ingredient)
                }
            })
            return ingredientsArr
        }, [])
    }

    getUstensils(recipes) {
        return recipes.reduce((ustensilsArr, current) => {
            if (!ustensilsArr) ustensilsArr = []
            current.ustensils.forEach(recipe => {
                const isExist = ustensilsArr.findIndex(element => element.toLowerCase() === recipe.toLowerCase())
                if (isExist === -1) {
                    ustensilsArr.push(recipe)
                }
            })
            return ustensilsArr
        }, [])
    }

    getAppliance(recipes) {
        return recipes.reduce((applianceArr, current) => {
            if (!applianceArr) applianceArr = []
            const isExist = applianceArr.findIndex(element => element.toLowerCase() === current.appliance.toLowerCase())
            if (isExist === -1) {
                applianceArr.push(current.appliance)
            }
            return applianceArr
        }, [])
    }


    removeTag({ id, tag }) {
        this.selectedTags[id.toLowerCase()] = this.selectedTags[id.toLowerCase()].filter(element => element !== tag)
        if (!this.selectedTags[id.toLowerCase()].length) {
            delete this.selectedTags[id.toLowerCase()]
        }
    }

    addTag({ id, tag }) {
        if (this.selectedTags.hasOwnProperty(id.toLowerCase())) {
            this.selectedTags[id.toLowerCase()].push(tag)
        } else {
            this.selectedTags[id.toLowerCase()] = [tag]
        }
    }

    get currentState() {
        return !this._query && !this.filteredSearch.length ? [...this.initialState] : [...this.filteredSearch]
    }

    get tags() {
        return this._tags
    }

    get selectedTags() {
        return this._selectedTags
    }

    get initialState() {
        return this._initialState
    }

    get filteredSearch() {
        return this._filteredSearch
    }
}