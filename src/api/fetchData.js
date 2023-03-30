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
    }

    async getRecipes() {
        this._recipes = await this.get()
        return this._recipes.map(recipe => new Recipe(recipe))
    }


    get recipes() {
        return this._recipes
    }

    get appliance() {
        if (this._appliance.length === 0) {
            this._appliance = [...this._recipes].reduce((prev, curr) => {
                if (!prev) {
                    prev = []
                }
                const isExist = prev.findIndex(element => element.toLowerCase() === curr.appliance)
                if (isExist === -1) {
                    prev.push(curr.appliance)
                }
                return prev
            })
        }
        return this._appliance
    }

    get ingredients() {
        if (this._ingredients.length === 0) {
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
        }
        return this._ingredients
    }

    get ustensils() {
        if (this._ustensils.length === 0) {
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
        }
        return this._ustensils
    }
}