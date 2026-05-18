import React, { useEffect, useState } from 'react';
import { Clock, CreditCard } from 'lucide-react';

const TimeSchedule: React.FC = () => {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const hourStr = hours.toString().padStart(2, '0');
      setTime(`${hourStr}:${minutes} ${ampm}`);

      // Date formatting in Spanish
      const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const dayName = days[now.getDay()];
      const day = now.getDate();
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      setDate(`${dayName} ${day} ${month} de ${year}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-start bg-white p-8 gap-8 rounded-[26px] shadow-sm border border-gray-200 font-bakbak">
      <div className="flex items-center gap-4">
        <div className="bg-blue-50 p-3 rounded-2xl">
          <Clock className="text-blue-600" size={32} />
        </div>
        <div className="flex flex-col items-start gap-1">
          <span className="text-black text-4xl">{time}</span>
          <span className="text-gray-400 text-lg font-inter font-bold tracking-tight">
            {date}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-orange-50 p-3 rounded-2xl">
          <CreditCard className="text-orange-600" size={32} />
        </div>
        <div className="flex flex-col items-start gap-1">
          <span className="text-black text-xl">Horario de Hoy:</span>
          <span className="text-orange-600 text-xl font-bakbak">05:00 AM - 11:00 PM</span>
        </div>
      </div>
    </div>
  );
};

export default TimeSchedule;
