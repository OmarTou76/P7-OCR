export class Search {
    constructor(app) {
        this._initialState = []
        this.app = app
        this._filteredSearch = []

        this._tags = []
        this._selectedTags = []

        this.subscribers = []

        this._query = ""

        this.$mainSearch = document.getElementById('mainSearch')
        this.onInput()
    }


    update() {
        this.filterbyTags()

        const data = this.filteredSearch.length ? this.filteredSearch : this.initialState

        this.app.displayRecipe(data)

        this.saveTags()
        this.notify()
    }

    filterbyTags() {

        const recipes = this._query ? [...this._filteredSearch] : [...this._initialState]

        const entries = Object.entries(this.selectedTags)

        if (entries?.length === 0) {
            this._filteredSearch = []
            return
        }

        this._filteredSearch = recipes.filter(recipe => {
            let match = true

            const tags = {
                ingredients: recipe.ingredients.reduce((ingredients, curr) => {
                    if (!ingredients) {
                        ingredients = []
                    }
                    ingredients.push(curr.ingredient)
                    return ingredients
                }, []),
                appliance: recipe.appliance,
                ustensils: recipe.ustensils
            }

            entries.forEach(([key, value]) => {
                value.forEach(v => {
                    const isExist = tags[key].indexOf(v)
                    if (isExist === -1) {
                        match = false
                        return
                    }
                })
            })
            return match
        })
    }


    onInput() {

        this.$mainSearch.addEventListener('input', (e) => {
            const { value } = e.target
            this._query = value
            this.filterByInput()
            if (this.tags.length) {
                this.filterbyTags()
            }
            this.app.displayRecipe(this._filteredSearch)
            this.saveTags()

            this.notify()
        })
    }

    notify() {
        this.subscribers.forEach(element => element.update())
    }

    subscribe(element) {
        this.subscribers.push(element)
    }

    filterByInput() {
        this._filteredSearch = [...this.initialState].filter(el => {
            let match = false
            const values = [el.name, el.description]

            el.ingredients.forEach(i => values.push(i.ingredient))

            values.forEach(v => {
                if (v.toLowerCase().includes(this._query.toLowerCase())) {
                    match = true
                    return
                }
            })
            return match
        })
    }

    initialize(data) {
        this._initialState = data
        this.saveTags()
    }

    saveTags() {
        const recipes = this._filteredSearch?.length ? [...this._filteredSearch] : [...this._initialState]

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
        this._selectedTags[id.toLowerCase()] = this._selectedTags[id.toLowerCase()].filter(element => element !== tag)
        if (!this._selectedTags[id.toLowerCase()].length) {
            delete this._selectedTags[id.toLowerCase()]
        }
    }

    addTag({ id, tag }) {
        if (this.selectedTags.hasOwnProperty(id.toLowerCase())) {
            this._selectedTags[id.toLowerCase()].push(tag)
        } else {
            this._selectedTags[id.toLowerCase()] = [tag]
        }
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