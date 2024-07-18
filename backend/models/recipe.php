<?php
require_once __DIR__ . '/../config/database.php';

class Recipe {
    private $conn;
    private $table_name = "recipes";
    public $name;
    public $ingredients;
    public $instructions;
    public $user_id;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function createRecipe($recipe) {
        $query = "INSERT INTO $this->table_name SET name=:name, ingredients=:ingredients, instructions=:instructions, user_id=:user_id";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($recipe['name']));
        $this->ingredients = htmlspecialchars(strip_tags($recipe['ingredients']));
        $this->instructions = htmlspecialchars(strip_tags($recipe['instructions']));
        $this->user_id = htmlspecialchars(strip_tags($recipe['user_id']));


        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":ingredients", $this->ingredients);
        $stmt->bindParam(":instructions", $this->instructions);
        $stmt->bindParam(":user_id", $this->user_id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        }

        echo $stmt->errorInfo();
        return false;
    }

    public function updateRecipe($id, $recipe) {
        $query = "UPDATE $this->table_name SET name=:name, ingredients=:ingredients, instructions=:instructions WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($recipe['name']));
        $this->ingredients = htmlspecialchars(strip_tags($recipe['ingredients']));
        $this->instructions = htmlspecialchars(strip_tags($recipe['instructions']));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":ingredients", $this->ingredients);
        $stmt->bindParam(":instructions", $this->instructions);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        }

        echo $stmt->errorInfo();
        return false;
    }

    public function deleteRecipe($id) {
        $query = "DELETE FROM $this->table_name WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        }

        echo $stmt->errorInfo();
        return false;
    }


    public function getRecipes() {

        $query = "SELECT * FROM $this->table_name";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
        
    }

    public function getRecipe($id) {

        $query = "SELECT * FROM $this->table_name WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getRecipeByUserId($id) {
        $query = "SELECT * FROM $this->table_name WHERE user_id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
