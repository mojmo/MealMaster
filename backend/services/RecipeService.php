<?php
require_once __DIR__ . '/../models/recipe.php';
require_once __DIR__ . '/../config/database.php';

class RecipeService {
    private $recipeModel;
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->recipeModel = new Recipe($this->db);
    }

    public function createRecipe($recipe) {
        return $this->recipeModel->createRecipe($recipe);
    }

    public function updateRecipe($id, $recipe) {
        return $this->recipeModel->updateRecipe($id, $recipe);
    }

    public function deleteRecipe($id) {
        return $this->recipeModel->deleteRecipe($id);
    }

    public function getRecipes() {
        return $this->recipeModel->getRecipes();
    }

    public function getRecipe($id) {
        return $this->recipeModel->getRecipe($id);
    }
}
?>
