import React, { useEffect, useState } from 'react';
import { Modal, Button} from '@mantine/core';
import MapaBase, { iconEstacionado, iconNaoEstacionado, iconIdoso, iconDeficiente } from './MapaBase';
import io from 'socket.io-client';
  const socket = io(
    `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`
  );  
const MapaAdmin = () => {
  const [vagas, setVagas] = useState([]);
  const [basePosition, setBasePosition] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showIdoso, setShowIdoso] = useState(true);
  const [showDeficiente, setShowDeficiente] = useState(true);
  const [showOcupadas, setShowOcupadas] = useState(true);
  const [showLivres, setShowLivres] = useState(true);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [centerMap, setCenterMap] = useState(false);
    
  useEffect(() => {
    socket.emit('vagas');
    socket.on('vagasDados', (data) => {
      setVagas(data);
    });
    return () => {
      socket.off('vagasDados');
    };
  }, [vagas]);

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



  const openMaps = (vagaPosition) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${basePosition[0]},${basePosition[1]}&destination=${vagaPosition[0]},${vagaPosition[1]}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ width: '100%', overflow: 'hidden', zIndex: '0'}}>
      <Button onClick={handleOpenModal} className='bg-white p-0 m-0'
        style={{ width: '40px', height: '40px', position: 'fixed', top: '150px', right: '15px',zIndex: 4,}}> 
        <img src="https://img.icons8.com/glyph-neue/64/horizontal-settings-mixer.png" alt="filtrar" /></Button>

        <Modal centered
            styles={{ content: { backgroundColor: '#ECECEC', }, header: { backgroundColor: '#ECECEC', }, }}
            size="xl"
            opened={showModal} onClose={handleCloseModal}>
            <div className="row mb-4 px-5">
              <div className='bg-white rounded-1 shadow'>
                {basePosition && (
                  <div>
                    <div
                      className="filter-card d-flex justify-content-center text-start p-2 py-3 bg-white rounded-2 mb-3"
                      style={{
                        flexWrap: 'wrap',
                        margin: '0 auto',
                      }}
                    >
                      <div className="row">
                        {[
                          { icon: iconIdoso.options.iconUrl, label: 'Vagas para Idosos', checked: showIdoso, onChange: setShowIdoso },
                          { icon: iconDeficiente.options.iconUrl, label: 'Vagas para Deficientes', checked: showDeficiente, onChange: setShowDeficiente },
                          { icon: iconEstacionado.options.iconUrl, label: 'Vagas Ocupadas', checked: showOcupadas, onChange: setShowOcupadas },
                          { icon: iconNaoEstacionado.options.iconUrl, label: 'Vagas Livres', checked: showLivres, onChange: setShowLivres },
                        ].map((option, index) => (
                          <div key={index} className="col-md-6">
                            <label
                              className="filter-option d-flex align-items-center p-2 px-4 m-2"
                              style={{
                                backgroundColor: '#f8f8f8',
                                borderRadius: '8px',
                                textAlign: 'center',
                                transition: 'transform 0.2s',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                              <img
                                src={option.icon}
                                alt={option.label}
                                className='p-1'
                                style={{ width: 40, height: 45, marginRight: '9px' }}
                              />
                              <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#333', flex: 1, textAlign: 'center' }}>
                                {option.label}
                              </span>
                              <input
                                type="checkbox"
                                checked={option.checked}
                                onChange={() => option.onChange(!option.checked)}
                                className="m-2"
                                style={{
                                  accentColor: '#000000',
                                  width: '60px',
                                  height: '20px',
                                  color: '#000000',
                                  border: '1px solid #000000',
                                  marginLeft: 'auto',
                                }}
                              />
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )} </div>
                 </div>
      </Modal>

      {basePosition && (
        <div>
          <Button
            onClick={() => setCenterMap(!centerMap)}
            className='bg-white p-0 m-0'
            style={{
              width: '40px',
              height: '40px',
              position: 'fixed',
              top: '103px',
              right: '15px',
              zIndex: 4
            }}
          >
          <img className='p-1' src="https://img.icons8.com/ios-filled/50/center-direction.png" alt="centralizar" />
          </Button>
          <MapaBase

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
          localizacaoMonitoras={null}
          centerMap={centerMap}
        /></div>
      )}
    </div>
  );
};

export default MapaAdmin;