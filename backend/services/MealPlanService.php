<?php
class MealPlanService {
    private $mealPlanModel;

    public function __construct($mealPlanModel) {
        $this->mealPlanModel = $mealPlanModel;
    }

    // Logic to create a meal plan
    public function createMealPlan($data) {
        return $this->mealPlanModel->create($data); // Call model to handle database operations
    }

    // Logic to get meal plans for a user
    public function getMealPlans($userId) {
        return $this->mealPlanModel->getByUserId($userId); // Call model to handle database operations
    }

    // Logic to update a meal plan
    public function updateMealPlan($id, $data) {
        return $this->mealPlanModel->update($id, $data); // Call model to handle database operations
    }

    // Logic to delete a meal plan
    public function deleteMealPlan($id) {
        return $this->mealPlanModel->delete($id); // Call model to handle database operations
    }
}
?>
