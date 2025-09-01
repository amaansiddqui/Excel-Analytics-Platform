import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Card } from "../../components/Card";
import { BarChart3, Lock, ArrowLeft, Shield, Key, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await axios.post(
        `/api/auth/reset-password/${token}`, 
        { password: newPassword }
      );
      return response.data; 
    } catch (error) {
      throw error.response?.data || { message: 'Something went wrong' };
    }
  };

  const onSubmit = async (data) => {
    try {
      const result = await resetPassword(token, data.password);
      alert(result.message);

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      alert(err.message || "Password reset failed.");
      console.error("Password reset failed.", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md mx-auto">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white w-12 h-12 flex items-center justify-center rounded-xl shadow-lg">
                <BarChart3 size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Excel Analytics</h1>
            </div>
            
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-emerald-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
            <p className="text-gray-600">Enter your new password to complete the reset process</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    }
                  })}
                  className={`
                    block w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 
                    border border-gray-300 rounded-xl shadow-sm
                    bg-white/80 backdrop-blur-sm
                    transition-all duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                    hover:border-gray-400 hover:shadow-md
                    ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
                  `}
                  placeholder="Enter your new password"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold rounded-xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl focus:ring-emerald-500 active:scale-[0.98]"
            >
              <CheckCircle className="w-4 h-4" />
              Reset Password
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
