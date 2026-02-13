import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarConnecte from "../components/navBarConnecte.tsx";
import "../css/profile.css";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [identites, setIdentites] = useState<any[]>([]);
    const [editing, setEditing] = useState(false);

    const [prenom, setPrenom] = useState("");
    const [pseudo, setPseudo] = useState("");
    const [email, setEmail] = useState("");
    const [actif, setActif] = useState(true);

    const [ancienPassword, setAncienPassword] = useState("");
    const [nouveauPassword, setNouveauPassword] = useState("");

    const [newIdentite, setNewIdentite] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const validateEmail = (value: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    };

    const validatePassword = (value: string) => {
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        return regex.test(value);
    };


    const [avatar, setAvatar] = useState(
        localStorage.getItem("avatar") || "avatar1.png"
    );

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("utilisateur");

        if (!token || !storedUser) {
            navigate("/login");
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setPrenom(parsedUser.prenom);
        setPseudo(parsedUser.pseudo);
        setEmail(parsedUser.email);
    }, []);

    // 🔥 MODIFICATION PROFIL
    const updateProfile = async () => {
        const token = localStorage.getItem("token");

        if (!validateEmail(email)) {
            setEmailError("Adresse email invalide.");
            return;
        } else {
            setEmailError("");
        }

        const response = await fetch(
            "http://localhost:4000/utilisateurs/me",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    prenom,
                    pseudo,
                    email,
                    actif,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }

        localStorage.setItem(
            "utilisateur",
            JSON.stringify({ ...user, prenom, pseudo, email })
        );

        alert("Profil mis à jour 🔥");
        setEditing(false);
    };

    // 🔐 MODIFICATION MOT DE PASSE
    const updatePassword = async () => {
        const token = localStorage.getItem("token");

        if (!validatePassword(nouveauPassword)) {
            setPasswordError(
                "8 caractères minimum, majuscule, minuscule, chiffre et caractère spécial."
            );
            return;
        } else {
            setPasswordError("");
        }

        const response = await fetch(
            "http://localhost:4000/utilisateurs/me/password",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ancien_mot_de_passe: ancienPassword,
                    nouveau_mot_de_passe: nouveauPassword,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }

        alert("Mot de passe modifié 🔐");
        setAncienPassword("");
        setNouveauPassword("");
    };

    // 👤 CRÉATION IDENTITÉ
    const createIdentite = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:4000/identites",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nom: newIdentite,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }

        setIdentites([...identites, data.identite]);
        setNewIdentite("");
    };

    if (!user) return null;

    return (
        <>
            <NavBarConnecte />

            <div className="profileContainer">

                <div className="profileCard">

                    <h2>Mon Profil 🔥</h2>

                    {/* AVATAR */}
                    <div className="avatarSection">
                        <img
                            src={`/avatars/${avatar}`}
                            alt="avatar"
                            className="avatarImage"
                        />

                        <div className="avatarChoices">
                            {["avatar1.png", "avatar2.png", "avatar3.png"].map((img) => (
                                <img
                                    key={img}
                                    src={`/avatars/${img}`}
                                    alt={img}
                                    onClick={() => {
                                        setAvatar(img);
                                        localStorage.setItem("avatar", img);
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* INFOS */}
                    <div className="profileInfo">
                        <label>Prénom</label>
                        <input
                            value={prenom}
                            disabled={!editing}
                            onChange={(e) => setPrenom(e.target.value)}
                        />

                        <label>Pseudo</label>
                        <input
                            value={pseudo}
                            disabled={!editing}
                            onChange={(e) => setPseudo(e.target.value)}
                        />

                        <label>Email</label>
                        <input
                            value={email}
                            disabled={!editing}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <span className="errorText">{emailError}</span>}


                        <label>
                            Actif
                            <input
                                type="checkbox"
                                checked={actif}
                                disabled={!editing}
                                onChange={() => setActif(!actif)}
                            />
                        </label>

                        {editing ? (
                            <button onClick={updateProfile}>
                                Sauvegarder
                            </button>
                        ) : (
                            <button onClick={() => setEditing(true)}>
                                Modifier
                            </button>
                        )}
                    </div>

                    {/* MOT DE PASSE */}
                    <div className="passwordSection">
                        <h3>Modifier mot de passe</h3>

                        <input
                            type="password"
                            placeholder="Ancien mot de passe"
                            value={ancienPassword}
                            onChange={(e) => setAncienPassword(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Nouveau mot de passe"
                            value={nouveauPassword}
                            onChange={(e) => setNouveauPassword(e.target.value)}
                        />
                        {passwordError && (
                            <span className="errorText">{passwordError}</span>
                        )}


                        <button onClick={updatePassword}>
                            Modifier mot de passe
                        </button>
                    </div>

                    {/* IDENTITÉS */}
                    <div className="identiteSection">
                        <h3>Mes Identités</h3>

                        {identites.map((id, index) => (
                            <p key={index}>{id.nom}</p>
                        ))}

                        <input
                            placeholder="Nouvelle identité"
                            value={newIdentite}
                            onChange={(e) => setNewIdentite(e.target.value)}
                        />

                        <button onClick={createIdentite}>
                            Créer identité
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Profile;
