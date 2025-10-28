<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Register</title>
    <link rel="stylesheet" href="style.css?v=2">
</head>

<body>

    <?php include 'nav.php'; ?>

    <div class="site-container">
        <div id="login-box">

            <h1>Register</h1>

            <form action="register_submit.php" method="post">
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