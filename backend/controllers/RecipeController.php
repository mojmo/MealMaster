<?php
require_once __DIR__ . '/../services/RecipeService.php';

class RecipeController {
    private $recipeService;

    public function __construct() {
        $this->recipeService = new RecipeService();
    }

    public function createRecipe($recipe) {
        $result = $this->recipeService->createRecipe($recipe);
        return ["success" => $result];
    }

    public function updateRecipe($id, $recipe) {
        $result = $this->recipeService->updateRecipe($id, $recipe);
        return ["success" => $result];
    }

    public function deleteRecipe($id) {
        $result = $this->recipeService->deleteRecipe($id);
        return ["success" => $result];
    }

    public function getRecipes() {
        $recipes = $this->recipeService->getRecipes();
        return ["success" => true, "recipes" => $recipes];
    }

    public function getRecipe($id) {
        $recipe = $this->recipeService->getRecipe($id);
        return ["success" => true, "recipe" => $recipe];
    }
}
?>
