// FILE: MapaCliente.jsx
import React, { useEffect, useState } from 'react';
import createAPI from "../services/createAPI";
import { Button } from '@mantine/core';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import MapaBase, { iconEstacionado, iconNaoEstacionado, iconIdoso, iconDeficiente } from './MapaBase';

ChartJS.register(ArcElement, Tooltip, Legend);

const MapaCliente = () => {
  const [vagas, setVagas] = useState([]);
  const [showIdoso, setShowIdoso] = useState(true);
  const [showDeficiente, setShowDeficiente] = useState(true);
  const [showOcupadas, setShowOcupadas] = useState(true);
  const [showLivres, setShowLivres] = useState(true);
  const [basePosition, setBasePosition] = useState(null);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [sectorInfo, setSectorInfo] = useState(null);
  const [locationError, setLocationError] = useState(null);

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

  const sectors = [
    { name: 'A', bounds: [[-29.6525234, -50.7825585], [-29.6505234, -50.7805585]], color: 'red' },
    { name: 'B', bounds: [[-29.6525234, -50.7805585], [-29.6505234, -50.7785585]], color: 'blue' },
    { name: 'C', bounds: [[-29.6525234, -50.7785585], [-29.6505234, -50.7765585]], color: 'green' },
    { name: 'D', bounds: [[-29.6525234, -50.7765585], [-29.6505234, -50.7745585]], color: 'yellow' },
    { name: 'E', bounds: [[-29.6525234, -50.7745585], [-29.6505234, -50.7725585]], color: 'purple' },
    { name: 'F', bounds: [[-29.6525234, -50.7725585], [-29.6505234, -50.7705585]], color: 'orange' },
    { name: 'G', bounds: [[-29.6525234, -50.7705585], [-29.6505234, -50.7685585]], color: 'pink' },
    { name: 'H', bounds: [[-29.6525234, -50.7685585], [-29.6505234, -50.7665585]], color: 'brown' },
    { name: 'I', bounds: [[-29.6525234, -50.7665585], [-29.6505234, -50.7645585]], color: 'cyan' },
    { name: 'J', bounds: [[-29.6525234, -50.7645585], [-29.6505234, -50.7625585]], color: 'magenta' },
    { name: 'K', bounds: [[-29.6525234, -50.7625585], [-29.6505234, -50.7605585]], color: 'lime' },
  ];

  const handleSectorChange = (sectorName) => {
    setSelectedSectors((prevSelectedSectors) =>
      prevSelectedSectors.includes(sectorName)
        ? prevSelectedSectors.filter((name) => name !== sectorName)
        : [...prevSelectedSectors, sectorName]
    );
  };

  const handleSectorClick = (sectorName) => {
    const sectorVagas = vagas.filter(vaga => vaga.setor === sectorName);
    const vagasLivres = sectorVagas.filter(vaga => vaga.estacionado === 'N').length;
    const vagasOcupadas = sectorVagas.filter(vaga => vaga.estacionado === 'S').length;
    setSectorInfo({ name: sectorName, vagasLivres, vagasOcupadas });
  };

  const openMaps = (vagaPosition) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${basePosition[0]},${basePosition[1]}&destination=${vagaPosition[0]},${vagaPosition[1]}&travelmode=driving`;
    window.open(url, '_blank');
  };

 const styleButton = {
    visibility: 'hidden'
  }; 

  const data = {
    labels: ['Vagas Livres', 'Vagas Ocupadas'],
    datasets: [
      {
        data: sectorInfo ? [sectorInfo.vagasLivres, sectorInfo.vagasOcupadas] : [0, 0],
      },
    ],
  };

  const closeSectorInfo = () => {
    setSectorInfo(null);
  };

  return (
    <div>
      {basePosition && (
        <div>
          <div
            className="filter-card d-flex justify-content-center p-3 bg-white"
            style={{
              flexWrap: 'wrap',
              borderRadius: '12px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              margin: '0 auto',
            }}>
            {[
              { icon: iconIdoso.options.iconUrl, label: 'Vagas para Idosos', checked: showIdoso, onChange: setShowIdoso },
              { icon: iconDeficiente.options.iconUrl, label: 'Vagas para Deficientes', checked: showDeficiente, onChange: setShowDeficiente },
              { icon: iconEstacionado.options.iconUrl, label: 'Vagas Ocupadas', checked: showOcupadas, onChange: setShowOcupadas },
              { icon: iconNaoEstacionado.options.iconUrl, label: 'Vagas Livres', checked: showLivres, onChange: setShowLivres },
            ].map((option, index) => (
              <label
                key={index}
                className="filter-option d-flex flex-column align-items-center m-4 p-2"
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

                <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#333' }}>
                  {option.label}
                </span> 
                <input
                  type="checkbox"
                  checked={option.checked}
                  onChange={() => option.onChange(!option.checked)}
                  className="m-2"
                  style={{
                    accentColor: selectedSectors.includes(option.label) ? option.color : '#000000',
                    width: '60px',
                    height: '20px',
                    color: '#000000',
                    border: '1px solid #000000',
                  }}
                />
              </label>
            ))}
          </div>
          <div className="sector-card d-flex justify-content-center py-4 bg-white mt-3" style={{ flexWrap: 'wrap' }}>
            {sectors.map((sector) => (
              <label key={sector.name} className="sector-option m-2 d-flex align-items-center" style={{ wordBreak: 'break-word' }}>
                <input
                  type="checkbox"
                  checked={selectedSectors.includes(sector.name)}
                  onChange={() => handleSectorChange(sector.name)}
                  style={{
                    width: '40px',
                    height: '20px',
                    accentColor: selectedSectors.includes(sector.name) ? sector.color : '#000000',
                  }}
                />
                Setor {sector.name}
              </label>
            ))}
          </div>
          {sectorInfo && (
            <div className="sector-info bg-white p-3 mt-3" style={{ width: '100%', height: '250px' }}>
              <div className="d-flex justify-content-center align-items-center position-relative">
                <h5 className="mx-auto">Setor {sectorInfo.name}</h5>
                <Button
                  onClick={closeSectorInfo}
                  className="btn-close position-absolute"
                  aria-label="Close"
                  style={{ right: '10px' }}
                ></Button>
              </div>
              <div style={{ height: '180px' }}>
                <Pie data={data} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          )}
          <div className='bg-white rounded-2 p-4 mt-3'>
            <MapaBase
              heightMapa={"600px"}
              basePosition={basePosition}
              vagas={vagas}
              selectedSectors={selectedSectors}
              sectors={sectors}
              handleSectorClick={handleSectorClick}
              locationError={locationError}
              showIdoso={showIdoso}
              showDeficiente={showDeficiente}
              showOcupadas={showOcupadas}
              showLivres={showLivres}
              openMaps={openMaps}
              styleButton={styleButton}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaCliente;