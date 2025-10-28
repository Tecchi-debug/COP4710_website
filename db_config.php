<?php
$servername = "localhost";
$username = "root";
$password = ""; // blank for XAMPP
$dbname = "users";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>