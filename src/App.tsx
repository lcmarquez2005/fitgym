import DashboardERP from './pages/erp/DashboardERP';

const App = () => {
  // const [notification, setNotification] = useState<string | null>(null);

  // // Estados para que la gráfica sea dinámica
  // const [inscritos, setInscritos] = useState(55);
  // const [sinPagar, setSinPagar] = useState(2);

  // const showNotification = (message: string) => {
  //   setNotification(message);
  //   setTimeout(() => setNotification(null), 3000);
  // };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Importación de Fuentes */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Bakbak+One&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          .font-bakbak { font-family: 'Bakbak One', sans-serif; }
          .font-inter { font-family: 'Inter', sans-serif; }
        `}
      </style>

      <DashboardERP />
    </div>
  );
};

export default App;