import React, { useEffect, useRef, useState} from "react";
import { BsCameraFill } from "react-icons/bs";
import Swal from 'sweetalert2'

function Camera() {
  let videoRef = useRef(null);
  let photoRef1 = useRef(null)
  let [ response ] = useState([])
  const [ cont , setCont] = useState(0)
  const [imagens, setImagens] = useState([]);



  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true
      })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    getVideo();
}, [])

  const LocalStorage = () => {
    for(let i = 0; i < response.length; i++){
      if(response[i].foto !== null){
        localStorage.setItem(`foto${i}`, response[i].foto);
      }
    }
    localStorage.setItem("componente", "Notificacao");
    window.location.reload();
  }

  function removerImagem(id){
    const array = [];
    for (let i = 0; i < response.length; i++) {
      if (i !== id) {
        if(response[i] !== undefined){
        array.push(response[i]);
        }
        }
      }
    response = array;
    const imagensAtualizadas = response.filter((response) => response.id !== id);
    setImagens(imagensAtualizadas);
    const newArray = imagensAtualizadas.filter(element => element !== undefined);
    response = newArray;
  }

  const takePicture = (id) => {
    let photoo;
    photoo = photoRef1;
    if(photoo !== null){
    const width = 400
    const height = width / (16 / 9)
    let video = videoRef.current
    let photo = photoo.current
    photo.width = width
    photo.height = height
    let ctx = photo.getContext('2d')
    ctx.drawImage(video, 0, 0, width, height)
    let cont2 = 0;
    for (let i = 0; i < response.length; i++) {
      if (response[i].foto !== null) {
        cont2++;
      }
      else{
      }
    }

    if (cont2 >= 6) { 
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Limite de fotos atingido!',
        footer: '<a href>Why do I have this issue?</a>'
      })
    }
    else {
      response.push({ "id": cont, "foto": photoo.current.toDataURL() })
    setCont(cont + 1)
  }
  }
}

  const abrirModal = (id) => {
    Swal.fire({
      html: `<img src="${response[id].foto}" />`,
      showCancelButton: true,
      focusConfirm: true,
      confirmButtonText:
      "<i class='fa-solid fa-trash'></i> Apagar",
      confirmButtonColor: '#d33',
      cancelButtonText:
        "<i class='bi bi-trash'></i>Cancelar",
      cancelButtonColor: '#c1c1c1',
      }).then((result) => {
        if (result.isConfirmed) {
          response[id].foto = null;
          removerImagem(id);
          Swal.fire({
            title: 'Imagem apagada',
            icon: 'success',
            confirmButtonText: 'Fechar',
            confirmButtonColor: '#2361ce'})
        } else if (result.isDenied) {
        }
      })
  }

  return (
    
    <div>
      <video ref={videoRef} className=" w-100"></video>

      <div className="container" id="testeRolagem">

      <div>
        <div className="text-middle">
          <button className="btn btn-2">
              <BsCameraFill size={20} onClick={()=>{ takePicture ('1')}} />
        </button>
        </div>
      </div>
        <div className="col" style={{ display : 'none' }}>
        <canvas id="testeCanvas" ref={photoRef1} onClick={()=>{ abrirModal('1')}} ></canvas>
        </div>
        {response.map((item, key) => (
          <div key={key}> 
            {item.foto !== null ? 
          <div key={item.id} className= 'pt-3' >
            <img src={item.foto} alt="foto" onClick={()=>{abrirModal(item.id)}} />
          </div>
          : null}
          </div>
        ))}
          <div className="h6 mt-5">
            <button type="submit" className="btn4 botao" onClick={()=>{LocalStorage()}}>Salvar fotos</button>
          </div>
        </div>  
    </div>
  );
}

export default Camera;