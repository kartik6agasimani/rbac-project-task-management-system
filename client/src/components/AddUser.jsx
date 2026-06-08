import React from "react";
import { useForm } from "react-hook-form";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import { toast } from "sonner";

const AddUser = ({ open, setOpen, userData, refetchUsers }) => {
  const defaultValues = userData?._id
    ? userData
    : {
        name: "",
        title: "",
        email: "",
        role: "Employee",
        password: "123456",
      };

  const isLoading = false;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const handleOnSubmit = async (data) => {
    try {
      let url = "http://localhost:8800/api/user/register";
      let method = "POST";

      let bodyData = {
        name: data.name,
        title: data.title,
        email: data.email,
        role: data.role,
        password: data.password || "123456",
        isAdmin: data.role?.toLowerCase() === "admin",
      };

      if (userData?._id) {
        url = "http://localhost:8800/api/user/profile";
        method = "PUT";
        bodyData = {
          _id: userData._id,
          name: data.name,
          title: data.title,
          role: data.role,
        };
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Something went wrong");
        return;
      }

      toast.success(userData?._id ? "User updated" : "User added");
      setOpen(false);

      if (refetchUsers) {
        refetchUsers();
      }
    } catch (error) {
      console.log(error);
      toast.error("Server not connected");
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Dialog.Title
          as='h2'
          className='text-base font-bold leading-6 text-gray-900 mb-4'
        >
          {userData?._id ? "UPDATE PROFILE" : "ADD NEW USER"}
        </Dialog.Title>

        <div className='mt-2 flex flex-col gap-6'>
          <Textbox
            placeholder='Full name'
            type='text'
            name='name'
            label='Full Name'
            className='w-full rounded'
            register={register("name", {
              required: "Full name is required!",
            })}
            error={errors.name ? errors.name.message : ""}
          />

          <Textbox
            placeholder='Title'
            type='text'
            name='title'
            label='Title'
            className='w-full rounded'
            register={register("title", {
              required: "Title is required!",
            })}
            error={errors.title ? errors.title.message : ""}
          />

          <Textbox
            placeholder='Email Address'
            type='email'
            name='email'
            label='Email Address'
            className='w-full rounded'
            register={register("email", {
              required: "Email Address is required!",
            })}
            error={errors.email ? errors.email.message : ""}
          />

          {!userData?._id && (
            <Textbox
              placeholder='Password'
              type='password'
              name='password'
              label='Password'
              className='w-full rounded'
              register={register("password", {
                required: "Password is required!",
              })}
              error={errors.password ? errors.password.message : ""}
            />
          )}

          <Textbox
            placeholder='Admin / Project Manager / Employee'
            type='text'
            name='role'
            label='Role'
            className='w-full rounded'
            register={register("role", {
              required: "User role is required!",
            })}
            error={errors.role ? errors.role.message : ""}
          />
        </div>

        {isLoading ? (
          <div className='py-5'>
            <Loading />
          </div>
        ) : (
          <div className='py-3 mt-4 sm:flex sm:flex-row-reverse gap-4'>
            <button
              type='submit'
              className='bg-blue-600 px-8 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto rounded'
            >
              Submit
            </button>

            <button
              type='button'
              className='bg-white px-5 py-2 text-sm font-semibold text-gray-900 sm:w-auto rounded border'
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};

export default AddUser;