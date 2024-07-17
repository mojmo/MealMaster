<?php

require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/RecipeController.php';
require_once __DIR__ . '/../controllers/UserController.php';

$authController = new AuthController();
$recipeController = new RecipeController();
$userController = new UserController();

$requestMethod = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

if ($uri[4] !== 'api') {
    header("HTTP/1.1 404 Not Found");
    exit();
}

switch ($uri[5]) {
    case 'auth':
        if ($uri[6] === 'register' && $requestMethod == 'POST') {
            $authController->register();
        } elseif ($uri[6] === 'login' && $requestMethod == 'POST') {
            $authController->login();
        } elseif ($uri[6] === 'logout' && $requestMethod == 'POST') {
            if ($authController->isAuthenticated()) {
                $authController->logout();
            } else {
                http_response_code(401);
                echo json_encode(["success" => false, "message" => "Unauthorized."]);
            }
        } elseif ($uri[6] === 'check' && $requestMethod == 'GET') {
            $authController->checkAuth();
        }
        break;
    case'recipes':
        if (!$authController->isAuthenticated()) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Unauthorized."]);
            exit();
        }
        if ($requestMethod == 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            echo json_encode($recipeController->createRecipe($data));
        } elseif ($requestMethod == 'GET') {
            if (isset($uri[6]) && is_numeric($uri[6])) {
                $id = intval($uri[6]);
                echo json_encode($recipeController->getRecipe($id));
            } else {
                echo json_encode($recipeController->getRecipes());
            }
        } elseif ($requestMethod == 'PUT') {
            $id = $uri[6];
            $data = json_decode(file_get_contents('php://input'), true);
            echo json_encode($recipeController->updateRecipe($id, $data));
        } elseif ($requestMethod == 'DELETE') {
            $id = $uri[6];
            echo json_encode($recipeController->deleteRecipe($id));
        }
        break;
    case 'users':
        if (!$authController->isAuthenticated()) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Unauthorized."]);
            exit();
        }
        if ($requestMethod == 'GET' && isset($uri[6]) && is_numeric($uri[6])) {
            $id = intval($uri[6]);
            echo json_encode($userController->getUser($id));
        } elseif ($requestMethod == 'PUT' && isset($uri[6]) && is_numeric($uri[6])) {
            $id = intval($uri[6]);
            $data = json_decode(file_get_contents('php://input'), true);
            echo json_encode($userController->updateUser($id, $data));
        }
        break;
    default:
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Endpoint not found."]);
        break;
}

?>