import { useEffect, useState } from "react"
import { initializeApp } from "firebase/app";
import Navbar from "./components/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, query, getDocs, collection, where } from "firebase/firestore";
import {json} from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";

const {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} = require("@remix-run/react");

export async function loader() {
  return json({
    ENV: {
      API_KEY: process.env.API_KEY,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      PROJECT_ID: process.env.PROJECT_ID,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
      APP_ID: process.env.APP_ID
    },
  });
}

export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css",
    },
  ];
};

export const meta = () => ({
  charset: "utf-8",
  title: "Remix App - Demo Shop",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const [isAuth, setIsAuth] = useState(null);
  const [user, setUser] = useState(null);

  const {ENV} = useLoaderData();

  const firebaseConfig = {
    apiKey: ENV.API_KEY,
    authDomain: ENV.AUTH_DOMAIN,
    projectId: ENV.PROJECT_ID,
    storageBucket: ENV.STORAGE_BUCKET,
    messagingSenderId: ENV.MESSAGING_SENDER_ID,
    appId: ENV.APP_ID
  };
  const app = initializeApp(firebaseConfig);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setIsAuth(!!user);

      if (user) {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
         setUser({id: doc.id, ...doc.data()})
       });
      }
    });
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="container py-3">
          <Navbar isAuth={isAuth} isAdmin={user?.isAdmin} />
          <Outlet context={{isAuth}} />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </div>
      </body>
    </html>
  );
}
