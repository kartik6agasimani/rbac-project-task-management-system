import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import { toast } from "sonner";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, refetchTasks }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [team, setTeam] = useState([]);
  const [stage, setStage] = useState(LISTS[0]);
  const [priority, setPriority] = useState(PRIORIRY[2]);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const submitHandler = async (data) => {
    try {
      if (!team || team.length === 0) {
        toast.error("Please assign task to at least one user");
        return;
      }

      const payload = {
        title: data.title,
        team,
        stage,
        date: data.date,
        priority,
        assets: [],
      };

      const res = await fetch("http://localhost:8800/api/task/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Task creation failed");
        return;
      }

      toast.success("Task created successfully");
      setOpen(false);

      if (refetchTasks) {
        refetchTasks();
      }
    } catch (error) {
      console.log(error);
      toast.error("Server not connected");
    }
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Dialog.Title
          as='h2'
          className='text-base font-bold leading-6 text-gray-900 mb-4'
        >
          ADD TASK
        </Dialog.Title>

        <div className='mt-2 flex flex-col gap-6'>
          <Textbox
            placeholder='Task Title'
            type='text'
            name='title'
            label='Task Title'
            className='w-full rounded'
            register={register("title", { required: "Title is required" })}
            error={errors.title ? errors.title.message : ""}
          />

          <UserList setTeam={setTeam} team={team} />

          <div className='flex gap-4'>
            <SelectList
              label='Task Stage'
              lists={LISTS}
              selected={stage}
              setSelected={setStage}
            />

            <div className='w-full'>
              <Textbox
                placeholder='Date'
                type='date'
                name='date'
                label='Task Date'
                className='w-full rounded'
                register={register("date", {
                  required: "Date is required!",
                })}
                error={errors.date ? errors.date.message : ""}
              />
            </div>
          </div>

          <div className='flex gap-4'>
            <SelectList
              label='Priority Level'
              lists={PRIORIRY}
              selected={priority}
              setSelected={setPriority}
            />

            <div className='w-full flex items-center justify-center mt-4'>
              <label
                className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4'
                htmlFor='imgUpload'
              >
                <input
                  type='file'
                  className='hidden'
                  id='imgUpload'
                  onChange={handleSelect}
                  accept='.jpg, .png, .jpeg'
                  multiple={true}
                />
                <BiImages />
                <span>Add Assets</span>
              </label>
            </div>
          </div>

          <div className='bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4'>
            {uploading ? (
              <span className='text-sm py-2 text-red-500'>
                Uploading assets
              </span>
            ) : (
              <button
                type='submit'
                className='bg-blue-600 px-8 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto rounded'
              >
                Submit
              </button>
            )}

            <button
              type='button'
              className='bg-white px-5 py-2 text-sm font-semibold text-gray-900 sm:w-auto rounded border'
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;