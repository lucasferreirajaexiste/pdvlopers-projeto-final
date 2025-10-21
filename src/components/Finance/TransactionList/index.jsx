import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styles from "./TransactionList.module.css";

function agruparTransacoes(dados) {
    const agrupado = {};

    dados.forEach((t) => {
        const data = new Date(t.date);
        const month = data.toLocaleString("pt-BR", { month: "short" }); // Jan, Fev, etc
        const key = `${data.getMonth()}-${data.getFullYear()}`;
        const monthLabel = `${month}/${data.getFullYear()}`;

        if (!agrupado[key]) {
            agrupado[key] = { monthLabel, entrada: 0, saida: 0 };
        }

        if (t.type === "entrada") {
            agrupado[key].entrada += Math.abs(t.amount);
        } else if (t.type === "saida") {
            agrupado[key].saida += Math.abs(t.amount);
        }
    });

    return Object.values(agrupado).sort((a, b) => {
        const [mesA, anoA] = a.monthLabel.split("/").map(v => isNaN(v) ? 0 : Number(v));
        const [mesB, anoB] = b.monthLabel.split("/").map(v => isNaN(v) ? 0 : Number(v));
        return anoA === anoB ? mesA - mesB : anoA - anoB;
    });
}

function filtrarTransacoes(transacoes, meses) {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    return transacoes.filter((t) => {
        const data = new Date(t.date);
        const diffMeses = (anoAtual - data.getFullYear()) * 12 + (mesAtual - data.getMonth());
        return diffMeses >= 0 && diffMeses < meses;
    });
}

export function TransactionList({ periodo, setPeriodo, transactions }) {
    const dadosFiltrados = filtrarTransacoes(transactions, periodo);
    const dadosAgrupados = agruparTransacoes(dadosFiltrados);

    return (
        <div className={styles.chartContainer}>
            <div className={styles.graphic}>
                <ResponsiveContainer width="80%" height={300}>
                    <BarChart data={dadosAgrupados}>
                        <XAxis dataKey="monthLabel" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="entrada" fill="green" />
                        <Bar dataKey="saida" fill="red" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className={styles.buttons}>
                <button className={styles.button} onClick={() => setPeriodo(1)}>1 Mês</button>
                <button className={styles.button} onClick={() => setPeriodo(3)}>3 Meses</button>
                <button className={styles.button} onClick={() => setPeriodo(6)}>6 Meses</button>
                <button className={styles.button} onClick={() => setPeriodo(12)}>12 Meses</button>
            </div>
        </div>
    );
}