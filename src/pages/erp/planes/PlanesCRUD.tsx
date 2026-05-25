// src/pages/erp/planes/PlanesCRUD.tsx
import React, { useState, useEffect } from 'react';
import { Sidebar, Header } from '@/components';
import { PlanesService, type Plan } from '@services/planes.service';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { toast } from 'sonner';

const PlanesCRUD: React.FC = () => {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Omit<Plan, 'id'>>({
    nombre: '',
    descripcion: '',
    precio: 0,
    duracionMeses: 1,
    beneficios: [],
    activo: true
  });
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadPlanes();
  }, []);

  const loadPlanes = async () => {
    setLoading(true);
    const data = await PlanesService.getAll();
    setPlanes(data);
    setLoading(false);
  };

  const handleEditClick = (plan: Plan) => {
    setEditingId(plan.id);
    setEditFormData({
      nombre: plan.nombre,
      descripcion: plan.descripcion,
      precio: plan.precio,
      duracionMeses: plan.duracionMeses,
      beneficios: plan.beneficios || [],
      activo: plan.activo
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await PlanesService.update(id, editFormData);
      toast.success('Plan actualizado correctamente');
      setEditingId(null);
      loadPlanes();
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar');
    }
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await PlanesService.create(editFormData);
      toast.success('Plan creado exitosamente');
      setShowAddModal(false);
      setEditFormData({
        nombre: '',
        descripcion: '',
        precio: 0,
        duracionMeses: 1,
        beneficios: [],
        activo: true
      });
      loadPlanes();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este plan?')) {
      try {
        await PlanesService.delete(id);
        toast.success('Plan eliminado');
        loadPlanes();
      } catch (error: any) {
        toast.error(error.message || 'Error al eliminar');
      }
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...editFormData.beneficios];
    newFeatures[index] = value;
    setEditFormData({ ...editFormData, beneficios: newFeatures });
  };

  const addFeatureField = () => {
    setEditFormData({
      ...editFormData,
      beneficios: [...editFormData.beneficios, '']
    });
  };

  const removeFeatureField = (index: number) => {
    const newFeatures = editFormData.beneficios.filter((_, i) => i !== index);
    setEditFormData({ ...editFormData, beneficios: newFeatures });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <Sidebar />
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <div className="flex justify-between items-center mb-8 mt-12">
          <div>
            <h1 className="text-3xl font-bakbak text-black uppercase">Gestión de Planes</h1>
            <p className="text-gray-500">Administra los planes que ven los clientes en la landing page.</p>
          </div>
          <button 
            onClick={() => {
              setEditFormData({
                nombre: '',
                descripcion: '',
                precio: 0,
                duracionMeses: 1,
                beneficios: [''],
                activo: true
              });
              setShowAddModal(true);
            }}
            className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg active:scale-95 font-bold"
          >
            <Plus size={20} />
            NUEVO PLAN
          </button>
        </div>

        <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Plan</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Precio / Duración</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
                    <span className="text-gray-500 font-medium">Cargando catálogo...</span>
                  </td>
                </tr>
              ) : planes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-400 font-medium">
                    No se han configurado planes todavía.
                  </td>
                </tr>
              ) : (
                planes.map(plan => (
                  <tr key={plan.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-6">
                      {editingId === plan.id ? (
                        <input 
                          type="text" 
                          value={editFormData.nombre}
                          onChange={(e) => setEditFormData({...editFormData, nombre: e.target.value})}
                          className="w-full p-2 border-2 border-indigo-100 rounded-xl outline-none focus:border-indigo-500 font-bold"
                        />
                      ) : (
                        <div>
                          <p className="font-bold text-lg text-black">{plan.nombre}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{plan.descripcion}</p>
                        </div>
                      )}
                    </td>
                    <td className="p-6">
                      {editingId === plan.id ? (
                        <div className="flex gap-2 items-center">
                          <input 
                            type="number" 
                            value={editFormData.precio}
                            onChange={(e) => setEditFormData({...editFormData, precio: parseFloat(e.target.value)})}
                            className="w-24 p-2 border-2 border-indigo-100 rounded-xl"
                          />
                          <span className="text-gray-400">/</span>
                          <input 
                            type="number" 
                            value={editFormData.duracionMeses}
                            onChange={(e) => setEditFormData({...editFormData, duracionMeses: parseInt(e.target.value)})}
                            className="w-20 p-2 border-2 border-indigo-100 rounded-xl"
                          />
                          <span className="text-xs font-bold text-gray-400">MESES</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-green-600 font-bakbak text-lg">${plan.precio.toFixed(2)}</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-500 font-bold">{plan.duracionMeses} {plan.duracionMeses === 1 ? 'MES' : 'MESES'}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-6">
                      {editingId === plan.id ? (
                        <select 
                          value={editFormData.activo ? 'true' : 'false'}
                          onChange={(e) => setEditFormData({...editFormData, activo: e.target.value === 'true'})}
                          className="p-2 border-2 border-indigo-100 rounded-xl"
                        >
                          <option value="true">Activo</option>
                          <option value="false">Inactivo</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          plan.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {plan.activo ? 'Público' : 'Pausado'}
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        {editingId === plan.id ? (
                          <>
                            <button onClick={() => handleSaveEdit(plan.id)} className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all">
                              <Save size={18} />
                            </button>
                            <button onClick={handleCancelEdit} className="p-2 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-all">
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEditClick(plan)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                              <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDelete(plan.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all">
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Agregar */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bakbak text-black uppercase">Nuevo Plan</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-black transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddPlan} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nombre del Plan</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ej. Plan Pro"
                      value={editFormData.nombre}
                      onChange={(e) => setEditFormData({...editFormData, nombre: e.target.value})}
                      className="p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-black font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Precio (MXN)</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      placeholder="49.99"
                      value={editFormData.precio}
                      onChange={(e) => setEditFormData({...editFormData, precio: parseFloat(e.target.value)})}
                      className="p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-black font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Duración (Meses)</label>
                    <input 
                      required
                      type="number" 
                      placeholder="1"
                      value={editFormData.duracionMeses}
                      onChange={(e) => setEditFormData({...editFormData, duracionMeses: parseInt(e.target.value)})}
                      className="p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-black font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Estado Inicial</label>
                    <select 
                      value={editFormData.activo ? 'true' : 'false'}
                      onChange={(e) => setEditFormData({...editFormData, activo: e.target.value === 'true'})}
                      className="p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-black font-medium"
                    >
                      <option value="true">Activo (Público)</option>
                      <option value="false">Inactivo (Oculto)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Descripción</label>
                  <textarea 
                    required
                    placeholder="Describe brevemente el alcance del plan..."
                    value={editFormData.descripcion}
                    onChange={(e) => setEditFormData({...editFormData, descripcion: e.target.value})}
                    className="p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-black font-medium h-24 resize-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Características / Beneficios</label>
                    <button 
                      type="button" 
                      onClick={addFeatureField}
                      className="text-indigo-600 font-bold text-xs hover:underline flex items-center gap-1"
                    >
                      <Plus size={14} /> AÑADIR OTRO
                    </button>
                  </div>
                  <div className="space-y-3">
                    {editFormData.beneficios.map((feature, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          required
                          type="text"
                          placeholder={`Beneficio ${idx + 1}`}
                          value={feature}
                          onChange={(e) => handleFeatureChange(idx, e.target.value)}
                          className="flex-1 p-3 bg-gray-50 border-0 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-medium"
                        />
                        <button 
                          type="button"
                          onClick={() => removeFeatureField(idx)}
                          className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-black text-white rounded-2xl font-bakbak text-lg hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                  >
                    GUARDAR PLAN
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bakbak text-lg hover:bg-gray-200 transition-all"
                  >
                    CANCELAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanesCRUD;
