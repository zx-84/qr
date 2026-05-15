# QR-maker

QR-maker est une application web statique pour generer rapidement des QR codes utiles au quotidien. Elle fonctionne sans backend : la generation se fait dans le navigateur et les favoris restent dans `localStorage`.

## Fonctionnalites

- Generation de QR code depuis un lien ou un texte libre.
- Texte libre encode en texte simple, lisible et copiable par l'application de scan.
- Mode Wi-Fi avec SSID, mot de passe, securite WPA/WEP/aucune et reseau cache.
- Mode contact vCard avec nom, telephone, email, organisation, site et adresse.
- Modes email, telephone et SMS avec champs dedies.
- Mode WhatsApp avec numero et message pre-rempli, sans envoi automatique.
- Mode localisation ouvrant une carte depuis une adresse ou des coordonnees.
- Mode evenement calendrier au format iCalendar.
- Encarts dedies aux reseaux sociaux : Instagram, TikTok, LinkedIn, YouTube, Facebook et lien direct.
- Mode App Store / Play Store / lien universel.
- Mode media par lien public pour image, video, PDF ou fichier deja en ligne.
- Badges de clarification indiquant que Email, SMS et Tel n'envoient ou n'appellent rien automatiquement.
- Bouton Tester le lien pour ouvrir le contenu encode quand il s'agit d'un lien testable.
- Apercu clair de ce que le scan fera pour chaque type de QR code.
- Apercu du type de lien detecte, avec rappel pour les fichiers partages publiquement.
- Validations utiles pour email, telephone, WhatsApp, Wi-Fi, evenement, app store et media.
- Fenetre de styles QR avec de vraies vignettes generees : classique, arrondi, points, classy, affiche coloree, ocean, berry, neon, soft, encre et autres variantes.
- Import de style depuis une image locale ou un lien d'image, avec analyse des couleurs principales.
- Styles avec textures d'image dans les modules du QR : vagues, marbre, papier, mosaique et aurore.
- Reglage de douceur des modules pour styliser le rendu sans changer le contenu encode.
- Apercu instantane du QR code.
- Reglages de taille PNG, marge, couleur du QR, couleur de fond et correction d'erreur.
- Logos de base integrables au centre du QR code.
- Import d'un logo local ou chargement depuis une URL.
- Reglages de taille du logo, arrondi et fond blanc derriere le logo.
- Controle de lisibilite avec avertissements de contraste, marge et logo trop grand.
- Verification de scan dans le navigateur avec `jsQR` quand la librairie est disponible.
- Telechargement du QR code en PNG.
- Telechargement en SVG contenant le rendu actuel du QR code.
- Copie du QR code comme image quand le navigateur le supporte.
- Copie du contenu encode dans le presse-papiers.
- Zone Favoris en haut de page avec bouton Mettre en favoris, reprise, tri par fleches, copie QR et suppression.
- Recherche dans les favoris.
- Copie du contenu encode depuis chaque favori.
- Stockage local nettoye : seuls les favoris sont conserves.
- Menu de type de QR plus compact sur mobile.
- Bouton de reinitialisation du formulaire.
- Interface responsive desktop et mobile.

## Installation et utilisation

Aucune installation n'est necessaire.

1. Ouvrir `index.html` dans un navigateur moderne.
2. Choisir un type de QR code.
3. Remplir les champs utiles.
4. Ajuster les couleurs, la marge ou le logo si besoin.
5. Telecharger le PNG/SVG, copier le QR ou copier le contenu encode.

Pour tester avec un petit serveur local :

```bash
python -m http.server 8080
```

Puis ouvrir `http://localhost:8080`.

## Deploiement GitHub Pages

1. Pousser les fichiers `index.html`, `styles.css`, `app.js` et `README.md` dans un depot GitHub.
2. Dans GitHub, ouvrir `Settings` puis `Pages`.
3. Choisir la branche de publication, par exemple `main`, et le dossier racine `/`.
4. Enregistrer. GitHub Pages publiera l'application apres quelques instants.

## Captures d'ecran

Captures a ajouter plus tard :

- Vue desktop du generateur.
- Vue mobile.
- Mode Wi-Fi avec apercu QR.
- Mode contact vCard.
- Mode localisation.
- Mode evenement calendrier.
- Mode reseaux sociaux.
- Mode app mobile.
- Reglages QR et logo.
- Favoris locaux.

## Confidentialite

QR-maker ne necessite pas de backend et ne stocke rien en ligne. Les QR codes sont generes dans le navigateur. Les favoris sont conserves uniquement dans le stockage local du navigateur utilise.

Note : les logos importes depuis un fichier local sont inclus dans le PNG et les favoris locaux. Pour un logo charge via URL, le telechargement PNG/SVG ou la copie image peut etre bloque par le navigateur si le serveur distant ne permet pas l'utilisation cross-origin de l'image.
