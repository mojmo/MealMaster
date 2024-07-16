<?php
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$mealPlanController = new MealPlanController(new MealPlanService(new MealPlanModel()));

// Define API endpoint for creating a meal plan
$app->post('/meal-plans', [$mealPlanController, 'createMealPlan']);

// Define API endpoint for retrieving meal plans
$app->get('/meal-plans', [$mealPlanController, 'getMealPlans']);

// Define API endpoint for updating a meal plan
$app->put('/meal-plans/{id}', [$mealPlanController, 'updateMealPlan']);

// Define API endpoint for deleting a meal plan
$app->delete('/meal-plans/{id}', [$mealPlanController, 'deleteMealPlan']);

$app->run();
?>
