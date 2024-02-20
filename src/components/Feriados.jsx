import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentTimezonePlugin from "@fullcalendar/moment";
import rrulPlugin from "@fullcalendar/rrule";
import luxonPlugin from "@fullcalendar/luxon";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Input, Group, Text } from "@mantine/core";
import createAPI from '../services/createAPI';
import ptLocale from "@fullcalendar/core/locales/pt";
import { IconCalendar } from "@tabler/icons-react";
import Swal from "sweetalert2";

const Feriados = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [feriado, setFeriado] = useState("");
  const [dataSelected, setDataSelected] = useState("");
  const [dataFormmated, setDataFormmated] = useState("");
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [data, setData] = useState({});

  function formatDate (date) {
    const data = new Date(date);
    const dia = data.getUTCDate();
    const mes = data.getUTCMonth() + 1; 
    const ano = data.getUTCFullYear();
    const dataFormatada = `${ano}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;

    return dataFormatada;
  }

  useEffect(() => {
    const requisicao = createAPI();
    requisicao
    .get("/turno/feriado")
    .then((response) => {
      if (response.data.msg.resultado) {
        const newData = response.data.data.map((item) => ({
          title: item.feriado,
          start: formatDate(item.data),
        }));
        setData(newData)
      }
    })
    .catch((error) => {
      console.log(error);
    });

  }, []);

  const openModal = (e) => {
    const isDateAlreadyExists = data.some((event) => event.start === e.dateStr);

    if (!isDateAlreadyExists) {
      const parts = e.dateStr.split("-");
      const day = parts[2];
      const month = parts[1];
      const year = parts[0];
      const formattedDate = `${day}-${month}-${year}`;
      setDataFormmated(formattedDate);
      setDataSelected(e);
      open();
    }
  };

  function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  }

  const removerFeriado = (e) => {
  Swal.fire({
    title: "Deseja remover o feriado?",
    text: "Você não poderá reverter essa ação!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, remover!",
    cancelButtonText: "Não, cancelar!",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      const requisicao = createAPI();
      requisicao
      .delete("/turno/feriado", {
        data: {
          data: e.event.startStr,
        },
      })
      .then((response) => {
        if (response.data.msg.resultado) {
          handleRemoveFeriado(e);
          Swal.fire(
            "Removido!",
            "O feriado foi removido com sucesso.",
            "success"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelado", "O feriado não foi removido :)", "error");
    }
  });
  }

  const handleRemoveFeriado = (e) => {
    const newData = data.filter((event) => {
     return !(event.start === e.event.startStr);
    });

    setData(newData);
  };

  const handleSalvar = async () => {
    setEstadoLoading(true);
    const requisicao = createAPI();
    requisicao.post("/turno/feriado", {
      feriado: feriado,
      data: dataSelected.dateStr,
    })
    .then((response) => {
      setEstadoLoading(false);
      if (response.data.msg.resultado) {
        setData([
          ...data,
          {
            title: feriado,
            start: dataSelected.dateStr,
          },
        ]);
        close();
        setFeriado("");
        setDataSelected("");
        setDataFormmated("");
      }
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <div className="row">
    <div className="col-7 mb-3">
      <h5 className="text-start mx-4 mb-4">Feriados</h5>
    </div>
    <div className="bg-white p-5 rounded fs-6">
      <FullCalendar
        handleWindowResize
        dateClick={(e) => openModal(e)}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          momentTimezonePlugin,
          rrulPlugin,
          luxonPlugin,
        ]}
        initialView="dayGridMonth"
        events={data}
        eventContent={renderEventContent}
        locale={ptLocale}
        eventClick={removerFeriado}
      />

      <Modal
        opened={opened}
        onClose={close}
        title="Adicionar feriado"
        centered
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <div className="mb-2">
          <Text size="md">Data selecionada - {dataFormmated}</Text>
        </div>
        <div className="mb-4">
          <Input
            icon={<IconCalendar size={16} />}
            placeholder="Digite o nome do feriado"
            maxLength={15}
            onChange={(e) => setFeriado(e.target.value)}
          />
        </div>
        <div className="mt-auto">
          <Group position="center" spacing="sm" grow>
            <Button
              color="gray"
              onClick={() => {
                close();
              }}
            >
              Voltar
            </Button>
            <Button
              loading={estadoLoading}
              onClick={() => {
                handleSalvar();
              }}
              loaderPosition="right"
            >
              Adicionar
            </Button>
          </Group>
        </div>
      </Modal>
    </div>
  </div>
  );
};

export default Feriados;
