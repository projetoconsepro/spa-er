import React, { useEffect, useRef, useState } from "react";
import { BsCameraFill } from "react-icons/bs";
import Swal from 'sweetalert2'
import FuncTrocaComp from "../util/FuncTrocaComp";
import adapter from 'webrtc-adapter';
import { Button, Card } from "@mantine/core";
import { IconCamera, IconCheck } from "@tabler/icons-react";
import axios from "axios";

function CameraTicketNotificacao() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    const videoRef = useRef(null);
    const [photos, setPhotos] = useState([]);
    const [cont, setCont] = useState(0);
    const [cont2, setCont2] = useState(0);
    const [idNotificacao, setIdNotificacao] = useState("");

    useEffect(() => {
    const id = localStorage.getItem('id_notificacao');
    setIdNotificacao(id)
    }, []);

  const getVideo = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // O navegador suporta getUserMedia()
        console.log("O navegador suporta getUserMedia");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: "environment" }
          }
        });
        let video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play();
        }
      } else {
        console.log("O navegador não suporta getUserMedia");
        adapter.getUserMedia({ video: true },
          function (stream) {
            let video = videoRef.current;
            if (video) {
              video.srcObject = stream;
              video.play();
            }
          },
          function (error) {
            console.log("Erro ao capturar vídeo: " + error.message);
          }
        );
      }
    } catch (error) {
      console.log("Erro ao capturar áudio e vídeo: " + error.message);
    }
  };
  

  useEffect(() => {
    setTimeout(() => {
      if (cont2 === 1) {
        getVideo();
      }
      setCont2(cont2 + 1);
    }, 500);
  }, [cont2]);

  const takePicture = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoDataUrl = canvas.toDataURL("image/png");

    const updatedPhotos = [...photos, { id: cont, photo: photoDataUrl }];
    setPhotos(updatedPhotos);
    setCont(cont + 1);
  };

  const deletePhoto = (id) => {
    const updatedPhotos = photos.filter((item) => item.id !== id);
    setPhotos(updatedPhotos);
  };

  const abrirModal = (id) => {
    const photo = photos.find((item) => item.id === id)?.photo;
    if (photo) {
      Swal.fire({
        html: `<img src="${photo}" />`,
        showCancelButton: true,
        focusConfirm: true,
        confirmButtonText: "<i class='fa-solid fa-trash'></i> Apagar",
        confirmButtonColor: '#d33',
        cancelButtonText: "<i class='bi bi-trash'></i>Cancelar",
        cancelButtonColor: '#c1c1c1',
      }).then((result) => {
        if (result.isConfirmed) {
          deletePhoto(id);
          Swal.fire({
            title: 'Imagem apagada',
            icon: 'success',
            confirmButtonText: 'Fechar',
            confirmButtonColor: '#2361ce'
          });
        }
      });
    }
  };

  const savePhotosToLocalStorage = () => {
    const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "monitor"
        }
    });
    if (photos.length > 1) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Você só pode tirar 1 foto.',
        footer: '<a href>Tire apenas uma foto, por favor.</a>'
      });
    } else {
      console.log(photos)
      requisicao.post('/notificacao/ticket', {
      id_notificacao: idNotificacao,
      foto: photos[0].photo
      }).then((response) => {
        if(response.data.msg.resultado){
          FuncTrocaComp("ListarVagasMonitor")
        console.log(response.data);
      }
      }).catch((error) => {
        console.log(error);
      });
    }
  };

  return (
    <div>
      {photos.length > 0 && (
      <Card shadow="sm" className="mt-3 mb-2">
      {photos.map((item) => (
        <img
          key={item.id}
          src={item.photo}
          alt="foto"
          className="mt-2 mb-2"
          onClick={() => abrirModal(item.id)}
        />
      ))}
      </Card>
      )}
      <Card shadow="sm" className="mt-3 mb-2">
      <video ref={videoRef} className="w-100"></video>
      </Card>
      <div className="container" id="testeRolagem">
        <div className="mb-6">
          <div className="text-middle mt-3">
            <Button
            variant="gradient"
            size="md"
            gradient={{ from: 'indigo', to: 'cyan' }}
            rightIcon={<IconCamera />}
            onClick={takePicture}
            >Tirar foto
            </Button>
            {photos.length === 1 && (
            <Button
            className="mx-2" 
            variant="gradient"
            size="md"
            gradient={{ from: 'teal', to: 'lime'}}
            rightIcon={<IconCheck />}
            onClick={savePhotosToLocalStorage}
            >Salvar fotos
            </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CameraTicketNotificacao;
