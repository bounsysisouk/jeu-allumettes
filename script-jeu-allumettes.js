//----PARAMETRE DU JEU-----//
let totalAllumettes = 50;
const MIN_PRENDRE = 1;
const MAX_PRENDRE = 6;     // choix maximum configuré à 6

//---GESTION DS MODES ET JOUEUR---//
let modeOrdinateur = false; // VRAI si vs Ordi, FAUX si Multijoueur
let nombreDeJoueurs = 2; // Utilisé en mode Multijoueur
let joueurActif = 1;     // 1 pour joueur 1 ( humain ) 2 pour joueur 2 ou Ordi

//----ELEMENT HTML---//
const zoneAllumettes = document.getElementById("zone-allumettes");
const messageTexte = document.getElementById("message");
const btnRejouer = document.getElementById("btn-rejouer");
const boutonsAction = document.querySelectorAll(".actions-grid button:not(#btn-rejouer)");
const compteurAllumettes = document.getElementById("compteur-allumettes");
const listeTours = document.getElementById("liste-tours");

//---FONCTION DE CONFIGURATION AU LANCEMENT DE LA PAGE---//
function configurerPartie() {
    let choixMode = prompt("Choisissez le mode de jeu :\n1. contre JORDInateur 🤖 :\n2. Multijoueur 👥", "1");
    if (choixMode === "1") {
        modeOrdinateur = true;
        nombreDeJoueurs = 2
    } else {
        modeOrdinateur = false;
        let saisie;
        do {
            saisie = prompt("combien de joueurs participent ? (minimum 2)", "2");
            nombreDeJoueurs = parseInt(saisie, 10);
        } while (isNaN(nombreDeJoueurs) || nombreDeJoueurs < 2);
    }
    reinitialiserJeu();
}
//----DESSINER LES ALLUMETTES A L'ECRAN----//
function afficherAllumettes() {
    zoneAllumettes.innerHTML = "";
    compteurAllumettes.textContent = totalAllumettes;
    for (let i = 0; i < totalAllumettes; i++) {
        const divAllumette = document.createElement("div");
        divAllumette.classList.add("allumette");
        zoneAllumettes.appendChild(divAllumette);
    }
}

//--ACTIVER OU DESACTIVER LES BOUTONS DE 1 À 6 SELON LE CONTEXTE--//
function verifierBoutonDisponible() {
    boutonsAction.forEach((bouton, index) => {
        const valeurBouton = index + 1;
        if (valeurBouton > totalAllumettes) {
            bouton.disabled = true;
        } else {
            bouton.disabled = false;
        }
    });
}
//--DESATIVER COMPLETEMENT TOUS LES BOUTONS PENDANT LE TOUR DE JORDI--//
function forcerDestivationBoutons(statut) {
    boutonsAction.forEach(bouton => bouton.disabled = statut);
}
//--TOUR DU JOUEUR HUMAINS (click sur le boutons)--//
function jouerTour(allumettesPrise) {
    if (allumettesPrise > totalAllumettes)
        return;

    //----Retrait des allumettes----//
    totalAllumettes -= allumettesPrise;
    afficherAllumettes();

    // nombre d'allumette retirer par tour //
    const tour = document.createElement("li");
    tour.textContent = `Joueur ${joueurActif} a pris ${allumettesPrise} allumette(s)`;
    listeTours.appendChild(tour);

    //---Verification de victoire--//
    if (totalAllumettes === 0) {
        if (modeOrdinateur) {
            finDePartie("🎉 Felication! Vous avez pris la derniere allumettes... Vous avez GAGNEZ contre JORDInateur! 🤖")
        } else {
            finDePartie(`🎊 Super! Le joueur ${joueurActif} a pris la dernière allumette et GAGNE la partie`);
        }
        return;
    }
    //---Changement de tour---//
    if (modeOrdinateur) {
        joueurActif = 2; // C'est le tour de JORDInateur
        messageTexte.innerHTML = " 🤖 JORDInateur reflechit...";
        forcerDestivationBoutons(true);
        setTimeout(tourOrdinateur, 1000); // JORDInateur joue après 1 seconde
    } else {
        //---Mode Multijoueur classic---//
        joueurActif = joueurActif + 1;
        if (joueurActif > nombreDeJoueurs) {
            joueurActif = 1;
        }
        messageTexte.innerHTML = `👥 Joueur ${joueurActif}, c'est à vous !`;
        verifierBoutonDisponible();

    }
}
//---LOGIQUE DE L'ORDINATEUR----//
function tourOrdinateur() {
    // La strategie pour laisser un multiple de 7 a l'adversaire (MAX_PRENDRE = 1) //
    let choixOrdinateur = totalAllumettes  % (MAX_PRENDRE + 1);
    // Si le total restant est déàa un multiple de 7 ne prend que 1 allumette //    
    if (choixOrdinateur === 0) {
        choixOrdinateur = MIN_PRENDRE;
    }
    // Applique le choix de l'ordinateur //
    totalAllumettes -= choixOrdinateur;
    afficherAllumettes();
    // nombre d'allumette retirer par tour //
    const tour = document.createElement("li");
    tour.textContent = `JORDInateur a pris ${choixOrdinateur} allumette(s)`;
    listeTours.appendChild(tour);
    //---Verification de vitoire de l'ordinateur
    if (totalAllumettes === 0) {
        finDePartie("💀 JORDInateur a pris la dernière allumettes... JORDInateur GAGNE ! 🤖")
        return;
    }
    // Redonner la main au joueur //
    joueurActif = 1;
    messageTexte.innerHTML = "👤 C'est a votre tour !";
    forcerDestivationBoutons(false);
    verifierBoutonDisponible()
}
//----FIN DE PARTIE----//
function finDePartie(message) {
    messageTexte.innerHTML = message;
    forcerDestivationBoutons(true);
    btnRejouer.classList.remove("cache");
}
//----RELANCER UNE NOUVELLE PARTIE---//
function reinitialiserJeu() {
    totalAllumettes = 50;
    joueurActif = 1;
    messageTexte.innerHTML = modeOrdinateur ? "👤 C'est à votre tour !🎮" : `👤 Joueur ${joueurActif}, c'est à vous !`;
    listeTours.innerHTML = "";
    btnRejouer.classList.add("cache");
    forcerDestivationBoutons(false);
    afficherAllumettes();
    verifierBoutonDisponible();
}
// Lancement automatique du script //
configurerPartie();
boutonsAction.forEach((bouton, index) => {
    bouton.addEventListener("click", () => {
        jouerTour(index + 1);
    });
});

btnRejouer.addEventListener("click", reinitialiserJeu);
