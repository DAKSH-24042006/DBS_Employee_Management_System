<?php
require 'config/database.php';

$sql = file_get_contents('database/upgrade_v3.sql');

// Remove DELIMITER lines as they are for CLI
$sql = preg_replace('/DELIMITER \/\//', '', $sql);
$sql = preg_replace('/DELIMITER ;/', '', $sql);
$sql = str_replace('//', ';', $sql);

if ($conn->multi_query($sql)) {
    do {
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->next_result());
    echo "SQL upgrade successful.\n";
} else {
    echo "SQL upgrade failed: " . $conn->error . "\n";
}
?>
