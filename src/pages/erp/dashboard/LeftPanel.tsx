import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import SearchBar from '../../../components/SearchBar';
import UserCard from '../../../components/UserCard';
import ReportSection from './ReportSection';
import peopleImage from '../../../assets/people.png';
import { UserService, type User } from '../../../services/user.service';
import { AltaUsuario } from './Alta';

interface LeftPanelProps {
  inscritos: number;
  sinPagar: number;
  onSearch: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ inscritos, sinPagar, onSearch }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await UserService.getAll();
      setUsers(data);
      setAllUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setUsers(allUsers);
      return;
    }

    setLoading(true);
    try {
      const results = await UserService.search(searchTerm);
      setUsers(results);
    } catch (error) {
      console.error("Error buscando usuarios:", error);
      setError("Error en la búsqueda");
    } finally {
      setLoading(false);
    }
  };


  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-1 flex-col bg-white p-6 md:p-8 gap-8 rounded-3xl shadow-sm border border-gray-200">
      <div className="flex flex-col items-start self-stretch gap-1">
        <span className="text-black text-[40px] leading-tight font-bakbak">FITGYM</span>
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-gray-400" />
          <span className="text-gray-500 text-xl font-inter font-semibold">
            San Javier, Pachuca
          </span>
        </div>
      </div>

      <div className="flex flex-col self-stretch gap-6">
        <div className="flex flex-col self-stretch gap-6">
          <SearchBar onSearch={handleSearch} />
          <div className="w-full h-[1px] bg-gray-100" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
          {users.map((user, index) => (
            <UserCard
              key={user.id}
              index={index}
              name={user.name + " " + user.lastName}
              controlNumber={user.noControl}
              imageUrl={peopleImage}
            />
          ))}
        </div>
      </div>

      <ReportSection inscritos={inscritos} sinPagar={sinPagar} />
    </div>
  );
};

export default LeftPanel;
