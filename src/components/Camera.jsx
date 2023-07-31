import React, { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2'
import FuncTrocaComp from "../util/FuncTrocaComp";
import adapter from 'webrtc-adapter';
import { Button, Card, Text } from "@mantine/core";
import { IconCamera, IconCheck, IconReload } from "@tabler/icons-react";

function Camera() {
  const videoRef = useRef(null);
  const mainDivRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [cont, setCont] = useState(0);
  const [cont2, setCont2] = useState(0);
  const [tamanho, setTamanho] = useState(90);
  const [divErro, setDivErro] = useState(false);
  const [cameraLoaded, setCameraLoaded] = useState(false); 

  const getVideo = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
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
          setCameraLoaded(true);
        }
      } else {
        console.log("O navegador não suporta getUserMedia");
        adapter.getUserMedia({ video: true },
          function (stream) {
            let video = videoRef.current;
            if (video) {
              video.srcObject = stream;
              video.play();
              setCameraLoaded(true); // Set cameraLoaded to true when the camera is loaded
            }
          },
          function (error) {
            setDivErro(true);
            console.log("Erro ao capturar vídeo: " + error.message);
          }
        );
      }
    } catch (error) {
      setDivErro(true);
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

  const stopVideoCapture = () => {
    setCameraLoaded(false);
    let video = videoRef.current;
    if (video && video.srcObject) {
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
  
      // Aguarda 1 segundo antes de chamar novamente a função getVideo.
      setTimeout(() => {
        getVideo(); // Chama a função getVideo novamente para iniciar a captura após 1 segundo.
      }, 1000);
    }
  };

  const savePhotosToLocalStorage = () => {
    if (photos.length < 2) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Mínimo de 3 fotos!',
        footer: '<a href>Tire no mínimo 4 fotos, por favor.</a>'
      });
    } else {
      for (let i = 0; i < photos.length; i++) {
        localStorage.setItem(`foto${i}`, photos[i].photo);
      }
      FuncTrocaComp("Notificacao");
    }
  };

  return (
    <>
      <div ref={mainDivRef} style={{ height: tamanho+'vh' , overflowY: 'scroll' }}>
        {photos.length > 0 && (
          <div className='row pb-1'>
            {photos.map((imagem, key) => (
              <div key={key} className="col-4">
                <img
                  key={imagem.id}
                  src={imagem.photo}
                  alt="foto"
                  className="mt-2 mb-2"
                  onClick={() => abrirModal(imagem.id)}
                />
              </div>
            ))}
          </div>
        )}
        <Card shadow="sm" className="mt-1 mb-2">
          {divErro ?
            <Text>Erro ao capturar vídeo, tente reiniciar a aplicação.</Text>
            :
            <video ref={videoRef} className="w-100"></video>
          }
          <div className="container" id="testeRolagem">
            <div className="mb-3">
              <div className="text-middle mt-3">
                <Button
                  variant="gradient"
                  size="md"
                  gradient={{ from: 'indigo', to: 'cyan' }}
                  rightIcon={<IconCamera />}
                  onClick={takePicture}
                  disabled={!cameraLoaded} 
                >
                  Tirar foto
                </Button>
                <Button
                  variant="gradient"
                  size="md"
                  className="mx-2"
                  gradient={{ from: 'yellow', to: 'orange' }}
                  rightIcon={<IconReload />}
                  onClick={() => stopVideoCapture()}
                >
                  Reiniciar
                </Button>
                {photos.length >= 2 && (
                  <Button
                    className="mt-2"
                    variant="gradient"
                    size="md"
                    gradient={{ from: 'teal', to: 'lime'}}
                    rightIcon={<IconCheck />}
                    onClick={savePhotosToLocalStorage}
                  >
                    Salvar fotos
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default Camera;
