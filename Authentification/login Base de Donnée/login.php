<html>

<head>
    <title>Login</title>
    <meta http-equiv=Location content=http://index.html/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <!-- Allez sur le lien https://www.dev-sandbox.ovh/caf/Authentification/ pour la base de données -->
    <?php
error_reporting(E_ALL);
// on récupère les champs de la requête POST
        $username = (isset($_POST['username']))? $_POST['username'] : null;
        $password = (isset($_POST['password']))? $_POST['password'] : null;
// on cherche dans la bdd
        if($username && $password)
        {
            $user = null;
            $conn = new mysqli("51.159.27.252:50992", "caf", "Fenelon@2022", "caf");
            if(!$conn->connect_error)
            {
                $result = $conn->query("SELECT * FROM comptes where `User`='$username' and `Password`='$password'");
                echo("SELECT * FROM connection where `User`='$username' and `Password`='$password'");
                if($result && $result->num_rows)
                {
                    $rows = $result->fetch_row();
                    $user = $rows[0];
                    $result->close();
                }
                $conn->close();          
            }
            else echo("erreur de requeste $conn->error");
        }
        // die("no $username and $password... $user");    
        if($user>0) 
        {
            header("Location: https://www.dev-sandbox.ovh/caf/Authentification/login_Base_de_Donnée/");
            exit;
        }
        else 
        {
            header('Location: https://www.dev-sandbox.ovh/caf/Accueil/');
            exit;
        }
    ?>
    <h1 id="heading1">Bienvenue à la Caisse d'Allocations Familiales </h1>
    <img src="images\caf.png" alt="Login Logo" style="width:100px; height:100px;">
    <div>
        <form method="POST" action="./login.php" class="myForm" name="myForm">
            <div class="input-container">
                <i class="fa fa-envelope icon"></i>
                <input type="text" name="username" placeholder="Numéro d'assuré" required/>
            </div>
            <div class="input-container">
                <i class="fa fa-key icon"></i>
                <input type="password" name="password" placeholder="Mot de passe " required/>
            </div>
            <div><input type="submit" value="Se connecter" class="bttn"></div>
        </form>
    </div>
</body>

</html>