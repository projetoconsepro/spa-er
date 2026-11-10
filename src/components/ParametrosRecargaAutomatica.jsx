import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Badge, Button, CloseButton, Group, NumberInput, Text } from "@mantine/core";
import createAPI from "../services/createAPI";
import { formatarValor } from "../util/recargaAutomatica";

const estadoInicial = (parametros) => ({
  saldoMinimo: parametros?.saldoMinimo ?? "",
  maximoPorDia: parametros?.maximoPorDia ?? "",
  valores: [...(parametros?.valores || [])].sort((a, b) => a - b),
});

const ParametrosRecargaAutomatica = ({ parametros, onSalvo }) => {
  const [form, setForm] = useState(() => estadoInicial(parametros));
  const [novoValor, setNovoValor] = useState("");
  const [erroNovoValor, setErroNovoValor] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setForm(estadoInicial(parametros));
  }, [parametros]);

  const original = estadoInicial(parametros);
  const alterado = JSON.stringify(form) !== JSON.stringify(original);

  const erroSaldo = form.saldoMinimo === "" || form.saldoMinimo < 0 ? "Informe um valor de zero ou mais." : null;
  const erroMaximo =
    form.maximoPorDia === "" || form.maximoPorDia < 1 || !Number.isInteger(form.maximoPorDia)
      ? "Informe um número inteiro de 1 ou mais."
      : null;
  const erroValores = form.valores.length === 0 ? "Deixe ao menos um valor disponível." : null;
  const invalido = Boolean(erroSaldo || erroMaximo || erroValores);

  const alterar = (campo, valor) => setForm((anterior) => ({ ...anterior, [campo]: valor }));

  const adicionarValor = () => {
    if (novoValor === "" || novoValor <= 0) {
      setErroNovoValor("Informe um valor maior que zero.");
      return;
    }
    if (form.valores.includes(novoValor)) {
      setErroNovoValor("Esse valor já está na lista.");
      return;
    }
    alterar("valores", [...form.valores, novoValor].sort((a, b) => a - b));
    setNovoValor("");
    setErroNovoValor("");
  };

  const removerValor = (valor) => alterar("valores", form.valores.filter((v) => v !== valor));

  const avisosDeDesativacao = () => {
    const avisos = [];
    const removidos = original.valores.filter((v) => !form.valores.includes(v));
    if (removidos.length > 0) {
      avisos.push(
        `Clientes que usam ${removidos.map(formatarValor).join(", ")} terão a recarga automática desativada e serão avisados por e-mail e notificação.`
      );
    }
    return avisos;
  };

  const salvar = async () => {
    const avisos = avisosDeDesativacao();
    if (avisos.length > 0) {
      const { isConfirmed } = await Swal.fire({
        title: "Confirmar alteração?",
        html: avisos.map((aviso) => `<p>${aviso}</p>`).join(""),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Salvar mesmo assim",
        cancelButtonText: "Cancelar",
      });
      if (!isConfirmed) return;
    }

    setSalvando(true);
    try {
      const resposta = await createAPI().put("/parametros", { recargaAutomatica: form });
      if (resposta.data.msg.resultado) {
        onSalvo(form);
        Swal.fire({
          icon: "success",
          title: "Parâmetros da recarga automática salvos!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire("Aviso!", resposta.data.msg.msg, "error");
      }
    } catch (error) {
      Swal.fire("Aviso!", error?.response?.data?.msg?.msg || "Não foi possível salvar os parâmetros.", "error");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="text-start mt-2">
      <NumberInput
        label="Recarregar quando o saldo chegar a"
        description="A cobrança acontece com o saldo igual ou abaixo deste valor."
        icon={<Text size="sm">R$</Text>}
        precision={2}
        decimalSeparator=","
        min={0}
        step={1}
        value={form.saldoMinimo}
        onChange={(valor) => alterar("saldoMinimo", valor)}
        error={erroSaldo}
        style={{ maxWidth: 280 }}
      />

      <NumberInput
        className="mt-3"
        label="Máximo de recargas por dia"
        description="Por cliente. Recargas recusadas não contam."
        min={1}
        step={1}
        value={form.maximoPorDia}
        onChange={(valor) => alterar("maximoPorDia", valor)}
        error={erroMaximo}
        style={{ maxWidth: 280 }}
      />

      <Text size="sm" weight={500} className="mt-3">
        Valores de recarga
      </Text>
      <Text size="xs" color="dimmed">
        Opções que o cliente pode escolher.
      </Text>
      <Group spacing="xs" className="mt-2">
        {form.valores.map((valor) => (
          <Badge
            key={valor}
            size="lg"
            variant="outline"
            pr={3}
            rightSection={
              <CloseButton
                size="xs"
                radius="xl"
                variant="transparent"
                aria-label={`Remover ${formatarValor(valor)}`}
                onClick={() => removerValor(valor)}
              />
            }
          >
            {formatarValor(valor)}
          </Badge>
        ))}
      </Group>
      {erroValores ? (
        <Text size="xs" color="red" className="mt-1">
          {erroValores}
        </Text>
      ) : null}
      <Group spacing="xs" align="flex-start" className="mt-2">
        <NumberInput
          aria-label="Novo valor de recarga"
          placeholder="Novo valor"
          icon={<Text size="sm">R$</Text>}
          precision={2}
          decimalSeparator=","
          min={0}
          hideControls
          value={novoValor}
          onChange={(valor) => {
            setNovoValor(valor);
            setErroNovoValor("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") adicionarValor();
          }}
          error={erroNovoValor || null}
          style={{ flex: 1, maxWidth: 280 }}
        />
        <Button variant="light" onClick={adicionarValor}>
          Adicionar
        </Button>
      </Group>

      <Button className="mt-3" onClick={salvar} loading={salvando} disabled={!alterado || invalido}>
        Salvar
      </Button>
    </div>
  );
};

export default ParametrosRecargaAutomatica;
