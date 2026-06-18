# SmartBazaar Deployment Guide (Vercel & Render)

This guide explains how to deploy your full-stack MERN application to production for free using **Vercel** (for the frontend) and **Render** (for the backend).

---

## 1. Deploying the Backend (Render)

Render is excellent for hosting Node.js Express APIs for free.

1. Go to [Render](https://render.com/) and sign up.
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository.
4. Set the following details:
   * **Name:** `smartbazaar-api`
   * **Root Directory:** `server`
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
5. Click **Advanced** and add the following Environment Variables (copy from `server/.env`):
   * `NODE_ENV` = `production`
   * `PORT` = `10000` (Render allocates this automatically)
   * `MONGO_URI` = `mongodb+srv://sahu:iftikhar@cluster0.n03zirp.mongodb.net/shopmern?retryWrites=true&w=majority`
   * `JWT_SECRET` = `your_secret_key`
   * `CLIENT_URL` = `https://your-vercel-domain.vercel.app` (Add this AFTER deploying Vercel frontend)
6. Click **Deploy Web Service**. Render will build and give you a live API URL (e.g., `https://smartbazaar-api.onrender.com`).

---

## 2. Deploying the Frontend (Vercel)

Vercel is the gold standard for React/Vite frontend hosting.

1. Go to [Vercel](https://vercel.com/) and sign up.
2. Click **Add New** ➔ **Project**.
3. Import your GitHub repository.
4. Configure the project settings:
   * **Root Directory:** `client` (Select edit and click `client` folder)
   * **Framework Preset:** `Vite`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
5. Expand **Environment Variables** and add:
   * `VITE_API_BASE_URL` = `https://smartbazaar-api.onrender.com/api/v1` (This must point to your Render live backend API URL!)
6. Click **Deploy**. Vercel will build and give you a live storefront URL (e.g., `https://smartbazaar.vercel.app`).

---

## 3. Post-Deployment Checklist

Once both are deployed:
1. Go back to Render's Environment Variables.
2. Update the `CLIENT_URL` to match your Vercel URL (e.g. `https://smartbazaar.vercel.app`).
3. Restart the Render Web Service to apply.
4. You are live!
