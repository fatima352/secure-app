import fs from 'fs'
import https from 'https'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import publicRouter from './routes/public.js'
import { ensureAdmin } from '../db/initAdmin.js'
import usersRouter from './routes/users.js'
import authRouter from './routes/auth.js'
import { verifyToken } from './middleware/token-management.js'
import { requireAdmin } from './middleware/auth-admin.js'
import 'dotenv/config'


// Création de l’application Express
const app = express()

// Configuration CORS : autoriser le front Angular en HTTPS local
app.use(
	cors({
		origin: 'https://localhost:8080',
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization']
	})
)

// Ajout manuel des principaux en-têtes HTTP de sécurité
app.use((req, res, next) => {
	// Empêche le navigateur d’interpréter un fichier d’un autre type MIME -> attaque : XSS via upload malveillant
	res.setHeader('X-Content-Type-Options', 'nosniff')

	// Interdit l'intégration du site dans des iframes externes -> attaque : Clickjacking
	res.setHeader('X-Frame-Options', 'SAMEORIGIN')

	// Évite que les URL avec paramètres sensibles apparaissent dans les en-têtes "Referer" -> attaque : Token ou paramètres dans l’URL
	res.setHeader('Referrer-Policy', 'no-referrer')

	// Politique de ressources : seules les ressources du même site peuvent être chargées -> attaque : Fuite de données statiques
	res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')

	// Politique d'ouverture inter-origine (Empêche le partage de contexte entre onglets) -> attaque : de type Spectre - isolation des fenêtres
	res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')

	// Politique d'intégration inter-origine (empêche les inclusions non sûres : force l’isolation complète des ressources intégrées) -> Attaques par chargement de scripts
	res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')

	next()
})

await ensureAdmin()

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())


// Routes d'API
app.use('/api/auth', authRouter)
app.use('/api/users', verifyToken, usersRouter) // protégé
app.use('/api/admin', verifyToken, requireAdmin, (req, res) => {
	res.json({ message: 'Bienvenue admin' })
})

// Routes publiques
app.use('/api/public', publicRouter)

// Chargement du certificat et clé générés par mkcert (étape 0)
const key = fs.readFileSync('certs/localhost-key.pem')
const cert = fs.readFileSync('certs/localhost.pem')

// Lancement du serveur HTTPS
https.createServer({ key, cert }, app).listen(4000, () => {
	console.log('👍 Serveur API démarré sur https://localhost:4000')
})