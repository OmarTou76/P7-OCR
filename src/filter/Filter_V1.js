export class Filter {
    constructor(recipes, dropdowns) {
        this.recipesApi = recipes
        this.initialRecipe = [...recipes.recipes]
        this.dropdowns = dropdowns
        this.$mainSearch = document.getElementById('mainSearch')
        this.onInput()
    }

    onInput() {

        this.$mainSearch.addEventListener('input', (e) => {
            const { value } = e.target

            this.recipesApi.recipes = this.initialRecipe

            if (value.length > 2) {
                const result = this.filter(value)
                this.recipesApi.recipes = result
            }

            this.recipesApi.displayRecipe()
            const { ingredients, ustensils, appliance } = this.recipesApi
            this.dropdowns[0].update(ingredients)
            this.dropdowns[1].update(ustensils)
            this.dropdowns[2].update(appliance)
        })
    }



    filter(query) {
        const { recipes } = this.recipesApi
        const result = [...recipes].filter(el => {
            let match = false
            const values = [el.name, el.description]

            el.ingredients.forEach(i => values.push(i.ingredient))

            values.forEach(v => {
                if (v.toLowerCase().includes(query.toLowerCase())) {
                    match = true
                    return
                }
            })
            return match
        })
        return result
    }

}