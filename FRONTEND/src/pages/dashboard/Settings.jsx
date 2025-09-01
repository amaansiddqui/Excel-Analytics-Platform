import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Lock, Trash } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const { user, fetchUserData, updateUser, deleteAccount, loading } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!user) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  useEffect(() => {
    if (user) {
      setValue("name", user.name || ""); 
      setValue("email", user.email || ""); 
    }
  }, [user, setValue]);

  const onSubmit = (data) => {
    updateUser(data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <p className="text-center text-gray-600 text-2xl font-medium animate-pulse">
          Loading Account Settings...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center">
      <div className="bg-white w-full max-w-5xl p-6 sm:p-8 shadow-xl rounded-2xl flex flex-col md:flex-row gap-8">
        <div className="flex-1 order-2 md:order-1">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-6 border-b pb-3 border-blue-100">
            Account Settings
          </h1>

          <div className="flex justify-center md:justify-start mb-6">
            <div className="bg-blue-100 p-5 rounded-full shadow-inner">
              <User size={64} className="text-blue-600" />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm sm:text-base font-semibold text-blue-800 mb-2 flex items-center">
                <User className="mr-3 text-blue-600" size={18} /> Name:
              </label>
              <input
                {...register("name")}
                type="text"
                className="w-full p-3 border border-blue-300 rounded-lg bg-blue-50 text-gray-800 cursor-not-allowed
                           focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm sm:text-base font-semibold text-blue-800 mb-2 flex items-center">
                <Mail className="mr-3 text-blue-600" size={18} /> Email:
              </label>
              <input
                {...register("email")}
                type="email"
                readOnly 
                className="w-full p-3 border border-blue-300 rounded-lg bg-blue-50 text-gray-800 cursor-not-allowed
                           focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm sm:text-base font-semibold text-blue-800 mb-2 flex items-center">
                <Lock className="mr-3 text-blue-600" size={18} /> New Password:
              </label>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                type="password"
                placeholder="Enter new password"
                className="w-full p-3 border border-blue-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 mt-6 bg-blue-600 text-white font-bold rounded-lg shadow-md
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         transition duration-250 ease-in-out transform hover:scale-105"
            >
              Save Changes
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-red-700 mb-4">
              Danger Zone
            </h2>
            <p className="text-sm text-red-600 mb-4">
              If you delete your account, you will permanently lose access to
              your data and this action cannot be undone.
            </p>
            <button
              onClick={deleteAccount}
              className="w-full md:w-auto px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md
                         hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                         transition duration-250 ease-in-out transform hover:scale-105"
            >
              <Trash className="inline-block mr-2" size={18} /> Delete Account
            </button>
          </div>
        </div>

        <div className="flex-1 md:pl-8 md:border-l border-gray-200 order-1 md:order-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-100">
            Security Tips
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2 text-base">
            <li>
              Use a **strong, unique password** with a mix of letters, numbers,
              and symbols.
            </li>
            <li>
              Regularly **update your password** to keep your account secure.
            </li>
            <li>
              Enable **two-factor authentication** (2FA) if available for added
              security.
            </li>
            <li>Be cautious of **phishing attempts** and suspicious emails.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4 border-b pb-2 border-gray-100">
            Notifications
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            You will receive important email updates about changes to your
            account settings, security alerts, and service announcements. Please
            ensure your email is up-to-date.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
