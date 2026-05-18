import { useState } from 'react';
import { UserService, type UserPost } from '@services/user.service';
import { BASE_URL } from '@services/api.config';
import { toast } from 'sonner';

interface UseAltaUsuarioProps {
  onClose: () => void;
  onUserCreated?: (data: any) => void;
}

export const useAltaUsuario = ({ onClose, onUserCreated }: UseAltaUsuarioProps) => {
  const [formData, setFormData] = useState<UserPost>({
    name: '',
    lastName: '',
    noControl: '',
    email: '',
    fotoPerfil: '',
    huellaDigital: '',
    rol: 'CLIENTE'
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
    if (!formData.email.trim()) newErrors.email = 'Email requerido';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.huellaDigital) newErrors.huellaDigital = 'Falta huella digital';

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
      toast.success('Fingerprint captured successfully');
    } catch (error) {
      console.error('Fingerprint error:', error);
      setErrors(prev => ({ ...prev, huellaDigital: 'Error capturando huella' }));
      toast.error('Failed to capture fingerprint');
    } finally {
      setIsCapturingFingerprint(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, fotoPerfil: 'Máximo 5MB' }));
      toast.warning('Image exceeds 5MB limit');
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
      toast.success('Photo uploaded successfully');
      setErrors(prev => {
        const { fotoPerfil: _, ...rest } = prev;
        return rest;
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      setErrors(prev => ({ ...prev, fotoPerfil: error.message }));
      toast.error(error.message || 'Failed to upload photo');
      setFormData(prev => ({ ...prev, fotoPerfil: '' }));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const response = await UserService.create(formData);
      if (response.success) {
        toast.success(response.message || 'Member registered successfully');
        onUserCreated?.(response.data);
        setTimeout(() => onClose(), 1500);
      } else {
        toast.error(response.message || 'Failed to register member');
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Connection error');
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
