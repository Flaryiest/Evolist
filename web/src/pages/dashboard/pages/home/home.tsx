import styles from "./home.module.css"
import Sidebar from "@dashboard/components/sidebar/sidebar.tsx";
export default function Home() {
    return <div id={styles.home}>
        <Sidebar />
        <div className={styles.content}>
            
        </div>
    </div>
}