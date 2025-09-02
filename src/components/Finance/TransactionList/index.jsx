import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './TransactionList.module.css'

const data = [
    { month: "Mar", entrada: 4000, saida: 2400 },
    { month: "Abr", entrada: 3000, saida: 1398 },
    { month: "Mai", entrada: 2000, saida: 9800 },
    { month: "Jun", entrada: 2780, saida: 3908 },
    { month: "Jul", entrada: 1890, saida: 4800 },
    { month: "Ago", entrada: 2390, saida: 3800 },
];

export function TransactionList() {
    return (
        <div className={styles.chartContainer}>
            <ResponsiveContainer>
                <BarChart data={data}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="entrada" fill="green" />
                    <Bar dataKey="saida" fill="red" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
