import { Recipe } from "../models/recipe.js"

class FetchData {
    constructor(url) {
        this._url = url
    }

    async get() {
        try {
            const data = await fetch(this._url)
            const response = await data.json()
            return response
        } catch (err) {
            console.error(err)
        }
    }
}


export class FetchRecipes extends FetchData {
    constructor(url) {
        super(url)
        this._recipes = []
        this._ingredients = []
        this._appliance = []
        this._ustensils = []
        this._filteredRecipes = []
    }

    async init() {
        this._recipes = await this.get()
    }

    displayRecipe($recipesWrapper = '') {
        if (!$recipesWrapper) {
            this.$recipesWrapper.innerHTML = ''
        } else {
            this.$recipesWrapper = $recipesWrapper
        }
        const recipes = [...this.recipes].map(recipe => new Recipe(recipe))
        recipes.forEach(recipe => {
            this.$recipesWrapper.appendChild(recipe.createCard())
        })
    }

    set recipes(recipe) {
        this._recipes = recipe
    }

    get recipes() {
        return this._recipes
    }

    get appliance() {
        this._appliance = [...this._recipes].reduce((prev, curr) => {
            if (!prev) prev = []
            const isExist = prev.findIndex(element => element.toLowerCase() === curr.appliance.toLowerCase())
            if (isExist === -1) {
                prev.push(curr.appliance)
            }

            return prev
        }, [])
        return this._appliance
    }

    get ingredients() {
        this._ingredients = [...this._recipes].reduce((prev, curr) => {
            if (!prev) prev = []
            curr.ingredients.forEach(recipe => {
                const isExist = prev.findIndex(element => element.toLowerCase() === recipe.ingredient.toLowerCase())
                if (isExist === -1) {
                    prev.push(recipe.ingredient)
                }
            })
            return prev
        }, [])
        return this._ingredients
    }

    get ustensils() {
        this._ustensils = [...this._recipes].reduce((prev, curr) => {
            if (!prev) prev = []
            curr.ustensils.forEach(recipe => {
                const isExist = prev.findIndex(element => element.toLowerCase() === recipe.toLowerCase())
                if (isExist === -1) {
                    prev.push(recipe)
                }
            })
            return prev
        }, [])
        return this._ustensils
    }
}