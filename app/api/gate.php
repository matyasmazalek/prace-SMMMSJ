<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

$data = json_decode(file_get_contents("php://input"));

$server   = $data->server ?? "localhost";
$database = $data->database ?? "";
$username = $data->username ?? "";
$password = $data->password ?? "";
$sql      = $data->sql ?? "";

$conn = new mysqli($server, $username, $password, $database);

if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
  exit;
}

$result = $conn->query($sql);
$rows = [];

if ($result) {
  while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
  }
}

echo json_encode($rows);

$conn->close();
?>
