import styles from "./messages.module.css";

import { Tabs } from "../../components/Finance/Tabs";
import { Header } from "../../components/Finance/Header";
import { EmailContent } from "../../components/Messages/EmailContent";
import { WhatsAppContent } from "../../components/Messages/WhatsAppContent";
import { TabContent } from "../../components/Finance/TabContent";

export function Messages() {
    const buttons = [
        { id: 'mensagens', label: "Enviar mensagens" },
        { id: 'aniversariantes', label: "Aniversariantes" },
        { id: 'historico', label: "Histórico" },
    ]

    const contents = {
        mensagens: (
            <div className={styles.cardsWrapper}>
                <TabContent>
                    <EmailContent />
                </TabContent>
                <TabContent>
                    <WhatsAppContent />
                </TabContent>
            </div>
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
