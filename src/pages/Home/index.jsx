import { useState } from "react";
import { DollarSign, Users, Gift, TrendingUp, Star } from "lucide-react";
import styles from "./home.module.css";
import { Layout } from "../../components/Layout/Layout";

// Dados mockados
const mockData = {
	dailyBalance: 1250.75,
	monthlyBalance: 45000.5,
	totalBalance: 125000.0,
	topClients: [
		{ name: "Carlos Silva", points: 120 },
		{ name: "Mariana Souza", points: 110 },
		{ name: "Fernando Lima", points: 100 },
		{ name: "Patrícia Alves", points: 90 },
		{ name: "João Pedro", points: 80 },
	],
	activePromotions: [
		{ id: 1, title: "Desconto 10%", description: "Promoção válida até 20/08" },
		{ id: 2, title: "Compre 1 leve 2", description: "Promoção de verão" },
	],
	recentClients: [
		{ name: "Lucas Ferreira", date: "2025-08-10" },
		{ name: "Amanda Costa", date: "2025-08-09" },
		{ name: "Rafael Oliveira", date: "2025-08-08" },
	],
};

export function Home() {
	const [data] = useState(mockData);

	return (
		<Layout>
			<div className={styles.container}>
				<h1 className={styles.title}>Dashboard</h1>
				<p className={styles.subtitle}>Visão geral do seu negócio</p>

				<div className={styles.grid3}>
					<div className={styles.card}>
						<div className={styles.cardHeader}>
							<span>Saldo do Dia</span>
							<DollarSign />
						</div>
						<div className={styles.cardContent}>
							<p className={styles.cardAmount}>
								R${" "}
								{data.dailyBalance.toLocaleString("pt-BR", {
									minimumFractionDigits: 2,
								})}
							</p>
							<p className={styles.cardInfo}>+12% em relação a ontem</p>
						</div>
					</div>

					<div className={styles.card}>
						<div className={styles.cardHeader}>
							<span>Saldo do Mês</span>
							<TrendingUp />
						</div>
						<div className={styles.cardContent}>
							<p className={styles.cardAmount}>
								R${" "}
								{data.monthlyBalance.toLocaleString("pt-BR", {
									minimumFractionDigits: 2,
								})}
							</p>
							<p className={styles.cardInfo}>+8% em relação ao mês anterior</p>
						</div>
					</div>

					<div className={styles.card}>
						<div className={styles.cardHeader}>
							<span>Total Acumulado</span>
							<DollarSign />
						</div>
						<div className={styles.cardContent}>
							<p className={styles.cardAmount}>
								R${" "}
								{data.totalBalance.toLocaleString("pt-BR", {
									minimumFractionDigits: 2,
								})}
							</p>
							<p className={styles.cardInfo}>Desde o início das operações</p>
						</div>
					</div>
				</div>

				<div className={styles.grid2}>
					<div className={styles.card}>
						<div className={styles.cardHeader}>
							<Star /> Top 5 Clientes do Mês
						</div>
						<div className={styles.cardContent}>
							{data.topClients.map((client, index) => (
								<div key={client.name} className={styles.item}>
									<span>
										{index + 1}. {client.name}
									</span>
									<span>{client.points} pts</span>
								</div>
							))}
						</div>
					</div>

					<div className={styles.card}>
						<div className={styles.cardHeader}>
							<Gift /> Promoções Ativas
						</div>
						<div className={styles.cardContent}>
							{data.activePromotions.map((promo) => (
								<div key={promo.id} className={styles.item}>
									<strong>{promo.title}</strong>
									<p>{promo.description}</p>
									<span className={styles.badge}>Ativa</span>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className={styles.card}>
					<div className={styles.cardHeader}>
						<Users /> Últimos Clientes Cadastrados
					</div>
					<div className={styles.cardContent}>
						{data.recentClients.map((client) => (
							<div key={client.name} className={styles.item}>
								<span>{client.name}</span>
								<span>
									Cadastrado em{" "}
									{new Date(client.date).toLocaleDateString("pt-BR")}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</Layout>
	);
}
