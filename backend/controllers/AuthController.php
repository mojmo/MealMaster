<?php
require_once __DIR__ . '/../services/AuthService.php';

class AuthController {
    private $authService;

    public function __construct() {
        $this->authService = new AuthService();
    }

    public function register() {
        $data = file_get_contents("php://input");
        $data = json_decode($data);

        // Log the received data for debugging
        file_put_contents('php://stderr', print_r($data, TRUE));

        if ($data === null) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid input data."]);
            return;
        }

        echo $this->authService->register($data->username, $data->email, $data->password);
    }

    public function login() {
        $data = file_get_contents("php://input");
        $data = json_decode($data);

        // Log the received data for debugging
        file_put_contents('php://stderr', print_r($data, TRUE));

        if ($data === null || !isset($data->username) || !isset($data->password)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid input data.", "username" => $data->username, "password" => $data->password]);
            return;
        }

        echo $this->authService->login($data->username, $data->password);
    }

    public function logout() {
        echo $this->authService->logout();
    }

    public function isAuthenticated() {
        return $this->authService->isAuthenticated();
    }

    public function checkAuth() {
        if ($this->isAuthenticated()) {
            echo json_encode(["success" => true, "message" => "User is authenticated."]);
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "User is not authenticated."]);
        }
    }

    public function getCurrentUserId() {
        return $this->authService->getCurrentUserId();
    }

}
?>