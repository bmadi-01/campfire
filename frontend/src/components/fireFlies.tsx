import { useMemo } from "react";
import styles from "../css/firFlies.module.css";

const FIREFLY_COUNT = 15;

function Fireflies() {
    const fireflies = useMemo(() => {
        return Array.from({ length: FIREFLY_COUNT }, (_, i) => i);
    }, []);

    return (
        <div className={styles.container}>
            {fireflies.map((id) => (
                <span key={id} className={styles.firefly}></span>
            ))}
        </div>
    );
}

export default Fireflies;
