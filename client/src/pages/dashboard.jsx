import React, { useEffect, useState } from "react";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { LuClipboardEdit } from "react-icons/lu";
import { FaNewspaper, FaUsers } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import clsx from "clsx";
import { Chart } from "../components/Chart";
import { BGS, PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import UserInfo from "../components/UserInfo";
import { toast } from "sonner";

const getSafeInitials = (name = "User") => {
  if (!name || typeof name !== "string") return "U";

  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
};

const TaskTable = ({ tasks }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    normal: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2'>Team</th>
        <th className='py-2 hidden md:block'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className='border-b border-gray-300 text-gray-600 hover:bg-gray-300/10'>
      <td className='py-2'>
        <div className='flex items-center gap-2'>
          <div
            className={clsx(
              "w-4 h-4 rounded-full",
              TASK_TYPE[task?.stage] || "bg-gray-400"
            )}
          />

          <p className='text-base text-black'>
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
          <span className='capitalize'>{task?.priority || "normal"}</span>
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

      <td className='py-2 hidden md:block'>
        <span className='text-base text-gray-600'>
          {task?.date ? moment(task.date).fromNow() : "No date"}
        </span>
      </td>
    </tr>
  );

  return (
    <div className='w-full md:w-2/3 bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded'>
      <h4 className='text-xl text-gray-600 font-semibold mb-3'>
        Recent Tasks
      </h4>

      <table className='w-full'>
        <TableHeader />
        <tbody>
          {tasks?.map((task, id) => (
            <TableRow key={task?._id || id} task={task} />
          ))}
        </tbody>
      </table>

      {tasks?.length === 0 && (
        <p className='text-center text-gray-500 py-5'>No recent tasks found.</p>
      )}
    </div>
  );
};

const UserTable = ({ users }) => {
  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2'>Status</th>
        <th className='py-2'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-700'>
            <span className='text-center'>{getSafeInitials(user?.name)}</span>
          </div>

          <div>
            <p>{user?.name || "User"}</p>
            <span className='text-xs text-black'>
              {user?.role || "Employee"}
            </span>
          </div>
        </div>
      </td>

      <td>
        <p
          className={clsx(
            "w-fit px-3 py-1 rounded-full text-sm",
            user?.isActive ? "bg-blue-200" : "bg-yellow-100"
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </p>
      </td>

      <td className='py-2 text-sm'>
        {user?.createdAt ? moment(user.createdAt).fromNow() : "Recently"}
      </td>
    </tr>
  );

  return (
    <div className='w-full md:w-1/3 bg-white h-fit px-2 md:px-6 py-4 shadow-md rounded'>
      <h4 className='text-xl text-gray-600 font-semibold mb-3'>
        Active Team Members
      </h4>

      <table className='w-full mb-5'>
        <TableHeader />
        <tbody>
          {users?.map((user, index) => (
            <TableRow key={user?._id || index} user={user} />
          ))}
        </tbody>
      </table>

      {users?.length === 0 && (
        <p className='text-center text-gray-500 py-5'>No users found.</p>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalTasks: 0,
    tasks: {},
    last10Task: [],
    users: [],
  });

  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8800/api/task/dashboard", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Unable to load dashboard");
        setLoading(false);
        return;
      }

      setDashboardData({
        totalTasks: data.totalTasks || 0,
        tasks: data.tasks || {},
        last10Task: data.last10Task || [],
        users: data.users || [],
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Server not connected");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const totals = dashboardData.tasks || {};

  const stats = [
    {
      _id: "1",
      label: "TOTAL TASKS",
      total: dashboardData.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-[#1d4ed8]",
    },
    {
      _id: "2",
      label: "COMPLETED TASKS",
      total: totals["completed"] || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-[#0f766e]",
    },
    {
      _id: "3",
      label: "TASKS IN PROGRESS",
      total: totals["in progress"] || 0,
      icon: <LuClipboardEdit />,
      bg: "bg-[#f59e0b]",
    },
    {
      _id: "4",
      label: "TODOS",
      total: totals["todo"] || 0,
      icon: <FaArrowsToDot />,
      bg: "bg-[#be185d]",
    },
  ];

  const Card = ({ label, count, bg, icon }) => {
    return (
      <div className='w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between'>
        <div className='h-full flex flex-1 flex-col justify-between'>
          <p className='text-base text-gray-600'>{label}</p>
          <span className='text-2xl font-semibold'>{count}</span>
          <span className='text-sm text-gray-400'>Live task data</span>
        </div>

        <div
          className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center text-white",
            bg
          )}
        >
          {icon}
        </div>
      </div>
    );
  };

  return (
    <div className='h-full py-4'>
      <div className='flex items-center justify-between mb-5'>
        <h2 className='text-2xl font-bold text-gray-800'>Dashboard</h2>

        <button
          type='button'
          onClick={fetchDashboard}
          className='px-4 py-2 bg-blue-600 text-white rounded-md'
        >
          Refresh
        </button>
      </div>

      {loading && (
        <p className='text-sm text-gray-500 mb-4'>Loading dashboard...</p>
      )}

      <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
        {stats.map(({ icon, bg, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>

      <div className='w-full bg-white my-16 p-4 rounded shadow-sm'>
        <h4 className='text-xl text-gray-600 font-semibold'>
          Chart by Priority
        </h4>
        <Chart />
      </div>

      <div className='w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8'>
        <TaskTable tasks={dashboardData.last10Task} />
        <UserTable users={dashboardData.users} />
      </div>
    </div>
  );
};

export default Dashboard;