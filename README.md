## Architecture

```mermaid
flowchart LR
    U[Utilisateur] -->|Navigateur| F[Frontend<br/>Next.js · React]
    F -->|API REST<br/>/images| B[Backend<br/>NestJS]
    B -->|Métadonnées des images| DB[(PostgreSQL<br/>TypeORM)]
    B -->|Fichiers image<br/>API compatible S3| S[S3 Bucket]
    F -.->|Affichage des images| S
```

Le backend reçoit les images, en extrait les dimensions avec Sharp, stocke les fichiers dans MinIO et conserve leurs métadonnées dans PostgreSQL.

## Stack technique

- **Frontend :** Next.js 16, TypeScript, Tailwind CSS
- **Backend :** NestJS
- **Données :** PostgreSQL et TypeORM
- **Fichiers :** MinIO Locale, compatible avec l’API Amazon S3
- **Outils :** Bun et Docker Compose

## Démarrage local

Prérequis : Docker et Docker Compose.

```bash
docker compose up
```

- Frontend : [http://localhost:3001](http://localhost:3001)
- API : [http://localhost:3000](http://localhost:3000)
- Console MinIO : [http://localhost:9001](http://localhost:9001)

Docker Compose démarre le frontend, le backend, PostgreSQL et MinIO. Les données de PostgreSQL et de MinIO sont conservées dans des volumes Docker.