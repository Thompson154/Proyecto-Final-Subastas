import { CardUserComponent } from "../components/CardUserComponent";
import { WavyBackground } from "../components/ui/wavy-background";
import { useUsers } from "../hooks/usersHook";

const UsersPage = () => {
  const { users, updateUser, deleteUser } = useUsers();
  return (
    <div className="relative min-h-screen bg-black text-white cardContainer-main">
      <div className="z-10 max-w-7xl mx-auto px-6 py-12 space-y-20">
        <CardUserComponent
          users={users}
          onEdit={updateUser}
          onDelete={deleteUser}
        />
      </div>
    </div>
  );
};

export default UsersPage;
