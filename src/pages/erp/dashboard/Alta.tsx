import React, { useState } from 'react';
import { UserService, type UserPost } from '../../../services/user.service';

export const AltaUsuario = () => {
  // Estado para el formulario
  const [formData, setFormData] = useState<UserPost>({
    name: '',
    lastName: '',
    noControl: '',
    fotoPerfil: '',
    huellaDigital: '',
    rol: 'CLIENTE' // Valor por defecto
  });

  const [loading, setLoading] = useState(false);

  // Manejador de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await UserService.create(formData);
      alert(response.message); // "Usuario guardado con éxito"
      // Aquí podrías limpiar el formulario o redirigir
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Registrar Nuevo Socio</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <input 
          name="name" 
          placeholder="Nombre" 
          onChange={handleChange} 
          className="border p-2 rounded" 
          required 
        />
        <input 
          name="lastName" 
          placeholder="Apellidos" 
          onChange={handleChange} 
          className="border p-2 rounded" 
          required 
        />
        <input 
          name="noControl" 
          placeholder="Núm. Control" 
          onChange={handleChange} 
          className="border p-2 rounded" 
          required 
        />
        <select name="rol" onChange={handleChange} className="border p-2 rounded">
          <option value="CLIENTE">Cliente</option>
          <option value="ADMIN">Administrador</option>
          <option value="COACH">Entrenador</option>
        </select>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? 'Guardando...' : 'Dar de Alta'}
      </button>
    </form>
  );
};