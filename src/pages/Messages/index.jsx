//styles
import styles from "./messages.module.css";
//data mock
import clients from '../../data/mockClients.json'
//Componets
import { Tabs } from "../../components/Finance/Tabs";
import { Header } from "../../components/Finance/Header";
import { TabContent } from "../../components/Finance/TabContent";
import { MessageContent } from "../../components/Messages/MessageContent";
import { SendMessages } from "../../components/Messages/SendMessages";
import { BirthdayItem } from "../../components/Messages/BirthdayItem";
//icones
import { MdOutlineEmail } from "react-icons/md";
import { MessageHistory } from "../../components/Messages/MessageHistory";
import { Layout } from "../../components/Layout/Layout";

export function Messages() {
  const buttons = [
    { id: "mensagens", label: "Enviar mensagens" },
    { id: "aniversariantes", label: "Aniversariantes" },
    // { id: "historico", label: "Histórico" },
  ];

  const currentMonth = new Date().getMonth(); // Janeiro = 0, Fevereiro = 1, ...

  const aniversariantesDoMes = clients.filter(client => {
    const birthDate = new Date(client.dataNascimento);
    return birthDate.getMonth() === currentMonth;
  });

  const mockMessages = [
    {
      id: 1,
      title: "Promoção de Aniversário",
      category: "whatsapp",
      numberRecipients: 25,
      date: "2025-09-20"
    },
    {
      id: 2,
      title: "Newsletter Mensal",
      category: "email",
      numberRecipients: 100,
      date: "2025-09-19"
    }
  ];

  const contents = {
    mensagens: (
      <div className={styles.cardsWrapper}>
        <TabContent title="Envio por email" subtitle="Envie promoções e newsletters por email">
          <MessageContent icon={<MdOutlineEmail />} text="Crie campanhas de email personalizadas">
            <SendMessages text="Criar Email" type="Email" />
          </MessageContent>
        </TabContent>

        {/* <TabContent title="Envio por WhatsApp" subtitle="Envie mensagens diretas via WhatsApp">
                    <MessageContent icon={<FiMessageCircle />} text="Envie mensagens instantâneas para seus clientes">
                        <SendMessages text="Criar Mensagem" type="WhatsApp" />
                    </MessageContent>
                </TabContent> */}

      </div>
    ),

    aniversariantes: (
      < TabContent title="Aniversariantes do Mês" subtitle="Clientes que fazem aniversário este mês" >
        <div className={styles.birthdayItens}>
          {aniversariantesDoMes.map(client => {
            const [year, month, day] = client.dataNascimento.split('-').map(Number);
            const birthDate = new Date(year, month - 1, day);

            return (
              <BirthdayItem
                key={client.id}
                name={client.nome}
                date={birthDate}
                phoneNumber={client.telefone}
                email={client.email}
              />
            )
          })}
        </div>
      </TabContent >
    ),

    historico: (
      <TabContent title="Histórico de Envios" subtitle="Campanhas e mensagens enviadas">
        <div className={styles.historyList}>
          {mockMessages.map(msg => (
            <MessageHistory
              key={msg.id}
              title={msg.title}
              category={msg.category}
              numberRecipients={msg.numberRecipients}
              date={msg.date}
            />
          ))}
        </div>
      </TabContent>
    ),
  };

  return (
    <Layout>
      <div className={styles.container}>
        {/* <div className={styles.header}>
          <Header
            title="Mensagens"
            subtitle="Envie promoções e mensagens para seus clientes"
          />
        </div> */}

        <div className={styles.tabs}>
          <Tabs buttons={buttons} contents={contents} />
          <Tabs contents={contents.contents} />
        </div>
      </div>
    </Layout>
  );
}
