<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="style.css?v=2">
</head>

<body>

    <?php include 'nav.php'; ?>
    <div class="site-container">
        <div id="login-box">
            <h1>Login</h1>

            <form action="login_submit.php" method="post">
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
                <button type="submit">Login</button>
            </form>
        </div>
    </div>

</body>

</html>