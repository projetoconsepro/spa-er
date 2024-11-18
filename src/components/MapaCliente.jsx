import React, { useEffect, useState } from 'react';
import { Modal, Button} from '@mantine/core';
import createAPI from "../services/createAPI";
import MapaBase, { iconEstacionado, iconNaoEstacionado, iconIdoso, iconDeficiente } from './MapaBase';

const MapaAdmin = () => {
  const [vagas, setVagas] = useState([]);
  const [basePosition, setBasePosition] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [showModal, setShowModal] = useState(false);
  const [showIdoso, setShowIdoso] = useState(true);
  const [showDeficiente, setShowDeficiente] = useState(true);
  const [showOcupadas, setShowOcupadas] = useState(true);
  const [showLivres, setShowLivres] = useState(true);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setBasePosition([latitude, longitude]);
      },
      (error) => {
        setLocationError(true);
        console.error("Erro ao obter localização", error);
        setBasePosition([-29.6525234, -50.7815581]); 
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId); 
  }, []);

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        const requisicao = createAPI();
        const response = await requisicao.get('/vagas/listar');
        setVagas(response.data.data);
      } catch (error) {
        console.error('Erro ao buscar vagas:', error);
      }
    };

    fetchVagas();
  }, []);

  const styleButton = {
    width: '40px',
    height: '40px',
    position: 'fixed',
    top: '103px',
    right: '15px',
    zIndex: 600,
  };

  const openMaps = (vagaPosition) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${basePosition[0]},${basePosition[1]}&destination=${vagaPosition[0]},${vagaPosition[1]}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ height: `${windowHeight - 70}px`, width: '100%', overflow: 'hidden', zIndex: '0'}}>
      <Button onClick={handleOpenModal} className='bg-white p-0 m-0'
        style={{ width: '40px', height: '40px', position: 'fixed', top: '150px', right: '15px',zIndex: 4,}}> 
        <img src="https://img.icons8.com/glyph-neue/64/horizontal-settings-mixer.png" alt="filtrar" /></Button>

      <Modal opened={showModal} onClose={handleCloseModal} title="Filtros">
        <div
          className="d-flex justify-content-center align-items-center flex-column text-center bg-white"
          style={{
            margin: '0 auto',
            width: '100%',
          }}
        >
          {
          [{ icon: iconNaoEstacionado.options.iconUrl, label: 'Vagas Livres', checked: showLivres, onChange: setShowLivres },
          { icon: iconEstacionado.options.iconUrl, label: 'Vagas Ocupadas', checked: showOcupadas, onChange: setShowOcupadas },
          { icon: iconIdoso.options.iconUrl, label: 'Vagas para Idosos', checked: showIdoso, onChange: setShowIdoso },
          { icon: iconDeficiente.options.iconUrl, label: 'Vagas para Deficientes', checked: showDeficiente, onChange: setShowDeficiente },
          ].map((option, index) => (
            <label
              key={index}
              className="filter-option d-flex flex-column align-items-center m-4 p-3"
              style={{
                backgroundColor: '#f8f8f8',
                borderRadius: '8px',
                width: '190px',
                textAlign: 'center',
                transition: 'transform 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <img
                src={option.icon}
                alt={option.label}
                style={{ width: 40, height: 45, marginBottom: '8px' }}
              />

              <span style={{ fontSize: '1rem', color: '#333', fontWeight: '600' }}>
                {option.label}
              </span>        
              <input
                type="checkbox"
                checked={option.checked}
                onChange={() => option.onChange(!option.checked)}
                className="m-2"
                style={{
                  accentColor: '#ffffff',
                  width: '60px',
                  height: '20px',
                  color: '#000000',
                  border: '1px solid #000000',
                }}
              />
            </label>
          ))}
        </div>
      </Modal>
      {basePosition && (
        <MapaBase
          heightMapa={"100%"}
          basePosition={basePosition}
          vagas={vagas}
          selectedSectors={null}
          sectors={null}
          handleSectorClick={null}
          locationError={locationError}
          showIdoso={showIdoso}
          showDeficiente={showDeficiente}
          showOcupadas={showOcupadas}
          showLivres={showLivres}
          openMaps={openMaps}
          styleButton={styleButton}
        />
      )}
    </div>
  );
};

export default MapaAdmin;