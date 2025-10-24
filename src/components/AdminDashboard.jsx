import React from 'react';
import { LogOut, Plus, Trash2 } from 'lucide-react';
import { checkExpiredStamps, checkExpiredRewards } from '../utils/helpers';
import logo from '/logo.jpg';

export default function AdminDashboard({ users, logout, addStamp, deleteUser }) {
  return (
    <div className="min-h-screen bg-[#D9B99B] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#FFF8F0] rounded-3xl shadow-2xl p-8 border-4 border-[#B8936E]">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Kiko's Studio" className="w-20 h-20 rounded-full border-4 border-[#B8936E]" />
              <h1 className="text-4xl font-bold text-[#8B6F47]">Admin Dashboard</h1>
            </div>
            <button onClick={logout} className="flex items-center gap-2 px-6 py-3 bg-[#D4A574] text-white rounded-full hover:bg-[#B8936E] shadow-lg transition-all hover:scale-105">
              <LogOut size={20} />Logout
            </button>
          </div>
          <div className="space-y-4">
            {Object.values(users).map(user => {
              const validStamps = checkExpiredStamps(user);
              const validRewards = checkExpiredRewards(user);
              return (
                <div key={user.email} className="border-4 border-[#D4A574] rounded-3xl p-6 bg-gradient-to-r from-[#FFF8F0] to-[#F5E6D3] shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-[#8B6F47]">🐻 {user.name}</h3>
                      <p className="text-[#A67C52]">{user.email}</p>
                    </div>
                    <button onClick={() => deleteUser(user.email)} className="p-3 text-[#B8936E] hover:bg-[#F5E6D3] rounded-full transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-6 rounded-2xl border-2 border-[#D4A574] shadow-md">
                      <p className="text-sm text-[#A67C52] mb-2">🐟 Active Stamps</p>
                      <p className="text-3xl font-bold text-[#8B6F47]">{validStamps.length} / 6</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border-2 border-[#D4A574] shadow-md">
                      <p className="text-sm text-[#A67C52] mb-2">🎁 Available Rewards</p>
                      <p className="text-3xl font-bold text-[#D4A574]">{validRewards.filter(r => !r.redeemed).length}</p>
                    </div>
                  </div>
                  <button onClick={() => addStamp(user.email)} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#D4A574] to-[#B8936E] text-white rounded-full hover:from-[#B8936E] hover:to-[#A67C52] font-bold shadow-lg transition-all hover:scale-105">
                    <Plus size={20} />Add Stamp ⭐
                  </button>
                </div>
              );
            })}
            {Object.keys(users).length === 0 && <p className="text-center text-gray-500 py-8">No customers yet (｡•́︿•̀｡)</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
