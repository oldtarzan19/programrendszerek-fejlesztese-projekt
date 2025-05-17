# fake-twitter

## Előfeltételek

- Git
- Node.js 
- npm
- MongoDB (fut a `localhost:27017` porton)
- (opcionálisan) Angular CLI (`npm install -g @angular/cli`)

## Telepítés és indítás

1. **Projekt klónozása**  
   ```bash
   git clone <repo-url>
   cd fake-twitter-app
    ```

2. **Backend**

   ```bash
   cd backend
   npm install

   # Adatbázis feltöltése mintaadatokkal
   npm run seed

   # Szerver indítása
   npm run dev
   ```

   A backend a `http://localhost:5000` címen fut.

3. **Frontend**

   ```bash
   cd ../frontend
   npm install

   # (Ha van globális Angular CLI:)
   ng serve

   # Ha nincs Angular CLI:
   npm start
   ```

   A frontend a `http://localhost:4200` címen érhető el, és adatokat továbbít a 5000-es port felé.

## Bejelentkezési adatok

| Szerepkör        | E-mail                                                  | Jelszó   |
| ---------------- | ------------------------------------------------------- | -------- |
| Admin            | [admin@fake-twitter.com](mailto:admin@fake-twitter.com) | admin123 |
| Tesztfelhasználó | [user1@fake-twitter.com](mailto:user1@fake-twitter.com) | user123  |

## Projekt felépítése

```
fake-twitter-app/
├── backend/     
│   ├── src/
│   ├── package.json
│   └── …
└── frontend/    
    ├── src/
    ├── angular.json
    └── …
```
