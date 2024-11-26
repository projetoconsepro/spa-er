import React, { useEffect, useState } from 'react';
import createAPI from "../services/createAPI";
import { Button } from '@mantine/core';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import MapaBase, { iconEstacionado, iconNaoEstacionado, iconIdoso, iconDeficiente } from './MapaBase';
import io from 'socket.io-client';
ChartJS.register(ArcElement, Tooltip, Legend);
const socket = io(
  `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`
);
const gerarCorAleatoria = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const MapaAdmin = () => {
  const [vagas, setVagas] = useState([]);
  const [showIdoso, setShowIdoso] = useState(true);
  const [showDeficiente, setShowDeficiente] = useState(true);
  const [showOcupadas, setShowOcupadas] = useState(true);
  const [showLivres, setShowLivres] = useState(true);
  const [basePosition, setBasePosition] = useState(null);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [sectorInfo, setSectorInfo] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [setoresFormatado, setSetoresFormatado] = useState([]);
  const [localizacaoMonitoras, setLocalizacaoMonitoras] = useState([]);
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
  

  useEffect(() => { 
    socket.emit('enviarLocalizacao');
    socket.on('localizacaoDados', (data) => {
      setLocalizacaoMonitoras(data);
    });
    return () => {
      socket.off('localizacaoDados');
    };
  }, [localizacaoMonitoras]);

  const setores = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
  
  const calcularExtremos = (vagas, setor) => {
    const vagasSetor = vagas.filter(vaga => vaga.setor === setor && vaga.coordenada);
    if (vagasSetor.length === 0) {
      return null; 
    }
    const coordenadas = vagasSetor.map(vaga => {
      const [lat, lng] = vaga.coordenada.split(',').map(parseFloat);
      return [lat, lng];
    });
  
    const convexHull = (points) => {
      points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  
      const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  
      const lower = [];
      for (let point of points) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
          lower.pop();
        }
        lower.push(point);
      }
  
      const upper = [];
      for (let i = points.length - 1; i >= 0; i--) {
        const point = points[i];
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
          upper.pop();
        }
        upper.push(point);
      }
  
      lower.pop();
      upper.pop();
      return lower.concat(upper);
    };
  
    return convexHull(coordenadas);
  }; 
 
  useEffect(() => {
    const coresSetores = setores.reduce((acc, setor) => {
      acc[setor] = gerarCorAleatoria();
      return acc;
    }, {});
  const setoresComPoligonos = setores.map(setor => {
    const bounds = calcularExtremos(vagas, setor);
    if (!bounds) {
      return null;
    } 
    
    return {
      name: setor,
      bounds: bounds,
      color: coresSetores[setor]
    };
   
  }).filter(Boolean);
  setSetoresFormatado(setoresComPoligonos); 
}, [vagas]);

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
            className="filter-card d-flex justify-content-center p-1 bg-white"
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
                className="filter-option d-flex align-items-center m-2 p-2 px-4"
                style={{
                  backgroundColor: '#f8f8f8',
                  borderRadius: '8px',
                  width: '285px',
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
                  style={{ width: 40, height: 45, marginBottom: '8px', marginRight: '9px' }}
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
          <div className="sector-card d-flex justify-content-center py-3 bg-white mt-2 rounded-2" style={{ flexWrap: 'wrap' }}>
            {setoresFormatado.map((sector) => (
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
            <div className="sector-info bg-white p-3 mt-2" style={{ width: '100%', height: '250px' }}>
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
          <div className='bg-white rounded-2 p-4 mt-2'>
            <MapaBase
              heightMapa={"600px"}
              basePosition={basePosition}
              vagas={vagas}
              selectedSectors={selectedSectors}
              sectors={setoresFormatado}
              handleSectorClick={handleSectorClick}
              locationError={locationError}
              showIdoso={showIdoso}
              showDeficiente={showDeficiente}
              showOcupadas={showOcupadas}
              showLivres={showLivres}
              openMaps={openMaps}
              styleButton={styleButton}
              localizacaoMonitoras={localizacaoMonitoras}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaAdmin;