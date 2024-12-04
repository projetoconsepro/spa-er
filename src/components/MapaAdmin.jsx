import React, { useEffect, useState, useRef } from 'react';
import createAPI from "../services/createAPI";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import MapaBase, { iconEstacionado, iconNaoEstacionado, iconIdoso, iconDeficiente } from './MapaBase';
import io from 'socket.io-client';
import "../pages/Style/styles.css";
import { CloseButton, Button, Modal } from '@mantine/core';

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
  const [setores, setSetores] = useState([]);
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
  const [selectedMonitoras, setSelectedMonitoras] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [centerMap, setCenterMap] = useState(false);

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
        requisicao.get('/vagas/listar').then((response) => {
          if (response.data.data.length > 0) {
            setVagas(response.data.data);
          } else {
            setVagas([]);
          }
        })
      } catch (error) {
        console.error('Erro ao buscar vagas:', error);
      }
    };

    const fetchSetores = async () => {
      try {
        const requisicao = createAPI();
        const response = await requisicao.get('/setores');
        if (response.data.data.setores.length > 0) {
          const nomesSetores = response.data.data.setores.map(setor => setor.nome);
          setSetores(nomesSetores);
        } else {
          setSetores([]);
        }
      } catch (error) {
        console.error('Erro ao buscar setores:', error);
      }
    };

    fetchVagas();
    fetchSetores();
  }, []);


  useEffect(() => {
    socket.emit('enviarLocalizacao');
    socket.on('localizacaoDados', (data) => {
      setLocalizacaoMonitoras(data);
      setPageLoaded(true);
    });
    return () => {
      socket.off('localizacaoDados');
    };
  }, [localizacaoMonitoras]);


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

  const handleMonitoraSelect = (monitoraId) => {
    setSelectedMonitoras((prevSelectedMonitoras) =>
      prevSelectedMonitoras.includes(monitoraId)
        ? prevSelectedMonitoras.filter((id) => id !== monitoraId)
        : [...prevSelectedMonitoras, monitoraId]
    );
  };

  const removeMonitora = (monitoraId) => {
    setSelectedMonitoras((prevSelectedMonitoras) =>
      prevSelectedMonitoras.filter((id) => id !== monitoraId)
    );
  };

  useEffect(() => {
    if (pageLoaded) {
      if (localizacaoMonitoras.length > 0) {
        setSelectedMonitoras(localizacaoMonitoras.map(monitora => monitora.idUsuario));
      }
    }
  }, [pageLoaded]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

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

  useEffect(() => {
    if (localizacaoMonitoras.length > 0) {
      setSelectedMonitoras(localizacaoMonitoras.map(monitora => monitora.idUsuario));
    }
  }, []);

  return (
    <div>
      {basePosition && (
        <div>
          <Modal centered
            styles={{ content: { backgroundColor: '#ECECEC', }, header: { backgroundColor: '#ECECEC', }, }}
            size="xl"
            opened={filtersVisible} onClose={() => setFiltersVisible(false)}>
            <div className="row mb-4 px-5">
              <div className='bg-white rounded-1 shadow'>
                {basePosition && (
                  <div>
                    <div className='text-start ps-4 mt-4'><h6 >Vagas :</h6></div>
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
                              className="filter-option d-flex align-items-center p-2 px-4"
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
                )}
                <div>
                  <div className='text-start ps-4 mt-2'><h6 >Setores :</h6></div>
                  <div className="d-flex justify-content-center mb-3 px-4">
                    <div className="sector-card d-flex justify-content-center py-3 mt-2 rounded-2" style={{ flexWrap: 'wrap', width: '100%', backgroundColor: '#f8f8f8' }}>
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
                  </div>
                </div>
                {localizacaoMonitoras.length > 0 && (
                <div className='px-2 mb-4'>
                  <div className='bg-white py-3 px-3 rounded-2' style={{ height: '100%' }}>
                    <div className="dropdown" ref={dropdownRef} style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="form-control dropdown-toggle rounded-1"
                        placeholder="Selecionar Monitoras"
                        onClick={() => setDropdownVisible(!dropdownVisible)}
                        aria-expanded={dropdownVisible}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                      />
                      {dropdownVisible && (
                        <ul
                          className="dropdown-menu show"
                          style={{
                            width: '100%',
                            position: 'absolute',
                            top: 'auto',
                            bottom: '100%',
                            backgroundColor: '#fff',
                            zIndex: 1000,
                            boxShadow: 'none'
                          }}>
                          {localizacaoMonitoras
                            .filter((monitora) => monitora.nome.toLowerCase().includes(searchTerm.toLowerCase()))
                            .sort((a, b) => a.nome.localeCompare(b.nome))
                            .map((monitora) => (
                              <li key={monitora.idUsuario} className="dropdown-item d-flex align-items-center" style={{ borderBottom: '1px solid #e9ecef', padding: '12px 15px' }}>
                                <input
                                  type="checkbox"
                                  id={`monitora-${monitora.idUsuario}`}
                                  className="me-2"
                                  style={{ width: '20px', height: '15px', accentColor: '#287ED4' }}
                                  checked={selectedMonitoras.includes(monitora.idUsuario)}
                                  onChange={() => handleMonitoraSelect(monitora.idUsuario)}
                                />
                                <label htmlFor={`monitora-${monitora.idUsuario}`} className="w-100 m-0">
                                  <span>{monitora.nome}</span>
                                </label>
                              </li>
                            ))}<li className="dropdown-item d-flex align-items-center" style={{ borderBottom: '1px solid #e9ecef', padding: '12px 15px' }}>
                            <input
                              type="checkbox"
                              id="select-all"
                              className="me-2"
                              style={{ width: '20px', height: '15px', accentColor: '#287ED4' }}
                              checked={localizacaoMonitoras.length > 0 && selectedMonitoras.length === localizacaoMonitoras.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedMonitoras(localizacaoMonitoras.map(monitora => monitora.idUsuario));
                                } else {
                                  setSelectedMonitoras([]);
                                }
                              }}
                            />
                            <label htmlFor="select-all" className="w-100 m-0">
                              <span>{selectedMonitoras.length === localizacaoMonitoras.length ? 'Desmarcar Todas' : 'Selecionar Todas'}</span>
                            </label>
                          </li>
                        </ul>
                      )}
                    </div>

                    <div className="selected-monitoras mt-3 d-flex flex-wrap justify-content-start">
                      {selectedMonitoras.map((monitoraId) => {
                        const monitora = localizacaoMonitoras.find((m) => m.idUsuario === monitoraId);
                        if (!monitora) return null;
                        return (
                          <div key={monitoraId} className="chip">
                            {monitora.nome}
                            <CloseButton className='text-white ms-2 ps-1' variant="transparent" onClick={() => removeMonitora(monitoraId)} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>)}
              </div>
            </div>
          </Modal>
          {sectorInfo && (
            <div className="sector-info bg-white p-3 mb-2" style={{ width: '81%', height: '250px', position: 'fixed', bottom: '5px', zIndex: 3 }}>
              <div className="d-flex justify-content-center align-items-center position-relative">
                <h5 className="mx-auto">Setor {sectorInfo.name}</h5>
                <button
                  onClick={closeSectorInfo}
                  className="btn-close position-absolute"
                  aria-label="Close"
                  style={{ right: '10px' }}
                ></button>
              </div>
              <div style={{ height: '180px' }}>
                <Pie data={data} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          )}
          <div className="d-flex justify-content-end">
            <Button
              className="button-fixed bg-white" id='fixed1'
              onClick={() => setFiltersVisible(true)}
            >Abrir Filtros
            </Button>
            <Button
              onClick={() => setCenterMap(!centerMap)}
              className='button-fixed bg-white' id='fixed2'>
              <img className='p-1' src="https://img.icons8.com/ios-filled/50/center-direction.png" alt="centralizar" />
            </Button>
          </div>
          <div className='bg-white rounded-2 p-3'>
            <MapaBase
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
              localizacaoMonitoras={localizacaoMonitoras.filter(monitora => selectedMonitoras.includes(monitora.idUsuario))}
              centerMap={centerMap}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaAdmin;