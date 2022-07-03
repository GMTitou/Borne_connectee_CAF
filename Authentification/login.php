<?php
// on récupère les champs de la requête POST
    $username = (isset($_POST['username']))? $_POST['username'] : null;
    $password = (isset($_POST['password']))? $_POST['password'] : null;
// on cherche dans la bdd
    if($username && $password)
    {
        $user = null;
        $conn = new mysqli(
            "51.159.27.252:50992",          // addresse du serveur MySQL
            "caf",                          // nom d'utilisateur MySQL
            "Fenelon@2022",                 // Mot de passe MySQL
            "caf");                         // Base de données
        if(!$conn->connect_error)           // s'il n'y a aucune erreur de connexion
        {
            // on cherche dans la table "comptes" le nom d'utilisateur et le mot de passe envoyés 
            $result = $conn->query("SELECT * FROM `comptes` where `User`='$username' and `Password`='$password'");
            if($result && $result->num_rows)    // si on a trouvé quelque chose
            {
                $rows = $result->fetch_row();   // on récupère la première ligne
                $user = $rows[0];               // l'Identifiant utilisateur est dans la première case
                $result->close();               // on ferme les résultats
            }
            $conn->close();                     // on ferme les conneions
        }
    }
    if($user>0)                                  // si un identifiant utilisateur est trouvé 
    {                                           // on charge la page "AssistantVocal/index.html"
        header("Location: https://www.dev-sandbox.ovh/caf/Accueil/index.html");
        exit;
    }                                            
    else                                        // sinon
    {                                           // on revient à la page d'accueil
        header('Location: https://www.dev-sandbox.ovh/caf/Authentification/index.html');
        exit;
    }
?>