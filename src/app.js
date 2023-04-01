import { FetchRecipes } from "./api/fetchData.js";
import { Dropdown } from "./models/dropdown.js";

class App {

    constructor() {
        this.recipesApi = new FetchRecipes("./src/data/recipes.json")
        this.$recipesWrapper = document.querySelector('.recipes-container')

        this.selectedTags = []
    }

    async main() {
        const recipes = await this.recipesApi.getRecipes()
        recipes.forEach(recipe => {
            this.$recipesWrapper.appendChild(recipe.createCard())
        })

        const $dropdownWrapper = document.querySelector('.dropdowns-container')

        const { ingredients, ustensils, appliance } = this.recipesApi

        new Dropdown({
            data: ingredients,
            wrapper: $dropdownWrapper,
            section: "Ingredients",
            class: "ddIngredients"
        }, this.selectedTags).create()
        new Dropdown({
            data: appliance,
            wrapper: $dropdownWrapper,
            section: "Appareils",
            class: "ddAppliance"
        }, this.selectedTags).create()
        new Dropdown({
            data: ustensils,
            wrapper: $dropdownWrapper,
            section: "Ustensils",
            class: "ddUstensils"
        }, this.selectedTags).create()

    }

}

const app = new App()
app.main()