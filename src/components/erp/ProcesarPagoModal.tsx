import React, { useState } from 'react';
import { X, CreditCard, Banknote, Landmark, Loader2, CheckCircle2 } from 'lucide-react';
import { PagoService, type PagoRequest } from '@services/pago.service';
import { toast } from 'sonner';

interface ProcesarPagoModalProps {
  socioId: string | number;
  socioNombre: string;
  onClose: () => void;
  onPagoExitoso?: (nuevaFechaFin: string) => void;
}

export const ProcesarPagoModal: React.FC<ProcesarPagoModalProps> = ({ 
  socioId, 
  socioNombre, 
  onClose, 
  onPagoExitoso 
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<PagoRequest, 'idSocio'>>({
    monto: 500,
    mesesPagados: 1,
    metodoPago: 'EFECTIVO',
    plan: 'Mensualidad Normal'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'monto' || name === 'mesesPagados' ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await PagoService.procesarPago({
        idSocio: socioId,
        ...formData
      });

      if (response.success) {
        toast.success(response.message);
        onPagoExitoso?.(response.data.nuevaFechaFin);
        setTimeout(() => onClose(), 1500);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 text-indigo-600">
              <CreditCard size={32} />
            </div>
            <h2 className="text-2xl font-bakbak text-black uppercase">Procesar Pago</h2>
            <p className="text-gray-500 font-medium mt-1">Registrando pago para: <span className="text-indigo-600 font-bold">{socioNombre}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Monto ($)</label>
                <input
                  type="number"
                  name="monto"
                  value={formData.monto}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Meses</label>
                <input
                  type="number"
                  name="mesesPagados"
                  value={formData.mesesPagados}
                  onChange={handleChange}
                  min="1"
                  className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg text-center"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Plan / Concepto</label>
              <input
                type="text"
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                placeholder="Ej. Mensualidad Normal"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Método de Pago</label>
              <div className="grid grid-cols-3 gap-3">
                {(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA'] as const).map((metodo) => (
                  <button
                    key={metodo}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, metodoPago: metodo }))}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-1 ${
                      formData.metodoPago === metodo 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600' 
                        : 'border-gray-50 bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    {metodo === 'EFECTIVO' && <Banknote size={20} />}
                    {metodo === 'TARJETA' && <CreditCard size={20} />}
                    {metodo === 'TRANSFERENCIA' && <Landmark size={20} />}
                    <span className="text-[10px] font-bold uppercase">{metodo.slice(0, 4)}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-black text-white rounded-2xl font-bakbak text-lg shadow-xl hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  PROCESANDO...
                </>
              ) : (
                <>
                  <CheckCircle2 size={24} />
                  CONFIRMAR PAGO
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
