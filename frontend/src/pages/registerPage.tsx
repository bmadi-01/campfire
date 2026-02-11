import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../css/registerPage.module.css";

function RegisterPage() {
    const navigate = useNavigate();

    const [prenom, setPrenom] = useState("");
    const [pseudo, setPseudo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    /* ================= REDIRECTION AUTOMATIQUE ================= */

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                navigate("/home");
            }, 6000);

            return () => clearTimeout(timer);
        }
    }, [successMessage, navigate]);

    /* ================= VALIDATIONS ================= */

    const validateEmail = (value: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    const validatePassword = (value: string) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(value);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!prenom.trim()) {
            newErrors.prenom = "Le prénom est obligatoire.";
        }

        if (!pseudo.trim()) {
            newErrors.pseudo = "Le pseudo est obligatoire.";
        }

        if (!validateEmail(email)) {
            newErrors.email = "Adresse email invalide.";
        }

        if (!validatePassword(password)) {
            newErrors.password =
                "8 caractères min, majuscule, minuscule, chiffre et caractère spécial.";
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword =
                "Les mots de passe ne correspondent pas.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ================= SUBMIT ================= */

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;
        setIsSubmitting(true);

        const today = new Date().toISOString().split("T")[0];

        const userData = {
            prenom,
            pseudo,
            email,
            mot_de_passe: password,
            ip_cgu: "127.0.0.1", // ⚠️ le vrai IP doit être géré backend
            date_cgu: today,
        };

        try {
            const response = await fetch("http://localhost:4000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    setErrors((prev) => ({
                        ...prev,
                        email: data.error,
                    }));
                    return;
                }

                throw new Error(data.error || "Erreur inconnue.");
            }
            setSuccessMessage("Inscription réussie ! Redirection en cours...")

            console.log("Utilisateur enregistré :", userData);
            navigate("/login");

        } catch (error) {
            console.error(error);
        }setIsSubmitting(false);
    };

    return (
        <div className={styles.pageBackground}>
            <div className={styles.overlay}></div>

            <div className={styles.registerCard}>

                <div
                    className={styles.closeButton}
                    onClick={() => navigate("/home")}
                >
                    ✕
                </div>
                <h2>Inscription 🔥</h2>

                {successMessage && (
                    <div className={styles.successMessage}>
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleRegister} noValidate>

                    {/* PRENOM */}
                    <div className={styles.inputGroup}>
                        <label>Prénom</label>
                        <input
                            type="text"
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                            className={errors.prenom ? styles.inputError : ""}
                        />
                        {errors.prenom && <span className={styles.errorText}>{errors.prenom}</span>}
                    </div>

                    {/* PSEUDO */}
                    <div className={styles.inputGroup}>
                        <label>Pseudo</label>
                        <input
                            type="text"
                            value={pseudo}
                            onChange={(e) => setPseudo(e.target.value)}
                            className={errors.pseudo ? styles.inputError : ""}
                        />
                        {errors.pseudo && <span className={styles.errorText}>{errors.pseudo}</span>}
                    </div>

                    {/* EMAIL */}
                    <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={errors.email ? styles.inputError : ""}
                        />
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>

                    {/* PASSWORD */}
                    <div className={styles.inputGroup}>
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={errors.password ? styles.inputError : ""}
                        />
                        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className={styles.inputGroup}>
                        <label>Confirmer le mot de passe</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={errors.confirmPassword ? styles.inputError : ""}
                        />
                        {errors.confirmPassword && (
                            <span className={styles.errorText}>{errors.confirmPassword}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={styles.registerButton}
                        disabled={isSubmitting || successMessage !== ""}
                    >
                        {isSubmitting ? "Création..." : "Créer un compte"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
