import React from 'react';
import ChartSection from './ChartSection';
import TimeSchedule from './TimeSchedule';

interface RightPanelProps {
  inscritos: number;
  sinPagar: number;
  onInscritosChange: (value: number) => void;
  onSinPagarChange: (value: number) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  inscritos,
  sinPagar,
  onInscritosChange,
  onSinPagarChange,
}) => {
  return (
    <div className="flex flex-col shrink-0 w-full lg:w-[440px] gap-8">
      <ChartSection
        inscritos={inscritos}
        sinPagar={sinPagar}
        onInscritosChange={onInscritosChange}
        onSinPagarChange={onSinPagarChange}
      />
      <TimeSchedule />
    </div>
  );
};

export default RightPanel;
