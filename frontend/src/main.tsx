import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import logo from "./app/assets/logo.png";

// set favicon dynamically
const setFavicon = (icon: string) => {
  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;

  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  link.href = icon;
};

setFavicon(logo);

createRoot(document.getElementById("root")!).render(<App />);