import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import clsx from "clsx";
import ConfirmatioDialog, { UserAction } from "../components/Dialogs";
import AddUser from "../components/AddUser";
import { toast } from "sonner";

const safeInitials = (name) => {
  if (!name || typeof name !== "string") return "U";

  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (
    parts[0].charAt(0).toUpperCase() +
    parts[1].charAt(0).toUpperCase()
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8800/api/user/get-team", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Unable to load users");
        return;
      }

      if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray(data.users)) {
        setUsers(data.users);
      } else if (Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Server not connected");
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const userActionHandler = async () => {
    if (!selected?._id) return;

    try {
      const res = await fetch(`http://localhost:8800/api/user/${selected._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ isActive: !selected.isActive }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Action failed");
        return;
      }

      toast.success(data.message || "User updated");
      setOpenAction(false);
      setSelected(null);
      fetchUsers();
    } catch (error) {
      console.log(error);
      toast.error("Server not connected");
    }
  };

  const deleteHandler = async () => {
    if (!selected) return;

    try {
      const res = await fetch(`http://localhost:8800/api/user/${selected}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Delete failed");
        return;
      }

      toast.success(data.message || "User deleted");
      setOpenDialog(false);
      setSelected(null);
      fetchUsers();
    } catch (error) {
      console.log(error);
      toast.error("Server not connected");
    }
  };

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (user) => {
    setSelected(user);
    setOpen(true);
  };

  const userStatusClick = (user) => {
    setSelected(user);
    setOpenAction(true);
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2'>Title</th>
        <th className='py-2'>Email</th>
        <th className='py-2'>Role</th>
        <th className='py-2'>Active</th>
        <th className='py-2 text-right'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => {
    const displayName = user?.name || "User";

    return (
      <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
        <td className='p-2'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700'>
              <span className='text-xs md:text-sm text-center'>
                {safeInitials(displayName)}
              </span>
            </div>
            {displayName}
          </div>
        </td>

        <td className='p-2'>{user?.title || "Not Added"}</td>
        <td className='p-2'>{user?.email || "Not Added"}</td>
        <td className='p-2'>{user?.role || "Employee"}</td>

        <td className='p-2'>
          <button
            type='button'
            onClick={() => userStatusClick(user)}
            className={clsx(
              "w-fit px-4 py-1 rounded-full",
              user?.isActive ? "bg-blue-200" : "bg-yellow-100"
            )}
          >
            {user?.isActive ? "Active" : "Disabled"}
          </button>
        </td>

        <td className='p-2 flex gap-4 justify-end'>
          <Button
            className='text-blue-600 hover:text-blue-500 font-semibold sm:px-0'
            label='Edit'
            type='button'
            onClick={() => editClick(user)}
          />

          <Button
            className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
            label='Delete'
            type='button'
            onClick={() => deleteClick(user?._id)}
          />
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='Team Members' />

          <Button
            label='Add New User'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5'
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
          />
        </div>

        <div className='bg-white px-2 md:px-4 py-4 shadow-md rounded'>
          <div className='overflow-x-auto'>
            <table className='w-full mb-5'>
              <TableHeader />
              <tbody>
                {Array.isArray(users) &&
                  users.map((user, index) => (
                    <TableRow key={user?._id || index} user={user} />
                  ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <p className='text-center text-gray-500 py-5'>
                No users found. Click Add New User.
              </p>
            )}
          </div>
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        refetchUsers={fetchUsers}
        key={selected?._id || "new-user"}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </>
  );
};

export default Users;