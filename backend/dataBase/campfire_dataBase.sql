BEGIN;

CREATE TABLE IF NOT EXISTS role (
    id_role SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT
    );

CREATE TABLE IF NOT EXISTS groupe (
    id_groupe SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    date_creation DATE
    );

CREATE TABLE IF NOT EXISTS calendrier (
    id_calendrier SERIAL PRIMARY KEY,
    type_calendrier VARCHAR(255) NOT NULL
    );

CREATE TABLE IF NOT EXISTS level (
    id_level SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
    );

CREATE TABLE IF NOT EXISTS presence (
    id_presence SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    background VARCHAR(255) NOT NULL,
    foreground VARCHAR(255) NOT NULL
    );

CREATE TABLE IF NOT EXISTS utilisateur (
    id_utilisateur SERIAL PRIMARY KEY,
    prenom VARCHAR(255) NOT NULL,
    pseudo VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_creation DATE NOT NULL,
    actif BOOLEAN NOT NULL,
    ip_cgu VARCHAR(255) NOT NULL,
    date_cgu TIMESTAMP NOT NULL,
    cle_dfa VARCHAR(255) NOT NULL,
    id_role INTEGER NOT NULL,
    CONSTRAINT fk_utilisateur_role
    FOREIGN KEY (id_role) REFERENCES role(id_role)
    );

CREATE TABLE IF NOT EXISTS planning (
    id_planning SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    public BOOLEAN NOT NULL,
    date_ DATE NOT NULL,
    heure TIMESTAMP NOT NULL,
    id_calendrier INTEGER NOT NULL,
    id_utilisateur INTEGER NOT NULL,
    CONSTRAINT fk_planning_calendrier
    FOREIGN KEY (id_calendrier) REFERENCES calendrier(id_calendrier),
    CONSTRAINT fk_planning_utilisateur
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur)
    );

CREATE TABLE IF NOT EXISTS evenement (
    id_evenement SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    id_planning INTEGER NOT NULL,
    CONSTRAINT fk_evenement_planning
    FOREIGN KEY (id_planning) REFERENCES planning(id_planning)
    );

CREATE TABLE IF NOT EXISTS identite (
    id_identite SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    id_utilisateur INTEGER NOT NULL,
    CONSTRAINT fk_identite_utilisateur
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur)
    );

CREATE TABLE IF NOT EXISTS disponibilite (
    id_identite INTEGER,
    id_evenement INTEGER,
    id_presence INTEGER NOT NULL,
    PRIMARY KEY (id_identite, id_evenement),
    CONSTRAINT fk_dispo_identite
    FOREIGN KEY (id_identite) REFERENCES identite(id_identite),
    CONSTRAINT fk_dispo_evenement
    FOREIGN KEY (id_evenement) REFERENCES evenement(id_evenement),
    CONSTRAINT fk_dispo_presence
    FOREIGN KEY (id_presence) REFERENCES presence(id_presence)
    );

CREATE TABLE IF NOT EXISTS role_groupe (
    id_groupe INTEGER,
    id_identite INTEGER,
    id_level INTEGER NOT NULL,
    PRIMARY KEY (id_groupe, id_identite),
    CONSTRAINT fk_rg_groupe
    FOREIGN KEY (id_groupe) REFERENCES groupe(id_groupe),
    CONSTRAINT fk_rg_identite
    FOREIGN KEY (id_identite) REFERENCES identite(id_identite),
    CONSTRAINT fk_rg_level
    FOREIGN KEY (id_level) REFERENCES level(id_level)
    );

CREATE TABLE IF NOT EXISTS possede (
    id_groupe INTEGER,
    id_planning INTEGER,
    PRIMARY KEY (id_groupe, id_planning),
    CONSTRAINT fk_possede_groupe
    FOREIGN KEY (id_groupe) REFERENCES groupe(id_groupe),
    CONSTRAINT fk_possede_planning
    FOREIGN KEY (id_planning) REFERENCES planning(id_planning)
    );

COMMIT;
