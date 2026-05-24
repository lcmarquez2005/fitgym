import { useEffect, useState } from 'react';
import { InventarioService } from '../../../services/inventario.service';
import { Building2 } from 'lucide-react';

export default function ProveedoresPage() {
    const [proveedores, setProveedores] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const [nombre, setNombre] = useState('');
    const [rfc, setRfc] = useState('');
    const [contacto, setContacto] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [tipoProveedor, setTipoProveedor] = useState('NACIONAL');

    const cargarDatos = async () => {
        setLoading(true);
        const res = await InventarioService.getProveedores();
        if (res.success) setProveedores(res.data);
        setLoading(false);
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await InventarioService.crearProveedor({
            nombre, rfc, contacto, telefono, email, tipoProveedor
        });
        setMsg(res.message);
        if (res.success) {
            setNombre(''); setRfc(''); setContacto(''); setTelefono(''); setEmail('');
            cargarDatos();
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Building2 className="text-[#606DE5]" size={22} />
                Directorio de Proveedores
            </h2>
            {msg && <div className="p-3 bg-blue-50 text-blue-800 rounded">{msg}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="font-bold mb-4">Nuevo Proveedor</h3>
                    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                        <div>
                            <label className="block text-gray-600 mb-1">Nombre / Razón Social</label>
                            <input required className="w-full border p-2 rounded" value={nombre} onChange={e => setNombre(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">RFC</label>
                            <input className="w-full border p-2 rounded uppercase" value={rfc} onChange={e => setRfc(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Nombre de Contacto</label>
                            <input className="w-full border p-2 rounded" value={contacto} onChange={e => setContacto(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 mb-1">Teléfono</label>
                                <input className="w-full border p-2 rounded" value={telefono} onChange={e => setTelefono(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Tipo</label>
                                <select className="w-full border p-2 rounded" value={tipoProveedor} onChange={e => setTipoProveedor(e.target.value)}>
                                    <option value="NACIONAL">Nacional</option>
                                    <option value="EXTRANJERO">Extranjero</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Email</label>
                            <input type="email" className="w-full border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Guardar Proveedor</button>
                    </form>
                </div>

                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-4 bg-gray-50 border-b">
                        <h3 className="font-bold">Proveedores Registrados</h3>
                    </div>
                    {loading ? <p className="p-4">Cargando...</p> : (
                        <div className="divide-y">
                            {proveedores.map(prov => (
                                <div key={prov.id} className="p-4 flex flex-col md:flex-row justify-between hover:bg-gray-50">
                                    <div>
                                        <p className="font-bold text-gray-900">{prov.nombre}</p>
                                        <p className="text-sm text-gray-500">RFC: {prov.rfc || 'N/A'}</p>
                                        <p className="text-sm text-gray-500">Contacto: {prov.contacto} | {prov.telefono} | {prov.email}</p>
                                    </div>
                                    <div className="mt-2 md:mt-0">
                                        <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded">
                                            {prov.tipoProveedor}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
