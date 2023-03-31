import { FetchRecipes } from "./api/fetchData.js";
import { Dropdown } from "./models/dropdown.js";

class App {

    constructor() {
        this.recipesApi = new FetchRecipes("./src/data/recipes.json")
        this.$recipesWrapper = document.querySelector('.recipes-container')
    }

    async main() {
        const recipes = await this.recipesApi.getRecipes()
        recipes.forEach(recipe => {
            this.$recipesWrapper.appendChild(recipe.createCard())
        })

        const $dropdownWrapper = document.querySelector('.dropdowns-container')

        const { ingredients, ustensils, appliance } = this.recipesApi
        const ddIngredients = new Dropdown({
            data: ingredients,
            wrapper: $dropdownWrapper,
            placeholder: "Ingredients"
        })
        const ddAppliance = new Dropdown({
            data: appliance,
            wrapper: $dropdownWrapper,
            placeholder: "Appareils",
            class: "ddAppliance"
        })
        const ddUstensils = new Dropdown({
            data: ustensils,
            wrapper: $dropdownWrapper,
            placeholder: "Ustensils",
            class: "ddUstensils"
        }).create()

        ddIngredients.create()
        //ddUstensils.create()
        ddAppliance.create()

    }

}

const app = new App()
app.main()