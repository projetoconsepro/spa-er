import { useState } from "react";
import { Button, Checkbox, Modal, ScrollArea, Text, ThemeIcon } from "@mantine/core";
import { IconInfoCircle, IconShieldCheck } from "@tabler/icons-react";
import { formatarValor } from "../util/recargaAutomatica";

const listarValores = (valores = []) => {
  const formatados = valores.map(formatarValor);
  if (formatados.length <= 1) return formatados.join("");
  return `${formatados.slice(0, -1).join(", ")} ou ${formatados[formatados.length - 1]}`;
};

const ItemTermo = ({ letra, children }) => (
  <div className="d-flex align-items-start mb-3">
    <span
      className="d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
      style={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        backgroundColor: "#E7F5FF",
        color: "#1864AB",
        fontSize: 12,
        marginTop: 1,
      }}
    >
      {letra}
    </span>
    <Text size="sm" className="ms-2" style={{ color: "#343a40", lineHeight: 1.55 }}>
      {children}
    </Text>
  </div>
);

const TextoTermo = ({ saldoMinimo, valores, somenteLeitura }) => (
  <>
    <Text size="sm" color="dimmed" className="mb-3">
      Ao ativar a <strong>Recarga Automática</strong>, declaro estar ciente e de acordo com as condições abaixo.
    </Text>
    <ItemTermo letra="a">
      Sempre que meu saldo atingir <strong>{formatarValor(saldoMinimo)}</strong> ou menos, será feita{" "}
      <strong>automaticamente</strong> uma tentativa de cobrança no <strong>cartão de crédito selecionado</strong>, no{" "}
      <strong>valor definido por mim</strong> ({listarValores(valores)}).
    </ItemTermo>
    <ItemTermo letra="b">
      Se meu saldo for igual ou inferior a <strong>{formatarValor(saldoMinimo)}</strong> no momento da ativação, a
      primeira tentativa de recarga será feita <strong>imediatamente</strong>.
    </ItemTermo>
    <ItemTermo letra="c">
      A recarga automática pode ser processada em <strong>até 1 (um) minuto</strong> após o saldo atingir o limite.
    </ItemTermo>
    <ItemTermo letra="d">
      Em caso de <strong>recusa ou falha no pagamento</strong>, a recarga automática será{" "}
      <strong>suspensa temporariamente</strong> até que eu peça uma nova tentativa pela opção{" "}
      <strong>"Tentar novamente"</strong>.
    </ItemTermo>
    <ItemTermo letra="e">
      Serei <strong>notificado por e-mail</strong> a cada tentativa de recarga automática, seja ela{" "}
      <strong>aprovada ou recusada</strong>.
    </ItemTermo>
    <ItemTermo letra="f">
      Posso <strong>desativar a recarga automática a qualquer momento</strong>. Se não houver{" "}
      <strong>cartão de crédito cadastrado</strong> no momento da cobrança, ela será{" "}
      <strong>desativada automaticamente</strong>.
    </ItemTermo>
    {somenteLeitura ? null : (
      <div className="p-3" style={{ backgroundColor: "#F8F9FA", borderRadius: 8 }}>
        <Text size="xs" weight={700} className="mb-1" style={{ letterSpacing: "0.02em" }}>
          CONFIRMAÇÃO DE ACEITE
        </Text>
        <Text size="xs" color="dimmed" style={{ lineHeight: 1.55 }}>
          Ao confirmar, declaro que li, compreendi e concordo com todas as condições acima, autorizando a ativação da
          Recarga Automática e a realização de <strong>cobranças recorrentes no cartão de crédito selecionado</strong>,
          conforme o valor definido e as condições descritas neste termo.
        </Text>
      </div>
    )}
  </>
);

const TermoRecargaAutomatica = ({
  opened,
  onClose,
  onConfirmar,
  saldoMinimo,
  valores,
  valor,
  somenteLeitura,
}) => {
  const [aceito, setAceito] = useState(false);
  const [alerta, setAlerta] = useState(false);

  const fechar = () => {
    setAceito(false);
    setAlerta(false);
    onClose();
  };

  const confirmar = () => {
    if (!aceito) {
      setAlerta(true);
      setTimeout(() => {
        setAlerta(false);
      }, 3000);
      return;
    }
    setAceito(false);
    onConfirmar();
  };

  return (
    <Modal
      opened={opened}
      onClose={fechar}
      closeOnClickOutside={false}
      style={{ zIndex: 51 }}
      centered
      radius="md"
      padding="lg"
      title={
        <div className="d-flex align-items-center">
          <ThemeIcon size={32} radius="md" variant="light" color="blue">
            <IconShieldCheck size={18} />
          </ThemeIcon>
          <Text weight={700} className="ms-2">
            {somenteLeitura ? "Termos da recarga automática" : "Ativar recarga automática"}
          </Text>
        </div>
      }
    >
      {somenteLeitura ? (
        <>
          <TextoTermo saldoMinimo={saldoMinimo} valores={valores} somenteLeitura />
          <Button
            fullWidth
            mt="lg"
            radius="md"
            variant="gradient"
            gradient={{ from: "cyan", to: "blue", deg: 45 }}
            onClick={fechar}
          >
            Entendi
          </Button>
        </>
      ) : (
        <>
          <div className="d-flex align-items-start mb-4 p-2" style={{ backgroundColor: "#F8F9FA", borderRadius: 8 }}>
            <IconInfoCircle size={16} color="#868E96" className="flex-shrink-0" style={{ marginTop: 1 }} />
            <Text size="xs" color="dimmed" className="ms-2" style={{ lineHeight: 1.45 }}>
              Depois de ativar, você pode alterar o valor e o cartão quando quiser.
            </Text>
          </div>

          <Text size="sm" weight={600} className="mb-2">
            Termo de ciência e aceite
          </Text>
          <div style={{ border: "1px solid #dee2e6", borderRadius: 8, overflow: "hidden" }}>
            <ScrollArea.Autosize
              mah="40vh"
              type="auto"
              scrollbarSize={6}
              styles={{
                scrollbar: { padding: 2 },
                thumb: { backgroundColor: "#CED4DA" },
              }}
            >
              <div style={{ padding: "14px 16px" }}>
                <TextoTermo saldoMinimo={saldoMinimo} valores={valores} />
              </div>
            </ScrollArea.Autosize>
          </div>

          <Checkbox
            className="mt-4"
            color="blue"
            checked={aceito}
            onChange={(e) => setAceito(e.currentTarget.checked)}
            label="Li e concordo com os termos da recarga automática"
            error={alerta ? "Para ativar, é preciso concordar com os termos." : null}
          />

          <Button
            fullWidth
            mt="xl"
            size="md"
            radius="md"
            variant="gradient"
            gradient={{ from: "cyan", to: "blue", deg: 45 }}
            disabled={!valor}
            onClick={confirmar}
          >
            Ativar recarga automática
          </Button>
          <Button fullWidth mt="sm" radius="md" variant="subtle" color="gray" onClick={fechar}>
            Cancelar
          </Button>
        </>
      )}
    </Modal>
  );
};

export default TermoRecargaAutomatica;
