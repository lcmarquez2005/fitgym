import React, { useState, useEffect } from "react";
import Navbar from "@layout/Navbar";
import Footer from "@layout/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";
import CheckoutSummary from "./CheckoutSummary";
import { useAuth } from "@context/AuthContext";
import { SocioService } from "@services/socio.service";
import { PagoService } from "@services/pago.service";
import { toast } from "sonner";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const fallbackPlan = { id: 0, nombre: "Mensualidad Regular", precio: 500, duracionMeses: 1, beneficios: [] as string[] };
  const plan = location.state?.plan || fallbackPlan;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    cvv: "",
    expiry: ""
  });

  // Pre-cargar datos del usuario logueado
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePay = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.warning("Debe iniciar sesión para completar la suscripción.");
      navigate('/login', { state: { planPendingSelection: plan } });
      return;
    }

    if (!formData.cardNumber || !formData.cvv || !formData.expiry) {
      toast.warning("Por favor complete los detalles de la tarjeta.");
      return;
    }

    setLoading(true);

    try {
      let socioRecordId: string | number = '';

      if (user.rol === 'SOCIO') {
        // Buscar el ID del socio real existente en la base de datos
        try {
          const socios = await SocioService.buscar(user.email || '');
          const matchingSocio = socios.find(s => s.usuarioId === user.id || s.email === user.email);
          if (matchingSocio) {
            socioRecordId = matchingSocio.id;
          } else {
            socioRecordId = user.id.toString();
          }
        } catch (err) {
          console.error("Error buscando socio:", err);
          socioRecordId = user.id.toString();
        }
      } else {
        // El usuario tiene rol "USER" o similar y necesita ser ascendido a socio
        try {
          const fechaFin = new Date(Date.now() + plan.duracionMeses * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          const ascendResponse = await SocioService.ascenderASocio({
            idSocio: "PENDIENTE",
            nombreCompleto: user.name,
            email: user.email,
            tipoMembresia: plan.nombre,
            costoMensual: plan.precio.toString(),
            fechaInicio: new Date().toISOString().split('T')[0],
            fechaFin: fechaFin,
            estatus: 'ACTIVO'
          });

          if (ascendResponse.success && ascendResponse.data) {
            socioRecordId = ascendResponse.data.id;
            toast.success("¡Tu cuenta ha sido vinculada como Socio del Gimnasio!");
          } else {
            throw new Error(ascendResponse.message || "Error al vincular el perfil de socio");
          }
        } catch (err: any) {
          console.error("Error en ascenso a socio:", err);
          toast.error(err.message || "No se pudo realizar la vinculación del socio.");
          setLoading(false);
          return;
        }
      }

      // Procesar el pago de la membresía
      const resPago = await PagoService.procesarPago({
        idSocio: socioRecordId,
        monto: plan.precio,
        mesesPagados: plan.duracionMeses,
        metodoPago: 'TARJETA',
        plan: plan.nombre
      });

      if (resPago.success) {
        toast.success("¡Pago procesado exitosamente!");
        navigate('/ticket', {
          state: {
            paymentDetails: {
              pagoId: resPago.data.pagoId,
              planName: plan.nombre,
              monto: plan.precio,
              nuevaFechaFin: resPago.data.nuevaFechaFin,
              socio: resPago.data.socio
            }
          }
        });
      } else {
        toast.error(resPago.message || "Error al procesar el pago");
      }
    } catch (error: any) {
      console.error("Error al procesar checkout:", error);
      toast.error(error.message || "Error al completar el checkout de pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8FE]">
      <Navbar />
      <div className="container mx-auto px-4 py-10 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          <CheckoutForm formData={formData} handleChange={handleChange} />
          <CheckoutSummary 
            monto={plan.precio} 
            planName={plan.nombre} 
            loading={loading} 
            handlePay={handlePay} 
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
