import { useState } from 'react';
import { UserService, type User, type UserPost } from '@services/user.service';
import { BASE_URL } from '@services/api.config';
import { toast } from 'sonner';

interface UseEditUsuarioProps {
  user: User;
  onClose: () => void;
  onUserUpdated?: (data: any) => void;
}

export const useEditUsuario = ({ user, onClose, onUserUpdated }: UseEditUsuarioProps) => {
  const [formData, setFormData] = useState<UserPost>({
    name: user.name,
    lastName: user.lastName,
    noControl: user.noControl,
    email: user.email || '', 
    fotoPerfil: user.fotoPerfil,
    huellaDigital: user.huellaDigital,
    rol: user.rol.toUpperCase(),
    token: null
  });

  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isCapturingFingerprint, setIsCapturingFingerprint] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getImageUrl = (path: string): string => {
    if (!path) return '';
    if (path.startsWith('data:image')) return path;
    if (path.startsWith('/uploads/')) {
      const host = BASE_URL.replace('/api', '');
      return `${host}${path}`;
    }
    return path;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nombre requerido';
    if (!formData.lastName.trim()) newErrors.lastName = 'Apellidos requeridos';
    if (!formData.noControl.trim()) newErrors.noControl = 'No. Control requerido';
    
    // El email podría ser opcional en edición si no se quiere cambiar
    // if (!formData.email.trim()) newErrors.email = 'Email requerido';
    // else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFingerprintCapture = async () => {
    setIsCapturingFingerprint(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormData(prev => ({
        ...prev,
        huellaDigital: `FP_${Date.now()}_${Math.random().toString(36).substring(7)}`
      }));
      toast.success('Nueva huella capturada exitosamente');
    } catch (error) {
      console.error('Fingerprint error:', error);
      setErrors(prev => ({ ...prev, huellaDigital: 'Error capturando huella' }));
      toast.error('Error al capturar la huella');
    } finally {
      setIsCapturingFingerprint(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, fotoPerfil: 'Máximo 5MB' }));
      toast.warning('La imagen excede el límite de 5MB');
      return;
    }

    setUploadingPhoto(true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, fotoPerfil: reader.result as string }));
    };
    reader.readAsDataURL(file);

    try {
      const data = await UserService.uploadPhoto(file);
      setFormData(prev => ({ ...prev, fotoPerfil: data.url }));
      toast.success('Foto subida exitosamente');
      setErrors(prev => {
        const { fotoPerfil: _, ...rest } = prev;
        return rest;
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      setErrors(prev => ({ ...prev, fotoPerfil: error.message }));
      toast.error(error.message || 'Error al subir la foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);

    try {
      const response = await UserService.update(user.id, formData);
      if (response.success) {
        toast.success(response.message || 'Usuario actualizado exitosamente');
        onUserUpdated?.(response.data);
        setTimeout(() => onClose(), 1000);
      } else {
        toast.error(response.message || 'Error al actualizar usuario');
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    uploadingPhoto,
    isCapturingFingerprint,
    errors,
    getImageUrl,
    handleChange,
    handleFingerprintCapture,
    handlePhotoUpload,
    handleSubmit
  };
};
