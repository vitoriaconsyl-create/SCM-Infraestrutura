
import { useState, useEffect } from "react";
import { Bell, CheckCheck, Mail, RefreshCw } from "lucide-react";

import { apiRequest } from "../services/api";
import "../styles/minhasNotificacoes.css";

function MinhasNotificacoes({
  token,
  onVoltar,
  onLogout,
  userName,
}) {
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [marcandoId, setMarcandoId] = useState(null);

  async function carregarNotificacoes() {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await apiRequest(
        "/notificacoes/minhas",
        { method: "GET" },
        token
      );

      const lista = Array.isArray(resposta)
        ? resposta
        : resposta.notificacoes || [];

      setNotificacoes(lista);
    } catch (erro) {
      setErro(
        erro.message || "Não foi possível carregar as notificações."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarNotificacoes();
  }, [token]);

  async function marcarComoLida(id) {
    if (marcandoId !== null) return;

    setMarcandoId(id);
    setErro("");

    try {
      await apiRequest(
        `/notificacoes/${id}/lida`,
        { method: "PATCH" },
        token
      );

      setNotificacoes((listaAtual) =>
        listaAtual.map((notificacao) =>
          notificacao.id === id
            ? { ...notificacao, lida: true }
            : notificacao
        )
      );
    } catch (erro) {
      setErro(
        erro.message || "Não foi possível atualizar a notificação."
      );
    } finally {
      setMarcandoId(null);
    }
  }

  const naoLidas = notificacoes.filter(
    (notificacao) => !notificacao.lida
  ).length;

  function formatarData(data) {
    if (!data) return "Data não informada";

    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
      return "Data não informada";
    }

    return dataConvertida.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="notificacoes-page">
      <div className="notificacoes-container">
        <div className="notificacoes-topo">
          <div>
            <span className="notificacoes-identificacao">
              ÁREA DO CIDADÃO
            </span>

            <h1>Minhas notificações</h1>

            <p>
              Olá, {userName || "Cidadão"}. Confira as mensagens
              enviadas pela administração.
            </p>
          </div>

          <div className="notificacoes-icone-principal">
            <Bell size={30} />
          </div>
        </div>

        <section className="notificacoes-resumo">
          <div className="notificacoes-resumo-icone">
            <Mail size={24} />
          </div>

          <div>
            <span>Mensagens não lidas</span>
            <strong>{naoLidas}</strong>
          </div>
        </section>

        <div className="notificacoes-lista-topo">
          <h2>Caixa de notificações</h2>

          <button
            type="button"
            className="notificacoes-atualizar"
            onClick={carregarNotificacoes}
            disabled={carregando}
          >
            <RefreshCw size={16} />
            Atualizar
          </button>
        </div>

        {erro && (
          <div className="notificacoes-erro" role="alert">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className="notificacoes-vazio">
            Carregando notificações...
          </div>
        ) : notificacoes.length === 0 ? (
          <div className="notificacoes-vazio">
            <Bell size={34} />
            <h3>Nenhuma notificação</h3>
            <p>
              Quando a administração enviar uma mensagem, ela
              aparecerá aqui.
            </p>
          </div>
        ) : (
          <div className="notificacoes-lista">
            {notificacoes.map((notificacao) => (
              <article
                key={notificacao.id}
                className={`notificacao-card ${
                  notificacao.lida
                    ? "notificacao-lida"
                    : "notificacao-nao-lida"
                }`}
              >
                <div className="notificacao-card-icone">
                  {notificacao.lida ? (
                    <Mail size={22} />
                  ) : (
                    <Bell size={22} />
                  )}
                </div>

                <div className="notificacao-conteudo">
                  <div className="notificacao-card-cabecalho">
                    <span className="notificacao-status">
                      {notificacao.lida ? "Lida" : "Nova"}
                    </span>

                    <time>
                      {formatarData(
                        notificacao.criado_em
                      )}
                    </time>
                  </div>

                  <p className="notificacao-mensagem">
                    {notificacao.mensagem}
                  </p>

                  {notificacao.ocorrencia_id && (
                    <span className="notificacao-ocorrencia">
                      Ocorrência #{notificacao.ocorrencia_id}
                    </span>
                  )}

                  {!notificacao.lida && (
                    <button
                      type="button"
                      className="notificacao-marcar-lida"
                      onClick={() =>
                        marcarComoLida(notificacao.id)
                      }
                      disabled={marcandoId !== null}
                    >
                      <CheckCheck size={16} />
                      {marcandoId === notificacao.id
                        ? "Atualizando..."
                        : "Marcar como lida"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="notificacoes-rodape">
          <button
            type="button"
            className="notificacoes-voltar"
            onClick={onVoltar}
          >
            Voltar ao início
          </button>
        </div>
      </div>
    </main>
  );
}

export default MinhasNotificacoes;
