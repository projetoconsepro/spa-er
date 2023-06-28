import React from 'react'
import "../pages/Style/styles.css";
import { Button } from '@mantine/core';
import { IconArrowBearRight } from '@tabler/icons-react';

const PaginaPrincipal = () => {
  return (
    <div className="container3">
  <div className="div1">
    <div className="image-container">
      <img src="../../assets/img/consepro11.png" alt="Exemplo de imagem" />
    </div>
    <div className="content2 w-50">
      <h1>ESTACIONE PELO SITE</h1>
      <p>Crie sua conta e estacione pelo site, clique no botão abaixo!</p>
      <Button
        variant="gradient"
        size="md"
        gradient={{ from: 'indigo', to: 'cyan' }}
        rightIcon={<IconArrowBearRight />}
      >
        Ir para o site
      </Button>
    </div>
  </div>
  <div className="div2">
    <div className="content">
      <h1>ESTACIONE PELO SITE</h1>
      <p>Crie sua conta e estacione pelo site, clique no botão abaixo!</p>
      <Button
        variant="gradient"
        size="md"
        gradient={{ from: 'indigo', to: 'violet', deg: 60 }}
        rightIcon={<IconArrowBearRight />}
      >
        Ir para o site
      </Button>
    </div>
    <div className="image-container2">
      <img src="../../assets/img/carroconsepro.png" alt="Exemplo de imagem" />
    </div>
  </div>
  <div className="div1 div3">
    <div className="image-container3">
      <img src="../../assets/img/whatsconsepro5.png" alt="Exemplo de imagem" />
    </div>
    <div className="content2 w-50">
      <h1>ESTACIONE PELO SITE</h1>
      <p>Crie sua conta e estacione pelo site, clique no botão abaixo!</p>
      <Button
        variant="gradient"
        size="md"
        gradient={{ from: 'cyan', to: 'indigo' }}
        rightIcon={<IconArrowBearRight />}
      >
        Ir para o site
      </Button>
    </div>
  </div>
</div>

  );
};

export default PaginaPrincipal