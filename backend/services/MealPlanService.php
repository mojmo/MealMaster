<?php
require_once __DIR__ . '/../models/MealPlan.php';
require_once __DIR__ . '/../config/database.php';

class MealPlanService {
    private $mealPlanModel;
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->mealPlanModel = new MealPlan($this->db);
    }

    public function createMealPlan($mealPlan) {
        return $this->mealPlanModel->createMealPlan($mealPlan);
    }

    public function updateMealPlan($id, $mealPlan) {
        return $this->mealPlanModel->updateMealPlan($id, $mealPlan);
    }

    public function deleteMealPlan($id) {
        return $this->mealPlanModel->deleteMealPlan($id);
    }

    public function getMealPlans() {
        return $this->mealPlanModel->getMealPlans();
    }

    public function getMealPlan($id) {
        return $this->mealPlanModel->getMealPlan($id);
    }
}
?>