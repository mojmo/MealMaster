<?php

class MealPlanRecipe {
    private $conn;
    private $table_name = "meal_plan_recipes";

    public $meal_plan_id;
    public $recipe_id;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function addRecipeToMealPlan() {
        $query = "INSERT INTO " . $this->table_name . " (meal_plan_id, recipe_id) VALUES (:meal_plan_id, :recipe_id)";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":meal_plan_id", $this->meal_plan_id);
        $stmt->bindParam(":recipe_id", $this->recipe_id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function removeRecipesFromMealPlan() {
        $query = "DELETE FROM " . $this->table_name . " WHERE meal_plan_id = :meal_plan_id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":meal_plan_id", $this->meal_plan_id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function getRecipesByMealPlan($meal_plan_id) {
        $query = "SELECT recipe_id FROM " . $this->table_name . " WHERE meal_plan_id = :meal_plan_id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":meal_plan_id", $meal_plan_id);
        $stmt->execute();

        return $stmt;
    }
}
?>
