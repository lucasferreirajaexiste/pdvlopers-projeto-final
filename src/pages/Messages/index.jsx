import styles from "./messages.module.css";

import { Tabs } from "../../components/Finance/Tabs";
import { Header } from "../../components/Finance/Header";
import { TabContent } from "../../components/Finance/TabContent";
import { MessageContent } from "../../components/Messages/MessageContent";
import { SendMessages } from "../../components/Messages/SendMessages";
import { BirthdayItem } from "../../components/Messages/BirthdayItem";

import { FiMessageCircle } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { IoGiftOutline } from "react-icons/io5";
import { MessageHistory } from "../../components/Messages/MessageHistory";
import { Layout } from "../../components/Layout/Layout";

export function Messages() {
  const buttons = [
    { id: "mensagens", label: "Enviar mensagens" },
    { id: "aniversariantes", label: "Aniversariantes" },
    { id: "historico", label: "Histórico" },
  ];

  const contents = {
    mensagens: (
      <div className={styles.cardsWrapper}>
        <TabContent
          title="Envio por email"
          subtitle="Envie promoções e newsletters por email"
        >
          <MessageContent
            icon={<MdOutlineEmail />}
            text="Crie campanhas de email personalizadas"
          >
            <SendMessages text="Criar Email" />
          </MessageContent>
        </TabContent>

        <TabContent
          title="Envio por WhatsApp"
          subtitle="Envie mensagens diretas via WhatsApp"
        >
          <MessageContent
            icon={<FiMessageCircle />}
            text="Envie mensagens instantâneas para seus clientes"
          >
            <SendMessages text="Criar Mensagem" />
          </MessageContent>
        </TabContent>
      </div>
    ),

    aniversariantes: (
      <TabContent
        title="Aniversariantes do Mês"
        subtitle="Clientes que fazem aniversário este mês"
      >
        <div className={styles.birthdayItens}>
          <BirthdayItem
            icon={<IoGiftOutline />}
            name="João Silva"
            date={new Date(1995, 7, 16)}
            phoneNumber="(11) 99999-9999"
            email="joao@gmail.com"
          />
          <BirthdayItem
            icon={<IoGiftOutline />}
            name="João Silva"
            date={new Date(1995, 7, 16)}
            phoneNumber="(11) 99999-9999"
            email="joao@gmail.com"
          />
          <BirthdayItem
            icon={<IoGiftOutline />}
            name="João Silva"
            date={new Date(1995, 7, 16)}
            phoneNumber="(11) 99999-9999"
            email="joao@gmail.com"
          />
          <BirthdayItem
            icon={<IoGiftOutline />}
            name="João Silva"
            date={new Date(1995, 7, 16)}
            phoneNumber="(11) 99999-9999"
            email="joao@gmail.com"
          />
        </div>
      </TabContent>
    ),

    historico: (
      <TabContent
        title="Histórico de Envios"
        subtitle="Campanhas e mensagens enviadas"
      >
        <MessageHistory />
      </TabContent>
    ),
  };

  return (
    <Layout>
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
    </Layout>
  );
}
