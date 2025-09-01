import React from "react";
import img from "../../assets/excel img.jpeg";
import logo from "../../assets/logo.png";
import Loginbtn from "../../components/Loginbtn";
import { Link} from "react-router-dom";
export default function Home() {
  return (
    <div className="min-h-screen bg-blue-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" width={200} />
        </div>
        <div className="flex gap-4">
          <Link to={"/login"}>
            <Loginbtn text={"Login"} />
          </Link>
          <Link to={"/register"}>
            <Loginbtn text={"Register"} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col md:flex-row items-center justify-center px-6 py-12 gap-10">
        {/* Text Section */}
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-4xl text-blue-800 font-bold mb-4">
            Analyze your Excel data
          </h2>
          <p className="gradient-text-black-800 mb-6 text-xl">
            Upload your Excel file and get smart insights with ease.
          </p>
  </div>

        {/* Visuals */}
        <div className="relative w-full max-w-md">
          <img
            src={img}
            alt="excel"
            className="w-full border-2 rounded-lg"
          />
        </div>
      </main>
    </div>
  );
}
