import { motion } from "framer-motion";

interface Props {
    onOpen: () => void;
    GroupCount?: number;
}

function GroupsCard({ onOpen, GroupCount = 0 }: Props) {
    const count = Number(GroupCount) || 0;
    return (
        <motion.div
            className="dashboardCard"
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.4 }}
            // whileHover={{ scale: 1.02 }}
        >
            <h3>👥 Mes Groupes</h3>

            <p>
                {count > 0
                    ? `${count} groupe${count > 1 ? "s" : ""} actif${count > 1 ? "s" : ""}`
                    : "Aucun groupe n'est actif pour le moment."}
            </p>

            <button onClick={onOpen}>
                Voir groupes
            </button>
        </motion.div>
    );
}

export default GroupsCard;
