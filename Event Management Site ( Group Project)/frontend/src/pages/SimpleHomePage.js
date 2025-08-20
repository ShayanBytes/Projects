import React from "react";
import { useAuth } from "../context/AuthContext";

const SimpleHomePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <div className="container-clean py-16">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-slate-900 mb-4">
            Welcome to EventHub, {user?.name}!
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            You are logged in as: {user?.role}
          </p>
          <button 
            onClick={logout}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleHomePage;
