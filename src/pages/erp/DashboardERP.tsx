import  { useState } from 'react';
import {
  Notification,
  Header,
  Hero,
  LeftPanel,
  RightPanel,
  Footer,
} from '../../components';

const DashboardERP = () => {
  const [notification, setNotification] = useState<string | null>(null);

  // Estados para que la gráfica sea dinámica
  const [inscritos, setInscritos] = useState(55);
  const [sinPagar, setSinPagar] = useState(2);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Notificación Custom */}
      <Notification message={notification} onClose={() => setNotification(null)} />

      {/* Contenedor principal */}
      <div className="max-w-8xl mx-auto bg-gray-100 pt-[30px] px-4 md:px-[50px] pb-12">
        {/* Header / Logo */}
        <Header />

        {/* Hero Section */}
        <Hero />

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row items-start self-stretch mb-[21px] gap-8">
          
          {/* Left Panel */}
          <LeftPanel
            inscritos={inscritos}
            sinPagar={sinPagar}
            onSearch={() => showNotification("Buscando usuario...")}
          />

          {/* Right Panel */}
          <RightPanel
            inscritos={inscritos}
            sinPagar={sinPagar}
            onInscritosChange={setInscritos}
            onSinPagarChange={setSinPagar}
          />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardERP;