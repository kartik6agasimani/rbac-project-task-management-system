import React from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { toast } from "sonner";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../../utils";
import clsx from "clsx";
import { FaList } from "react-icons/fa";
import UserInfo from "../UserInfo";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  normal: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ tasks, refetchTasks }) => {
  const deleteTask = async (id) => {
    if (!id) {
      toast.error("Task ID missing");
      return;
    }

    const confirmDelete = window.confirm(
      "Do you want to move this task to trash?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8800/api/task/${id}`, {
        method: "PUT",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Delete failed");
        return;
      }

      toast.success("Task moved to trash successfully");

      if (refetchTasks) {
        refetchTasks();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Server not connected");
    }
  };

  const TableHeader = () => (
    <thead className='w-full border-b border-gray-300'>
      <tr className='w-full text-black text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2'>Created At</th>
        <th className='py-2'>Assets</th>
        <th className='py-2'>Team</th>
        <th className='py-2 text-right'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-300/10'>
      <td className='py-2'>
        <div className='flex items-center gap-2'>
          <div
            className={clsx(
              "w-4 h-4 rounded-full",
              TASK_TYPE[task?.stage] || "bg-gray-400"
            )}
          />
          <p className='w-full line-clamp-2 text-base text-black'>
            {task?.title || "Untitled Task"}
          </p>
        </div>
      </td>

      <td className='py-2'>
        <div className='flex gap-1 items-center'>
          <span
            className={clsx(
              "text-lg",
              PRIOTITYSTYELS[task?.priority] || "text-gray-600"
            )}
          >
            {ICONS[task?.priority] || <MdKeyboardArrowDown />}
          </span>
          <span className='capitalize'>
            {task?.priority || "normal"} Priority
          </span>
        </div>
      </td>

      <td className='py-2'>
        <span className='text-sm text-gray-600'>
          {task?.date ? formatDate(new Date(task.date)) : "No Date"}
        </span>
      </td>

      <td className='py-2'>
        <div className='flex items-center gap-3'>
          <div className='flex gap-1 items-center text-sm text-gray-600'>
            <BiMessageAltDetail />
            <span>{task?.activities?.length || 0}</span>
          </div>

          <div className='flex gap-1 items-center text-sm text-gray-600'>
            <MdAttachFile />
            <span>{task?.assets?.length || 0}</span>
          </div>

          <div className='flex gap-1 items-center text-sm text-gray-600'>
            <FaList />
            <span>0/{task?.subTasks?.length || 0}</span>
          </div>
        </div>
      </td>

      <td className='py-2'>
        <div className='flex'>
          {task?.team?.map((m, index) => (
            <div
              key={m?._id || index}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[index % BGS.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>

      <td className='py-2 text-right'>
        <button
          type='button'
          onClick={() => deleteTask(task?._id)}
          className='text-red-700 hover:text-red-500 font-semibold'
        >
          Delete
        </button>
      </td>
    </tr>
  );

  return (
    <div className='bg-white px-2 md:px-4 pt-4 pb-9 shadow-md rounded'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <TableHeader />
          <tbody>
            {tasks?.map((task) => (
              <TableRow key={task._id} task={task} />
            ))}
          </tbody>
        </table>

        {tasks?.length === 0 && (
          <p className='text-center text-gray-500 py-6'>No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default Table;