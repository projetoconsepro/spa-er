import React, { useState, useEffect } from 'react';

const Cronometro = ({ time }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const [hours, minutes, secs] = time.split(':');
    const totalSeconds = parseInt(hours * 3600) + parseInt(minutes * 60) + parseInt(secs);
    setSeconds(totalSeconds);
  }, [time]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds > 0 ? prevSeconds - 1 : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => {
    const horas = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutos = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const segundos = Math.floor(time % 60).toString().padStart(2, '0');

    return `${horas}:${minutos}:${segundos}`;
  };

  return (
    <span>{formatTime(seconds)}</span>
  );
};

export default Cronometro;