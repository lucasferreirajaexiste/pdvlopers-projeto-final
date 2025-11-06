import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import styles from "./Layout.module.css";

export function Layout({ children }) {
	return (
		<div className={styles.layout}>
			<Sidebar />
			<div className={styles.contentWrapper}>
				<Header />
				<main className={styles.main}>{children}</main>
			</div>
		</div>
	);
}

