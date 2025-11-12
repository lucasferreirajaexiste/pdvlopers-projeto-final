import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./clients.module.css";
import { Layout } from "../../components/Layout/Layout";
import {
  createClient,
  deleteClient,
  getClients,
  updateClient,
} from "../../services/api";

const stripNonDigits = (value = "") => value.replace(/\D/g, "");

const parseEndereco = (value) => {
  if (!value) return {};
  if (typeof value === "object" && !Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object") return parsed;
  } catch (err) {
    // ignore parse errors and fallback to string
  }
  return { formatted: String(value) };
};

const normalizeCliente = (item = {}) => {
  const address = parseEndereco(item.endereco);
  return {
    id: item.id,
    nome: item.nome || item.name || "",
    cpf: item.cpf || "",
    email: item.email || "",
    telefone: item.telefone || "",
    compras: item.compras || 0,
    created_at: item.created_at || item.createdAt || null,
    address,
  };
};

const calcularPontos = (cliente) => {
  if (typeof cliente?.points === "number") return cliente.points;
  if (typeof cliente?.total_pontos === "number") return cliente.total_pontos;
  if (typeof cliente?.loyalty_points === "number")
    return cliente.loyalty_points;
  return Math.floor((cliente?.compras || 0) / 100) * 10;
};

const formatarCelular = (valor = "") => {
  const numeros = stripNonDigits(valor);
  const parte1 = numeros.slice(0, 2);
  const parte2 = numeros.slice(2, 7);
  const parte3 = numeros.slice(7, 11);
  if (parte3) return `(${parte1}) ${parte2}-${parte3}`;
  if (parte2) return `(${parte1}) ${parte2}`;
  if (parte1) return `(${parte1}`;
  return "";
};

const formatarFixo = (valor = "") => {
  const numeros = stripNonDigits(valor);
  const parte1 = numeros.slice(0, 2);
  const parte2 = numeros.slice(2, 6);
  const parte3 = numeros.slice(6, 10);
  if (parte3) return `(${parte1}) ${parte2}-${parte3}`;
  if (parte2) return `(${parte1}) ${parte2}`;
  if (parte1) return `(${parte1}`;
  return "";
};

const formatarCep = (valor = "") => {
  const numeros = stripNonDigits(valor);
  const parte1 = numeros.slice(0, 2);
  const parte2 = numeros.slice(2, 5);
  const parte3 = numeros.slice(5, 8);
  if (parte3) return `${parte1}.${parte2}-${parte3}`;
  if (parte2) return `${parte1}.${parte2}`;
  if (parte1) return `${parte1}`;
  return "";
};

