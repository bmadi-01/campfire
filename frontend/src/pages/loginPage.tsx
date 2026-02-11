import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/loginPage.module.css";

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const validatePassword = (value: string) => {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        return passwordRegex.test(value);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        let valid = true;

        // EMAIL
        if (!validateEmail(email)) {
            setEmailError("Adresse email invalide.");
            valid = false;
        } else {
            setEmailError("");
        }

        // PASSWORD
        if (!validatePassword(password)) {
            setPasswordError(
                "Mot de passe : 8 caractères min, majuscule, minuscule, chiffre et caractère spécial."
            );
            valid = false;
        } else {
            setPasswordError("");
        }

        if (!valid) return;

        try {
            const response = await fetch("http://localhost:4000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    mot_de_passe: password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setPasswordError(data.error || "Erreur de connexion.");
                return;
            }

            // Stockage du token
            localStorage.setItem("token", data.token);

            // Stockage des infos utilisateur
            localStorage.setItem("utilisateur", JSON.stringify(data.utilisateur));

            // Redirection vers dashboard
            navigate("/dashboard");

        } catch (error) {
            console.error("Erreur login :", error);
        }

        // 🔥 Simulation login OK
        console.log("Connexion validée");
        navigate("/home");
    };

    return (
        <div className={styles.pageBackground}>
            <div className={styles.overlay}></div>

            <div className={styles.loginCard}>
                <div
                    className={styles.closeButton}
                    onClick={() => navigate("/home")}
                >
                    ✕
                </div>
                <h2>Connexion 🔥</h2>

                <form onSubmit={handleLogin} noValidate>
                    <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="exemple@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={emailError ? styles.inputError : ""}
                        />
                        {emailError && (
                            <span className={styles.errorText}>{emailError}</span>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={passwordError ? styles.inputError : ""}
                        />
                        {passwordError && (
                            <span className={styles.errorText}>{passwordError}</span>
                        )}
                    </div>

                    <button type="submit" className={styles.loginButton}>
                        Se connecter
                    </button>
                    <p className={styles.registerText}>
                        Pas encore de compte ?{" "}
                        <span onClick={() => navigate("/register")}>
                            S'inscrire </span> </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
