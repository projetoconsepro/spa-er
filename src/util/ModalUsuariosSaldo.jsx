import Swal from "sweetalert2";

const paraNumero = (valor) => {
  if (typeof valor === "number") return valor;
  const numero = parseFloat(String(valor).replace(/\./g, "").replace(",", "."));
  return Number.isNaN(numero) ? 0 : numero;
};

const formatarReais = (valor) =>
  paraNumero(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const iniciais = (nome) =>
  String(nome || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");

const escapar = (texto) =>
  String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const estilos = `
  .mus-lista { display: flex; flex-direction: column; gap: 10px; max-height: 320px; overflow-y: auto; padding: 4px 2px; }
  .mus-card { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 2px solid #e3e6ef; border-radius: 12px; background: #fff; cursor: pointer; text-align: left; transition: border-color .15s, box-shadow .15s, background .15s; }
  .mus-card:hover { border-color: #b8c3ea; }
  .mus-card.selecionado { border-color: #3A58C8; background: #f3f5fd; box-shadow: 0 0 0 3px rgba(58, 88, 200, .15); }
  .mus-card.indisponivel { cursor: not-allowed; opacity: .55; background: #f8f9fb; }
  .mus-card input { display: none; }
  .mus-avatar { flex: 0 0 42px; width: 42px; height: 42px; border-radius: 50%; background: #3A58C8; color: #fff; font-weight: 700; font-size: 15px; display: flex; align-items: center; justify-content: center; }
  .mus-card.indisponivel .mus-avatar { background: #9aa3b8; }
  .mus-info { flex: 1; min-width: 0; }
  .mus-nome { font-weight: 600; font-size: 15px; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .mus-saldo { font-size: 13px; color: #6b7280; margin-top: 2px; }
  .mus-saldo b { color: #198754; }
  .mus-card.indisponivel .mus-saldo b { color: #dc3545; }
  .mus-badge { flex: 0 0 auto; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 999px; }
  .mus-badge.ok { background: #e6f4ea; color: #198754; }
  .mus-badge.falta { background: #fdecec; color: #dc3545; }
  .mus-check { flex: 0 0 22px; width: 22px; height: 22px; border-radius: 50%; border: 2px solid #cfd5e3; display: flex; align-items: center; justify-content: center; }
  .mus-card.selecionado .mus-check { border-color: #3A58C8; background: #3A58C8; }
  .mus-card.selecionado .mus-check::after { content: ""; width: 8px; height: 8px; border-radius: 50%; background: #fff; }
  .mus-cabecalho { display: flex; justify-content: space-between; align-items: center; background: #f3f5fd; border-radius: 10px; padding: 10px 14px; margin-bottom: 12px; font-size: 14px; color: #374151; }
  .mus-cabecalho b { color: #3A58C8; font-size: 16px; }
  .mus-vazio { padding: 16px; color: #6b7280; font-size: 14px; }
`;

const selecionarUsuarioSaldo = (
  usuarios,
  valorNotificacao,
  placa = "",
  opcoes = {}
) => {
  const valor = paraNumero(valorNotificacao);
  const lista = usuarios.map((usuario) => ({
    ...usuario,
    saldoNumero: paraNumero(usuario.saldo),
    suficiente: paraNumero(usuario.saldo) >= valor,
  }));
  const primeiroDisponivel = lista.findIndex((usuario) => usuario.suficiente);

  const cards = lista
    .map((usuario, i) => {
      const classes = [
        "mus-card",
        usuario.suficiente ? "" : "indisponivel",
        i === primeiroDisponivel ? "selecionado" : "",
      ]
        .filter(Boolean)
        .join(" ");
      return `
        <label class="${classes}" data-indice="${i}">
          <input type="radio" name="usuarioSaldo" value="${usuario.id_usuario}" ${i === primeiroDisponivel ? "checked" : ""} ${usuario.suficiente ? "" : "disabled"}>
          <span class="mus-avatar">${escapar(iniciais(usuario.nome))}</span>
          <span class="mus-info">
            <span class="mus-nome" title="${escapar(usuario.nome)}">${escapar(usuario.nome)}</span>
            <span class="mus-saldo">Saldo disponível: <b>${formatarReais(usuario.saldoNumero)}</b></span>
          </span>
          <span class="mus-badge ${usuario.suficiente ? "ok" : "falta"}">${usuario.suficiente ? "Saldo suficiente" : "Saldo insuficiente"}</span>
          <span class="mus-check"></span>
        </label>`;
    })
    .join("");

  const corpo =
    lista.length > 0
      ? `<div class="mus-lista">${cards}</div>`
      : `<div class="mus-vazio">Nenhum usuário vinculado a este veículo.</div>`;

  return Swal.fire({
    title: placa ? `Debitar saldo ${escapar(placa)}` : "Debitar saldo",
    html: `
      <style>${estilos}</style>
      <div class="mus-cabecalho">
        <span>Valor da notificação</span>
        <b>${formatarReais(valor)}</b>
      </div>
      ${corpo}`,
    width: 520,
    showCancelButton: true,
    confirmButtonText: "Confirmar regularização",
    confirmButtonColor: "#3A58C8",
    cancelButtonText: "Cancelar",
    focusConfirm: false,
    ...opcoes,
    didOpen: () => {
      const container = Swal.getHtmlContainer();
      const confirmar = Swal.getConfirmButton();
      const atualizar = () => {
        container.querySelectorAll(".mus-card").forEach((card) => {
          const radio = card.querySelector("input");
          card.classList.toggle("selecionado", radio.checked);
        });
        confirmar.disabled = !container.querySelector(
          'input[name="usuarioSaldo"]:checked'
        );
      };
      container.querySelectorAll(".mus-card").forEach((card) => {
        card.addEventListener("click", (evento) => {
          const radio = card.querySelector("input");
          if (radio.disabled) {
            evento.preventDefault();
            return;
          }
          radio.checked = true;
          atualizar();
        });
      });
      atualizar();
    },
    preConfirm: () => {
      const selecionado = Swal.getHtmlContainer().querySelector(
        'input[name="usuarioSaldo"]:checked'
      );
      if (!selecionado) {
        Swal.showValidationMessage("Selecione um usuário com saldo suficiente");
        return false;
      }
      return selecionado.value;
    },
  });
};

export default selecionarUsuarioSaldo;