const formatarCpf = (valor = "") => {
  const numeros = stripNonDigits(valor);
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
  const [submitError, setSubmitError] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 11;

  const loadClientes = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const data = await getClients();
      const items = data?.items || [];
      setClientes(items.map(normalizeCliente));
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      setFetchError("Não foi possível carregar os clientes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

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
    setSubmitError("");
  };

  const buildEnderecoPayload = () => {
    const address = {
      logradouro: logradouro.trim(),
      numero: numero.trim(),
      bairro: bairro.trim(),
      cidade: cidade.trim(),
      estado: estado.trim(),
      cep: stripNonDigits(cep),
      fixo: stripNonDigits(fixo),
    };

    const hasInfo = Object.values(address).some((value) => value);
    return hasInfo ? JSON.stringify(address) : null;
  };

  const validarCampos = () => {
    const novosErros = {};

    if (!nome.trim()) novosErros.nome = "O nome é obrigatório.";

    if (!email.trim()) {
      novosErros.email = "O e-mail é obrigatório.";
    } else if (!email.includes("@")) {
      novosErros.email = "Digite um e-mail válido.";
    }

    const cpfNumeros = stripNonDigits(cpf);
    if (!cpfNumeros) {
      novosErros.cpf = "O CPF é obrigatório.";
    } else if (!/^\d{11}$/.test(cpfNumeros)) {
      novosErros.cpf = "O CPF deve ter 11 números.";
    }

    const celularNumeros = stripNonDigits(celular);
    if (!celularNumeros) {
      novosErros.celular = "O celular é obrigatório.";
    } else if (!/^\d{11}$/.test(celularNumeros)) {
      novosErros.celular = "O celular deve ter 11 números.";
    }

    const fixoNumeros = stripNonDigits(fixo);
    if (fixo && !/^\d{10}$/.test(fixoNumeros)) {
      novosErros.fixo = "O telefone fixo deve ter 10 números.";
    }

    const cepNumeros = stripNonDigits(cep);
    if (cep && !/^\d{8}$/.test(cepNumeros)) {
      novosErros.cep = "O CEP deve ter 8 números.";
    }

    if (estado && !/^[A-Za-z]{2}$/.test(estado)) {
      novosErros.estado = "O estado deve ter 2 letras.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvarCliente = async () => {
    if (!validarCampos()) return;
    setSaving(true);
    setSubmitError("");

    const payload = {
      nome: nome.trim(),
      cpf: stripNonDigits(cpf),
      email: email.trim(),
      telefone: stripNonDigits(celular),
      endereco: buildEnderecoPayload(),
    };

    try {
      let saved;
      if (clienteEditando) {
        saved = await updateClient(clienteEditando.id, payload);
      } else {
        saved = await createClient(payload);
      }

      const savedItem = saved?.item || saved;
      const normalized = normalizeCliente(savedItem);

      setClientes((prev) => {
        if (clienteEditando) {
          return prev.map((cliente) =>
            cliente.id === normalized.id ? normalized : cliente
          );
        }
        return [normalized, ...prev];
      });

      resetForm();
      setMostrarModal(false);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      const message =
        error?.error ||
        error?.message ||
        error?.data?.error ||
        "Não foi possível salvar o cliente.";
      setSubmitError(message);
    } finally {
      setSaving(false);
    }
  };

  const preencherFormulario = (cliente) => {
    setClienteEditando(cliente);
    setNome(cliente.nome || "");
    setCpf(formatarCpf(cliente.cpf || ""));
    setEmail(cliente.email || "");
    setCelular(formatarCelular(cliente.telefone || ""));

    const address = cliente.address || {};
    setFixo(formatarFixo(address.fixo || ""));
    setLogradouro(address.logradouro || address.formatted || "");
    setNumero(address.numero || "");
    setBairro(address.bairro || "");
    setCidade(address.cidade || "");
    setEstado(address.estado || "");
    setCep(formatarCep(address.cep || ""));
  };

  const handleEditar = (cliente) => {
    preencherFormulario(cliente);
    setMostrarModal(true);
  };

  const handleExcluir = async (id) => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        "Deseja realmente excluir este cliente?"
      );
      if (!confirmed) return;
    }
    setSaving(true);
    try {
      await deleteClient(id);
      setClientes((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Erro ao remover cliente:", error);
      setFetchError("Não foi possível remover o cliente.");
    } finally {
      setSaving(false);
    }
  };

  const clientesFiltrados = useMemo(() => {
    const termo = filtro.trim().toLowerCase();
    if (!termo) return clientes;
    return clientes.filter((c) =>
      (c.nome || "").toLowerCase().includes(termo)
    );
  }, [clientes, filtro]);

  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;
  const clientesPagina = clientesFiltrados.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(
    Math.max(clientesFiltrados.length, 1) / itensPorPagina
  );
  const placeholders = Math.max(itensPorPagina - clientesPagina.length, 0);

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
              {fetchError && (
                <div className={styles.erro}>{fetchError}</div>
              )}
              {loading ? (
                <p>Carregando clientes...</p>
              ) : clientesPagina.length ? (
                clientesPagina.map((cliente) => (
                  <div
                    key={cliente.id}
                    className={styles.clienteCard}
                    onClick={() => handleEditar(cliente)}
                  >
                  <div className={styles.cardLeft}>
                    <span className={styles.nomeCliente}>{cliente.nome}</span>
                  </div>
                      <div className={styles.cardCenter}>
                    <span className={styles.pontuacao}>
                      Pontuação:{" "}
                      {calcularPontos(cliente).toString().padStart(4, "0")}
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
                      disabled={saving}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
              ) : (
                !fetchError && <p>Nenhum cliente encontrado.</p>
              )}

              {!loading &&
                Array.from({ length: placeholders }).map((_, i) => (
                  <div key={`vazio-${i}`} className={styles.clienteCardVazio} />
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
                  <button onClick={handleSalvarCliente} disabled={saving}>
                    {saving
                      ? "Salvando..."
                      : clienteEditando
                        ? "Salvar Alterações"
                        : "Cadastrar"}
                  </button>
                </div>
                {submitError && (
                  <small className={styles.erro}>{submitError}</small>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
