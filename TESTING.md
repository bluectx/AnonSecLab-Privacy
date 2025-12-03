# Guide de test des nouvelles fonctionnalités

## Démarrage rapide

### Mode Web (recommandé pour tester rapidement)

```bash
npm run dev
```

Ouvre l'application dans le navigateur avec hot-reload.

### Mode Desktop (pour tester les notifications et fonctionnalités natives)

```bash
npm run electron:dev
```

Lance l'application Electron avec toutes les fonctionnalités desktop.

## Tests des nouvelles fonctionnalités

### 1. Export/Import de configurations

**Test Export :**
1. Sélectionne quelques scripts dans l'interface
2. Clique sur le bouton "Export Config" (icône flèche vers le bas)
3. Vérifie que le fichier JSON est téléchargé/ouvert
4. Vérifie le contenu : version, OS, liste des scripts avec leurs IDs

**Test Import :**
1. Clique sur "Import Config" (icône dossier ouvert)
2. Sélectionne un fichier JSON exporté précédemment
3. Vérifie que les scripts sont automatiquement sélectionnés
4. Vérifie que les scripts "revert" sont correctement marqués

### 2. Mode Preview

1. Sélectionne plusieurs scripts
2. Clique sur le bouton "Preview" (icône info)
3. Vérifie que la dialog s'ouvre avec :
   - Nombre de scripts sélectionnés
   - Nombre de scripts à revert
   - Liste des scripts avec badges "Revert"
   - Code généré complet

### 3. Notifications

**Test notifications succès :**
1. Sélectionne des scripts
2. Clique sur "Run"
3. Vérifie qu'une notification système apparaît : "Script executed successfully"

**Test notifications erreur :**
1. Force une erreur d'exécution (script invalide, permissions, etc.)
2. Vérifie qu'une notification d'erreur critique apparaît

### 4. Profils prédéfinis

1. Va dans le menu "Profiles" (dans le menu des scripts)
2. Vérifie que les profils disponibles s'affichent selon l'OS :
   - Windows : Basic Privacy, Advanced Privacy
   - macOS : Basic Privacy, Advanced Privacy
   - Linux : Basic Privacy, Advanced Privacy
3. Clique sur un profil
4. Vérifie que les scripts correspondants sont sélectionnés

### 5. Dashboard de statistiques

1. Clique sur le bouton "Statistics" dans le footer
2. Vérifie que la dialog s'ouvre avec :
   - Total Scripts
   - Selected Scripts
   - Categories
   - Reverted Scripts
   - Breakdown par niveau (Standard/Strict)

### 6. Badges README

1. Ouvre le README.md
2. Vérifie que les badges s'affichent :
   - Views Counter
   - GitHub Downloads
   - Version
   - License
   - CI/CD
   - Maintained
   - Last commit

## Tests automatisés

### Tests unitaires

```bash
npm run test:unit
```

### Tests d'intégration

```bash
npm run test:integration
```

### Vérification du linting

```bash
npm run lint
```

### Vérification TypeScript

```bash
npx vue-tsc --noEmit
```

## Tests de build

### Build web

```bash
npm run build
npm run preview
```

### Build desktop

```bash
npm run electron:prebuild
npm run electron:build:linux  # ou :win, :mac
```

## Checklist de test

- [ ] Export de configuration fonctionne
- [ ] Import de configuration fonctionne
- [ ] Preview affiche correctement les changements
- [ ] Notifications apparaissent (succès et erreur)
- [ ] Profils s'appliquent correctement
- [ ] Dashboard affiche les bonnes statistiques
- [ ] Badges README s'affichent
- [ ] Pas d'erreurs dans la console
- [ ] Application compile sans erreurs
- [ ] Tests unitaires passent

