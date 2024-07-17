<?php
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $username;
    public $password;
    public $email;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO $this->table_name SET username=:username, password=:password, email=:email";
        $stmt = $this->conn->prepare($query);

        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->email = htmlspecialchars(strip_tags($this->email));

        $hashedPassword = password_hash($this->password, PASSWORD_BCRYPT);

        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":password", $hashedPassword);
        $stmt->bindParam(":email", $this->email);

        if ($stmt->execute()) {
            return true;
        }

        echo $stmt->errorInfo();
        return false;
    }

    public function read() {
        $query = "SELECT * FROM  $this->table_name WHERE username = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(1, $this->username);
        $stmt->execute();

        return $stmt;
    }

    public function getUser($id) {
        $query = "SELECT id, username, email FROM $this->table_name WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            return [
                'id' => $row['id'],
                'username' => $row['username'],
                'email' => $row['email']
            ];
        } else {
            return null;
        }
    }

    public function updateUser($id, $data) {
        $query = "UPDATE " . $this->table_name . " SET username = :username, email = :email WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':username', $data['username']);
        $stmt->bindParam(':email', $data['email']);

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Update successed.'];
        } else {
            return ['success' => false, 'message' => 'Update failed.'];
        }
    }
}
?>
