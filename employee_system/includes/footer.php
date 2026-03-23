<?php 
$is_login_page = (basename($_SERVER['PHP_SELF']) === 'login.php');
if(!$is_login_page && isset($_SESSION['user_id'])): 
?>
    </div> <!-- end .maincontent -->
</div> <!-- end .main -->
<?php elseif($is_login_page): ?>
</div> <!-- end .login-wrapper -->
<?php else: ?>
    </div> <!-- end .maincontent -->
</div> <!-- end .main -->
<?php endif; ?>

<script src="/employee_system/assets/js/main.js"></script>
</body>
</html>
