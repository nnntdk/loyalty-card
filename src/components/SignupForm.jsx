import React from 'react';
import { UserPlus } from 'lucide-react';
import logo from '/logo.jpg';

export default function SignupForm({ signupEmail, setSignupEmail, signupName, setSignupName, handleSignup, message }) {
  return (
    <div className="min-h-screen bg-[#D9B99B] flex items-center justify-center p-4">
      <div className="bg-[#FFF8F0] rounded-3xl shadow-2xl p-8 w-full max-w-md border-4 border-[#B8936E]">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <img src={logo} alt="Kiko's Studio" className="w-32 h-32 rounded-full border-4 border-[#D4A574] shadow-lg mx-auto" />
          </div>
          <h1 className="text-4xl font-bold text-[#8B6F47] mb-2 drop-shadow">Loyalty Rewards</h1>
          <p className="text-[#A67C52] text-lg">Earn stamps, get rewards!</p>
        </div>

        {message && (
          <div className="mb-4 p-4 bg-[#F5E6D3] border-2 border-[#D4A574] rounded-2xl text-center">
            <p className="text-[#8B6F47] font-bold">{message}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-base font-bold text-[#8B6F47] mb-2">⭐ Name</label>
            <input 
              type="text" 
              value={signupName} 
              onChange={(e) => setSignupName(e.target.value)} 
              className="w-full px-4 py-3 border-3 border-[#D4A574] rounded-2xl focus:ring-4 focus:ring-[#E8D4BA] focus:border-[#B8936E] bg-white shadow-sm" 
              placeholder="Your name" 
            />
          </div>
          <div>
            <label className="block text-base font-bold text-[#8B6F47] mb-2">📧 Email</label>
            <input 
              type="email" 
              value={signupEmail} 
              onChange={(e) => setSignupEmail(e.target.value)} 
              className="w-full px-4 py-3 border-3 border-[#D4A574] rounded-2xl focus:ring-4 focus:ring-[#E8D4BA] focus:border-[#B8936E] bg-white shadow-sm" 
              placeholder="your@email.com" 
            />
          </div>
          <button onClick={handleSignup} className="w-full bg-gradient-to-r from-[#D4A574] to-[#B8936E] text-white py-4 rounded-full hover:from-[#B8936E] hover:to-[#A67C52] font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105">
            <UserPlus size={20} />Sign Up ✨
          </button>
          <p className="text-sm text-[#A67C52] text-center">No password needed - instant access!</p>
        </div>
      </div>
    </div>
  );
}
