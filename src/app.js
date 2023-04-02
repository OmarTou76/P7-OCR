import { FetchRecipes } from "./api/fetchData.js";
import { Filter } from "./filter/Filter_V1.js";
import { Dropdown } from "./models/dropdown.js";
import { Recipe } from "./models/recipe.js";

class App {

    constructor() {
        this.recipesApi = new FetchRecipes("./src/data/recipes.json")
        this.$recipesWrapper = document.querySelector('.recipes-container')
        this.selectedTags = []
    }

    async main() {
        await this.recipesApi.init()
        this.recipesApi.displayRecipe(this.$recipesWrapper)

        const $dropdownWrapper = document.querySelector('.dropdowns-container')

        const { ingredients, ustensils, appliance } = this.recipesApi

        const dropdowns = [new Dropdown({
            data: ingredients,
            wrapper: $dropdownWrapper,
            section: "Ingredients",
            class: "ddIngredients"
        }, this.selectedTags),
        new Dropdown({
            data: appliance,
            wrapper: $dropdownWrapper,
            section: "Appareils",
            class: "ddAppliance"
        }, this.selectedTags),
        new Dropdown({
            data: ustensils,
            wrapper: $dropdownWrapper,
            section: "Ustensils",
            class: "ddUstensils"
        }, this.selectedTags)]
        dropdowns.forEach(dd => dd.create())
        this.filter = new Filter(this.recipesApi, dropdowns)
    }

}

const app = new App()
app.main()