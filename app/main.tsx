import { createRoot } from "react-dom/client";
import Home from "./page";
import "../offline/page.css";

createRoot(document.getElementById("root")!).render(<Home />);
