<?php

require_once __DIR__ . '/../services/MealPlanService.php'; // Adjust the path as per your project structure
require_once  __DIR__ . '/../config/database.php';
require_once  __DIR__ . '/../models/MealPlan.php';
require_once  __DIR__ . '/../models/MealPlanRecipe.php';
require_once  __DIR__ . '/../models/recipe.php';

class MealPlanController {
    private $db;
    private $mealPlanModel;
    private $mealPlanRecipeModel;
    private $recipeModel;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->mealPlanModel = new MealPlan($this->db);
        $this->mealPlanRecipeModel = new MealPlanRecipe($this->db);
        $this->recipeModel = new Recipe($this->db);
    }

    public function createMealPlan($data) {
        $this->mealPlanModel->user_id = $data['user_id'];
        $this->mealPlanModel->name = $data['name'];
    
        if ($this->mealPlanModel->createMealPlan($data)) {
            // Get user's recipes
            $recipes = $this->recipeModel->getRecipeByUserId($this->mealPlanModel->user_id);
    
            if (count($recipes) == 0) {
                // If user has no recipes, select random recipes
                $recipes = $this->recipeModel->getRecipes();
            }
    
            // Shuffle and pick 3 random recipes
            shuffle($recipes);
            $selectedRecipes = array_slice($recipes, 0, 3);
    
            // Assign each recipe to a specific meal
            $meals = ['breakfast', 'lunch', 'dinner'];
            $mealPlanRecipes = [];
    
            foreach ($selectedRecipes as $index => $recipe) {
                $this->mealPlanRecipeModel->meal_plan_id = $this->mealPlanModel->id;
                $this->mealPlanRecipeModel->recipe_id = $recipe['id'];
                $this->mealPlanRecipeModel->addRecipeToMealPlan();
    
                $mealPlanRecipes[] = [
                    'recipe_id' => $recipe['id'],
                    'meal' => $meals[$index]
                ];
            }
    
            return [
                'success' => true,
                'message' => 'Meal plan created successfuly',
                'meal_plans' => [
                    [
                        'id' => $this->mealPlanModel->id,
                        'user_id' => $this->mealPlanModel->user_id,
                        'name' => $this->mealPlanModel->name,
                        'created_at' => $this->mealPlanModel->created_at,
                        'recipes' => $mealPlanRecipes
                    ]
                ]
            ];
        } else {
            return ['success' => false, 'message' => 'Failed to create meal plan'];
        }
    }


    public function updateMealPlan($id, $data) {
        $this->mealPlanModel->id = $id;
        $this->mealPlanModel->name = $data['name'];

        if ($this->mealPlanModel->updateMealPlan($id, $data)) {
            return ['success' => true, 'message' => 'Meal plan updated successfuly'];
        } else {
            return ['success' => false, 'message' => 'Failed to update meal plan'];
        }
    }

    public function deleteMealPlan($id) {
        $this->mealPlanModel->id = $id;
        $this->mealPlanRecipeModel->meal_plan_id = $id;

        if ($this->mealPlanRecipeModel->removeRecipesFromMealPlan() && $this->mealPlanModel->deleteMealPlan($id)) {
            return ['success' => true, 'message' => 'Meal plan deleted successfuly'];
        } else {
            return ['success' => false, 'message' => 'Failed to delete meal plan'];
        }
    }

    public function getMealPlansByUser($user_id) {
        $mealPlans = $this->mealPlanModel->getMealPlanByUserId($user_id);
        // $mealPlans = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($mealPlans as &$mealPlan) {
            $mealPlanRecipes = $this->mealPlanRecipeModel->getRecipesByMealPlan($mealPlan['id']);
            $mealPlan['recipes'] = $mealPlanRecipes->fetchAll(PDO::FETCH_ASSOC);
        }

        return ['success' => true, 'meal_plans' => $mealPlans];
    }
}

?>
