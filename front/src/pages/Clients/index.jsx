import React, { useEffect, useState } from "react";
import styles from "./clients.module.css";
import { Layout } from "../../components/Layout/Layout";
import { getClients } from "../../services/api";

export function Clients() {
  const [clientes, setClientes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [fixo, setFixo] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");

  const [filtro, setFiltro] = useState("");
  const [erros, setErros] = useState({});

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 11;

useEffect(() => {
  loadClientes();

  
}, []);

console.log(clientes);
  const loadClientes = async () => {
  try {
    const data = await getClients();
        setClientes(data.items);
  } catch (error) {
    console.error("Erro ao carregar clientes:", error);
  }
};



  const resetForm = () => {
    setNome("");
    setCpf("");
    setEmail("");
    setCelular("");
    setFixo("");
    setLogradouro("");
    setNumero("");
    setBairro("");
    setCidade("");
    setEstado("");
    setCep("");
    setClienteEditando(null);
    setErros({});
  };

  const calcularPontos = (compras) => {
    return Math.floor((compras || 0) / 100) * 10;
  };
  const formatarCelular = (valor) => {
    const numeros = valor.replace(/\D/g, "");
    const parte1 = numeros.slice(0, 2);
    const parte2 = numeros.slice(2, 7);
    const parte3 = numeros.slice(7, 11);
    if (parte3) return `(${parte1}) ${parte2}-${parte3}`;
    if (parte2) return `(${parte1}) ${parte2}`;
    if (parte1) return `(${parte1}`;
    return "";
  };

  const formatarFixo = (valor) => {
    const numeros = valor.replace(/\D/g, "");
    const parte1 = numeros.slice(0, 2);
    const parte2 = numeros.slice(2, 6);
    const parte3 = numeros.slice(6, 10);
    if (parte3) return `(${parte1}) ${parte2}-${parte3}`;
    if (parte2) return `(${parte1}) ${parte2}`;
    if (parte1) return `(${parte1}`;
    return "";
  };

  const formatarCep = (valor) => {
    const numeros = valor.replace(/\D/g, "");
    const parte1 = numeros.slice(0, 2);
    const parte2 = numeros.slice(2, 5);
    const parte3 = numeros.slice(5, 8);
    if (parte3) return `${parte1}.${parte2}-${parte3}`;
    if (parte2) return `${parte1}.${parte2}`;
    if (parte1) return `${parte1}`;
    return "";
  };

  const formatarCpf = (valor) => {
    const numeros = valor.replace(/\D/g, "");
    const parte1 = numeros.slice(0, 3);
    const parte2 = numeros.slice(3, 6);
    const parte3 = numeros.slice(6, 9);
    const parte4 = numeros.slice(9, 11);

    if (parte4) return `${parte1}.${parte2}.${parte3}-${parte4}`;
    if (parte3) return `${parte1}.${parte2}.${parte3}`;
    if (parte2) return `${parte1}.${parte2}`;
    if (parte1) return `${parte1}`;
    return "";
  };

  const validarCampos = () => {
    const novosErros = {};

    if (!nome.trim()) novosErros.nome = "O nome é obrigatório.";

    if (!email.trim()) {
      novosErros.email = "O e-mail é obrigatório.";
    } else if (!email.includes("@")) {
      novosErros.email = "Digite um e-mail válido.";
    }

    const cpfNumeros = cpf.replace(/\D/g, "");
    if (!cpfNumeros) {
      novosErros.cpf = "O CPF é obrigatório.";
    } else if (!/^\d{11}$/.test(cpfNumeros)) {
      novosErros.cpf = "O CPF deve ter 11 números.";
    }

    const celularNumeros = celular.replace(/\D/g, "");
    if (!celularNumeros) {
      novosErros.celular = "O celular é obrigatório.";
    } else if (!/^\d{11}$/.test(celularNumeros)) {
      novosErros.celular = "O celular deve ter 11 números.";
    }

    const fixoNumeros = fixo.replace(/\D/g, "");
    if (fixo && !/^\d{10}$/.test(fixoNumeros)) {
      novosErros.fixo = "O telefone fixo deve ter 10 números.";
    }

    const cepNumeros = cep.replace(/\D/g, "");
    if (cep && !/^\d{8}$/.test(cepNumeros)) {
      novosErros.cep = "O CEP deve ter 8 números.";
    }

    if (estado && !/^[A-Za-z]{2}$/.test(estado)) {
      novosErros.estado = "O estado deve ter 2 letras.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleCadastrar = () => {
    if (!validarCampos()) return;

    if (clienteEditando) {
      setClientes(
        clientes.map((c) =>
          c.id === clienteEditando.id
            ? {
                ...clienteEditando,
                nome,
                cpf,
                email,
                celular,
                fixo,
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
                cep,
              }
            : c
        )
      );
    } else {
      const novoCliente = {
        id: Date.now(),
        nome,
        cpf,
        email,
        celular,
        fixo,
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        compras: 0,
      };
      setClientes([...clientes, novoCliente]);
    }

    resetForm();
    setMostrarModal(false);
  };

  const handleEditar = (cliente) => {
    setClienteEditando(cliente);
    setNome(cliente.nome);
    setCpf(cliente.cpf);
    setEmail(cliente.email);
    setCelular(cliente.celular);
    setFixo(cliente.fixo);
    setLogradouro(cliente.logradouro);
    setNumero(cliente.numero);
    setBairro(cliente.bairro);
    setCidade(cliente.cidade);
    setEstado(cliente.estado);
    setCep(cliente.cep);
    setMostrarModal(true);
  };

  const handleExcluir = (id) => {
    setClientes(clientes.filter((c) => c.id !== id));
  };

  const handleAbrirModal = (cliente) => {
    handleEditar(cliente);
  };

  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;
  const clientesPagina = clientesFiltrados.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(clientesFiltrados.length / itensPorPagina);

  return (
    <Layout>
      <div className="mainContent">
        <div className={styles.clients}>
          <div className={styles.listaClientesContainer}>
            <div className={styles.actionsBar}>
              <input
                type="text"
                placeholder="Pesquisar cliente..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              <button
                className={styles.btnNovoCliente}
                onClick={() => {
                  resetForm();
                  setMostrarModal(true);
                }}
              >
                Novo Cliente
              </button>
            </div>

            <div className={styles.listaClientes}>
              {clientesPagina.map((cliente) => (
                <div
                  key={cliente.id}
                  className={styles.clienteCard}
                  onClick={() => handleAbrirModal(cliente)}
                >
                  <div className={styles.cardLeft}>
                    <span className={styles.nomeCliente}>{cliente.nome}</span>
                  </div>
                  <div className={styles.cardCenter}>
                    <span className={styles.pontuacao}>
                      Pontuação:{" "}
                      {calcularPontos(cliente.compras)
                        .toString()
                        .padStart(4, "0")}
                    </span>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditar(cliente);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExcluir(cliente.id);
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}

              {Array.from({
                length: itensPorPagina - clientesPagina.length,
              }).map((_, i) => (
                <div
                  key={`vazio-${i}`}
                  className={styles.clienteCardVazio}
                ></div>
              ))}
            </div>

            <div className={styles.paginacao}>
              <button
                onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
              >
                {"<"}
              </button>
              {Array.from({ length: totalPaginas || 1 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPaginaAtual(i + 1)}
                  className={paginaAtual === i + 1 ? styles.ativo : ""}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setPaginaAtual((prev) =>
                    Math.min(prev + 1, totalPaginas || 1)
                  )
                }
              >
                {">"}
              </button>
            </div>
          </div>

          {mostrarModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h3>
                  {clienteEditando
                    ? "Editar Cliente"
                    : "Cadastrar Novo Cliente"}
                </h3>

                <div className={styles.formCadastro}>
                  <div className={`${styles.campo} ${styles.nome}`}>
                    <label>Nome Completo</label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                    {erros.nome && (
                      <small className={styles.erro}>{erros.nome}</small>
                    )}
                  </div>

                  <div className={`${styles.campo} ${styles.cpf}`}>
                    <label>CPF</label>
                    <input
                      type="text"
                      value={cpf}
                      onChange={(e) => setCpf(formatarCpf(e.target.value))}
                    />
                    {erros.cpf && (
                      <small className={styles.erro}>{erros.cpf}</small>
                    )}
                  </div>

                  <div className={`${styles.campo} ${styles.email}`}>
                    <label>E-mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {erros.email && (
                      <small className={styles.erro}>{erros.email}</small>
                    )}
                  </div>

                  <div className={`${styles.campo} ${styles.celular}`}>
                    <label>Celular</label>
                    <input
                      type="text"
                      value={celular}
                      onChange={(e) =>
                        setCelular(formatarCelular(e.target.value))
                      }
                    />
                    {erros.celular && (
                      <small className={styles.erro}>{erros.celular}</small>
                    )}
                  </div>

                  <div className={`${styles.campo} ${styles.fixo}`}>
                    <label>Telefone Fixo</label>
                    <input
                      type="text"
                      value={fixo}
                      onChange={(e) => setFixo(formatarFixo(e.target.value))}
                    />
                    {erros.fixo && (
                      <small className={styles.erro}>{erros.fixo}</small>
                    )}
                  </div>

                  <div className={`${styles.campo} ${styles.logradouro}`}>
                    <label>Logradouro</label>
                    <input
                      type="text"
                      value={logradouro}
                      onChange={(e) => setLogradouro(e.target.value)}
                    />
                  </div>

                  <div className={`${styles.campo} ${styles.numero}`}>
                    <label>Número</label>
                    <input
                      type="text"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                    />
                  </div>

                  <div className={`${styles.campo} ${styles.bairro}`}>
                    <label>Bairro</label>
                    <input
                      type="text"
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                    />
                  </div>

                  <div className={`${styles.campo} ${styles.cidade}`}>
                    <label>Cidade</label>
                    <input
                      type="text"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                    />
                  </div>

                  <div className={`${styles.campo} ${styles.estado}`}>
                    <label>Estado</label>
                    <input
                      type="text"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                    />
                    {erros.estado && (
                      <small className={styles.erro}>{erros.estado}</small>
                    )}
                  </div>

                  <div className={`${styles.campo} ${styles.cep}`}>
                    <label>CEP</label>
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(formatarCep(e.target.value))}
                    />
                    {erros.cep && (
                      <small className={styles.erro}>{erros.cep}</small>
                    )}
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button onClick={() => setMostrarModal(false)}>
                    Cancelar
                  </button>
                  <button onClick={handleCadastrar}>
                    {clienteEditando ? "Salvar Alterações" : "Cadastrar"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
