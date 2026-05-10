import React from "react";
import { useForm } from "react-hook-form";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Card } from "../../components/Card";
import { Button2 } from "../../components/Button2";
import { useAuth } from "../../context/AuthContext";
import { BarChart3, Mail, Lock, User, ArrowRight, Shield, Users, TrendingUp } from 'lucide-react';

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const { registerUser, message, error } = useAuth();

  const onSubmit = (data) => {
    registerUser(data, reset, navigate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Marketing content */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-emerald-600 to-blue-700 text-white w-12 h-12 flex items-center justify-center rounded-xl shadow-lg">
                <BarChart3 size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Excel Analytics</h1>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Join thousands of 
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"> data professionals</span>
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Start your journey with Excel Analytics today. Get powerful insights, collaborate with your team, and make data-driven decisions with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Advanced Analytics</h3>
                <p className="text-gray-600">Powerful tools to analyze and visualize your Excel data</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Enterprise Security</h3>
                <p className="text-gray-600">Bank-level security to protect your sensitive data</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Team Collaboration</h3>
                <p className="text-gray-600">Share insights and collaborate with your team seamlessly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - SignUp form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md p-8">
            <div className="text-center mb-8">
              <div className="flex lg:hidden items-center justify-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-emerald-600 to-blue-700 text-white w-10 h-10 flex items-center justify-center rounded-xl">
                  <BarChart3 size={20} />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Excel Analytics</h1>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
              <p className="text-gray-600">Join us and start analyzing your data today</p>
            </div>

            {message && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <p className="text-emerald-800 text-sm">{message}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-600" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    className={`
                      block w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 
                      border border-gray-300 rounded-xl shadow-sm
                      bg-white/80 backdrop-blur-sm
                      transition-all duration-200 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                      hover:border-gray-400 hover:shadow-md
                      ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
                    `}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    {...register("email", { required: "Email is required" })}
                    className={`
                      block w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 
                      border border-gray-300 rounded-xl shadow-sm
                      bg-white/80 backdrop-blur-sm
                      transition-all duration-200 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                      hover:border-gray-400 hover:shadow-md
                      ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
                    `}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
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
                        message: "Password must be at least 8 characters",
                      },
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
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button2
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold rounded-xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden bg-gradient-to-r from-emerald-600 to-blue-700 hover:from-emerald-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl focus:ring-emerald-500 active:scale-[0.98]"
              >
                Create Account
                <ArrowRight className="w-4 h-4" />
              </Button2>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-emerald-600 hover:text-emerald-500 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUp;