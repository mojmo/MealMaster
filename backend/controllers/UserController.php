<?php
require_once __DIR__ . '/../models/user.php';
require_once __DIR__ . '/../config/database.php';

class UserController {
    private $db;
    private $user;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
    }

    public function readUser() {
        $data = file_get_contents("php://input");
        $data = json_decode($data);

        // Log the received data for debugging
        file_put_contents('php://stderr', print_r($data, TRUE));

        if ($data === null || !isset($data->username)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid input data."]);
            return;
        }

        $this->user->username = $data->username;
        $stmt = $this->user->read();

        $user_data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user_data) {
            echo json_encode([
                "success" => true,
                "data" => $user_data
            ]);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "User not found."]);
        }
    }

    public function getUser($id) {
        return $this->user->getUser($id);
    }

    public function updateUser($id, $data) {
        return $this->user->updateUser($id, $data);
    }
}
?>