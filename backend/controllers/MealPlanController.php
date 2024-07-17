<?php
class MealPlanController {
    private $mealPlanService;

    public function __construct($mealPlanService) {
        $this->mealPlanService = $mealPlanService;
    }

    // Handles creating a new meal plan
    public function createMealPlan($request) {
        $data = $request->getParsedBody(); // Get data from the request
        $response = $this->mealPlanService->createMealPlan($data); // Call service to handle business logic
        return json_encode($response); // Return response in JSON format
    }

    // Handles retrieving meal plans for a user
    public function getMealPlans($request) {
        $userId = $request->getQueryParams()['userId']; // Get user ID from query parameters
        $response = $this->mealPlanService->getMealPlans($userId); // Call service to handle business logic
        return json_encode($response); // Return response in JSON format
    }

    // Handles updating an existing meal plan
    public function updateMealPlan($request, $id) {
        $data = $request->getParsedBody(); // Get data from the request
        $response = $this->mealPlanService->updateMealPlan($id, $data); // Call service to handle business logic
        return json_encode($response); // Return response in JSON format
    }

    // Handles deleting a meal plan
    public function deleteMealPlan($request, $id) {
        $response = $this->mealPlanService->deleteMealPlan($id); // Call service to handle business logic
        return json_encode($response); // Return response in JSON format
    }
}

