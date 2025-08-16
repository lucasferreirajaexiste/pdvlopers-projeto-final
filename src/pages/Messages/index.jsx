import styles from "./messages.module.css";

import { Tabs } from "../../components/Finance/Tabs";
import { Header } from "../../components/Finance/Header";
import { TabContent } from "../../components/Finance/TabContent";
import { MessageContent } from "../../components/Messages/MessageContent";
import { SendMessages } from "../../components/Messages/SendMessages";

import { FiMessageCircle } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { BirthdayItem } from "../../components/Messages/BirthdayItem";


export function Messages() {
    const buttons = [
        { id: 'mensagens', label: "Enviar mensagens" },
        { id: 'aniversariantes', label: "Aniversariantes" },
        { id: 'historico', label: "Histórico" },
    ]

    const contents = {
        mensagens: (
            <div className={styles.cardsWrapper}>
                <TabContent title="Envio por email" subtitle="Envie promoções e newsletters por email">
                    <MessageContent icon={<MdOutlineEmail />} text="Crie campanhas de email personalizadas" >
                        <SendMessages text="Criar Email" />
                    </MessageContent>
                </TabContent>

                <TabContent title="Envio por WhatsApp" subtitle="Envie mensagens diretas via WhatsApp">
                    <MessageContent icon={<FiMessageCircle />} text="Envie mensagens instantâneas para seus clientes" >
                        <SendMessages text="Criar Mensagem" />
                    </MessageContent>
                </TabContent>

            </div>
        ),

        aniversariantes: (
            <TabContent title="Aniversariantes do Mês" subtitle="Clientes que fazem aniversário este mês">
                <BirthdayItem />
            </TabContent>
        ),

        historico: (
            <TabContent title="Histórico de Envios" subtitle="Campanhas e mensagens enviadas">

            </TabContent>
        ),
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Header
                    title="Mensagens"
                    subtitle="Envie promoções e mensagens para seus clientes"
                />
            </div>

            <div className={styles.tabs}>
                <Tabs buttons={buttons} contents={contents} />
                <Tabs contents={contents.contents} />
            </div>
        </div>
    );
}
