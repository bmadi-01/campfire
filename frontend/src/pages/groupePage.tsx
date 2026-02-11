//import { motion } from "framer-motion";
import NavBar from "../components/navBar.tsx";
import "../css/global.css";

function GroupePage(){
    return (
        <>
            <NavBar />
            <div className="pageBackground">
                <h1>Bienvenue sur Campfire</h1>
            </div>
        </>
    )
}
export default GroupePage;