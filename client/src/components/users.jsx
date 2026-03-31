// import { useEffect } from "react";
// import { useState } from "react";
// import { getUsers } from "../api/notesApi";

function Users() {
  // const [users, setUsers] = useState([]);
{/*
  useEffect(() => {
    async function fetchData() {
      const { data } = await getUsers();
      setUsers(data);
    }
    fetchData();
  }, []);
*/}
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/*
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow duration-300"
          >
            <p className="text-lg font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        ))}
      */}
      </div>
    </div>
  );
}

export default Users;
