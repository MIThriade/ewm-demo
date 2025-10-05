
# EWM Demo (Vite + React + TS)

**/ = Landing (HTML/CSS din mockup)**  
**/configurator = React TSX (din ewm-configurator-wow.tsx)**

## Rulare locală
```bash
npm install
npm run dev
```
Deschide: http://localhost:5173

## Deploy pe Vercel
1) Fă push proiectul într-un repo GitHub (ex: ewm-demo)  
2) Vercel → New Project → Import from GitHub → selectează repo  
3) Build automat (vite) → vei primi URL public.  
`vercel.json` se ocupă de fallback pentru ruta `/configurator`.

## APK (opțional, cu Capacitor)
```bash
npm i -D @capacitor/cli @capacitor/core
npx cap init ewmhome com.ewm.home
npx cap add android
npm run build && npx cap copy
npx cap open android   # Build .apk din Android Studio
```
