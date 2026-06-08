import clsx from "clsx";
import React, { useEffect, useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import Title from "../components/Title";
import Button from "../components/Button";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import ConfirmatioDialog from "../components/Dialogs";
import { toast } from "sonner";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  normal: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const [tasks, setTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");

  const fetchTrashedTasks = async () => {
    try {
      const res = await fetch("http://localhost:8800/api/task?isTrashed=true", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Unable to load trash");
        return;
      }

      setTasks(data.tasks || []);
    } catch (error) {
      console.log(error);
      toast.error("Server not connected");
    }
  };

  useEffect(() => {
    fetchTrashedTasks();
  }, []);

  const deleteAllClick = () => {
    setType("deleteAll");
    setSelected("");
    setMsg("Do you want to permanently delete all items?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setSelected("");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
  };

  const deleteClick = (id) => {
    setType("delete");
    setSelected(id);
    setMsg("Do you want to permanently delete this task?");
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setSelected(id);
    setType("restore");
    setMsg("Do you want to restore the selected task?");
    setOpenDialog(true);
  };

  const deleteRestoreHandler = async () => {
    try {
      let url = "http://localhost:8800/api/task/delete-restore";

      if (type === "delete" || type === "restore") {
        url = `http://localhost:8800/api/task/delete-restore/${selected}?actionType=${type}`;
      }

      if (type === "deleteAll" || type === "restoreAll") {
        url = `http://localhost:8800/api/task/delete-restore?actionType=${type}`;
      }

      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Operation failed");
        return;
      }

      toast.success(data.message || "Operation completed");
      setOpenDialog(false);
      setMsg(null);
      setSelected("");
      fetchTrashedTasks();
    } catch (error) {
      console.log(error);
      toast.error("Server not connected");
    }
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2'>Stage</th>
        <th className='py-2 line-clamp-1'>Modified On</th>
        <th className='py-2 text-right'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-2'>
          <div
            className={clsx(
              "w-4 h-4 rounded-full",
              TASK_TYPE[item?.stage] || "bg-gray-400"
            )}
          />
          <p className='w-full line-clamp-2 text-base text-black'>
            {item?.title || "Untitled Task"}
          </p>
        </div>
      </td>

      <td className='py-2 capitalize'>
        <div className='flex gap-1 items-center'>
          <span
            className={clsx(
              "text-lg",
              PRIOTITYSTYELS[item?.priority] || "text-gray-600"
            )}
          >
            {ICONS[item?.priority] || <MdKeyboardArrowDown />}
          </span>
          <span>{item?.priority || "normal"}</span>
        </div>
      </td>

      <td className='py-2 capitalize text-center md:text-start'>
        {item?.stage || "todo"}
      </td>

      <td className='py-2 text-sm'>
        {item?.updatedAt
          ? new Date(item.updatedAt).toDateString()
          : new Date(item?.date).toDateString()}
      </td>

      <td className='py-2 flex gap-1 justify-end'>
        <Button
          icon={<MdOutlineRestore className='text-xl text-gray-500' />}
          onClick={() => restoreClick(item._id)}
        />
        <Button
          icon={<MdDelete className='text-xl text-red-600' />}
          onClick={() => deleteClick(item._id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='Trashed Tasks' />

          <div className='flex gap-2 md:gap-4 items-center'>
            <Button
              label='Restore All'
              icon={<MdOutlineRestore className='text-lg hidden md:flex' />}
              className='flex flex-row-reverse gap-1 items-center text-black text-sm md:text-base rounded-md 2xl:py-2.5'
              onClick={restoreAllClick}
            />

            <Button
              label='Delete All'
              icon={<MdDelete className='text-lg hidden md:flex' />}
              className='flex flex-row-reverse gap-1 items-center text-red-600 text-sm md:text-base rounded-md 2xl:py-2.5'
              onClick={deleteAllClick}
            />
          </div>
        </div>

        <div className='bg-white px-2 md:px-6 py-4 shadow-md rounded'>
          <div className='overflow-x-auto'>
            <table className='w-full mb-5'>
              <TableHeader />
              <tbody>
                {tasks?.map((task) => (
                  <TableRow key={task._id} item={task} />
                ))}
              </tbody>
            </table>

            {tasks.length === 0 && (
              <p className='text-center text-gray-500 py-5'>
                No trashed tasks found.
              </p>
            )}
          </div>
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={deleteRestoreHandler}
      />
    </>
  );
};

export default Trash;