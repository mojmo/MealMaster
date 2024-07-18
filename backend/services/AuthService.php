<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/user.php';

class AuthService {
    private $db;
    private $user;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
    }

    public function register($username, $email, $password) {
        $this->user->username = $username;
        $this->user->email = $email;
        $this->user->password = $password;

        if ($this->user->create()) {
            return json_encode(["success" => true, "message" => "User registered successfully."]);
        } else {
            return json_encode(["success" => false, "message" => "User registration failed."]);
        }
    }

    public function login($username, $password) {
        $this->user->username = $username;
        $stmt = $this->user->read();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (password_verify($password, $row['password'])) {
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['username'] = $username;
                return json_encode(["success" => true, "message" => "Login successful.", "user_id" => $row['id']]);
            } else {
                return json_encode(["success" => false, "message" => "Incorrect password."]);
            }
        } else {
            return json_encode(["success" => false, "message" => "Login failed."]);
        }
    }

    public function logout() {
        session_unset();
        session_destroy();
        return json_encode(["success" => true, "message" => "Logged out successfully."]);
    }

    public function isAuthenticated() {
        return isset($_SESSION['user_id']);
    }

    public function getCurrentUserId() {
        return $_SESSION['user_id'];
    }

}
?>
