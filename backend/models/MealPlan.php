<?php
require_once __DIR__ . '/../config/database.php';

class MealPlan {
    private $conn;
    private $table_name = "meal_plans";
    public $name;
    public $description;
    public $user_id;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function createMealPlan($mealPlan) {
        $query = "INSERT INTO $this->table_name SET name=:name, description=:description, user_id=:user_id";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($mealPlan['name']));
        $this->description = htmlspecialchars(strip_tags($mealPlan['description']));
        $this->user_id = htmlspecialchars(strip_tags($mealPlan['user_id']));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":user_id", $this->user_id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        }

        echo $stmt->errorInfo();
        return false;
    }

    public function updateMealPlan($id, $mealPlan) {
        $query = "UPDATE $this->table_name SET name=:name, description=:description WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($mealPlan['name']));
        $this->description = htmlspecialchars(strip_tags($mealPlan['description']));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        }

        echo $stmt->errorInfo();
        return false;
    }

    public function deleteMealPlan($id) {
        $query = "DELETE FROM $this->table_name WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        }

        echo $stmt->errorInfo();
        return false;
    }

    public function getMealPlans() {
        $query = "SELECT * FROM $this->table_name";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getMealPlan($id) {
        $query = "SELECT * FROM $this->table_name WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
