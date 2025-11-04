<?php 
include '../database/db_config.php';

$message = '';
$toastclass = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $phone = $_POST['phone'];
    $role = $_POST['role'];

    // Check if email already exists
    $checkEmailStmt = $conn->prepare("SELECT email FROM users WHERE email = ?");
    $checkEmailStmt->bind_param("s", $email);
    $checkEmailStmt->execute();
    $checkEmailStmt->store_result();

    if ($checkEmailStmt->num_rows > 0) {
        $message = "Email ID already exists";
        $toastClass = "#007bff"; // Primary color
    } else {
        // Prepare and bind
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $name, $email, $password, $phone, $role);

        if ($stmt->execute()) {
            $message = "Account created successfully";
            $toastClass = "#28a745"; // Success color
        } else {
            $message = "Error: " . $stmt->error;
            $toastClass = "#dc3545"; // Danger color
        }

        $stmt->close();
    }

    $checkEmailStmt->close();
    $conn->close();

}?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel="stylesheet" href="style.css?v=2">
</head>

<body>

    <?php include 'nav.php'; ?>

    <div class="site-container">
        <div id="login-box">

            <h1>Register</h1>

            <form method="post">
                <label>
                    Name<br>
                    <input type="form_area" name="name" required>
                </label>
                <br>
                <label>
                    Email<br>
                    <input type="form_area" name="email" required>
                </label>
                <br>
                <label>
                    Password<br>
                    <input type="form_area" name="password" required>
                </label>
                <br>
                <label>
                    Phone<br>
                    <input type="form_area" name="phone" required>
                </label>
                <br>
                <label>
                    Role<br>
                    <input type="form_area" name="role" required>
                </label>
                <br>
                <button type="submit">Register</button>
            </form>
        </div>
    </div>

</body>

</html>