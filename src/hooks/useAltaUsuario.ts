import { useState } from "react";

export const useAltaUsuario = (onClose: () => void, onUserCreated?: (userData: any) => void) => {
  const [formData, setFormData] = useState({
    username: "",
    membershipMonths: 1,
    photoFile: null as File | null,
    photoPreview: null as string | null,
    fingerprintCaptured: false,
  });
  
  const [isCapturingFingerprint, setIsCapturingFingerprint] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleFingerprintCapture = () => {
    setIsCapturingFingerprint(true);
    setTimeout(() => {
      updateField("fingerprintCaptured", true);
      setIsCapturingFingerprint(false);
    }, 2000);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) newErrors.username = "Requerido";
    if (!formData.photoFile) newErrors.photo = "Foto requerida";
    if (!formData.fingerprintCaptured) newErrors.fingerprint = "Huella requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onUserCreated?.({ ...formData, fechaRegistro: new Date().toISOString() });
      onClose();
    }
  };

  return { formData, errors, isCapturingFingerprint, updateField, handleFingerprintCapture, handleSubmit };
};