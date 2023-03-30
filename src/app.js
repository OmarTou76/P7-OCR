import { FetchRecipes } from "./api/fetchData.js";

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
    }

}

const app = new App()
app.main()