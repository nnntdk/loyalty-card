import React from 'react';
import { Gift, Award, Calendar, ShoppingBag, LogOut } from 'lucide-react';
import { checkExpiredStamps, checkExpiredRewards, formatDate, getExpiryDate } from '../utils/helpers';
import logo from '/logo.jpg';
import stamp from '/Stamp.png';

export default function UserDashboard({ currentUser, logout, redeemReward }) {
  const validStamps = checkExpiredStamps(currentUser);
  const validRewards = checkExpiredRewards(currentUser);
  const activeRewards = validRewards.filter(r => !r.redeemed);

  return (
    <div className="min-h-screen bg-[#D9B99B] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#FFF8F0] rounded-3xl shadow-2xl p-8 border-4 border-[#B8936E]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[#8B6F47]">Welcome, {currentUser.name}! ♡ </h1>
              <p className="text-[#A67C52] text-lg">{currentUser.email}</p>
            </div>
            <button onClick={logout} className="flex items-center gap-2 px-6 py-3 bg-[#F5E6D3] text-[#8B6F47] rounded-full hover:bg-[#E8D4BA] shadow-lg transition-all hover:scale-105">
              <LogOut size={20} />Logout
            </button>
          </div>

          <div className="mb-8 bg-gradient-to-br from-[#E8D4BA] via-[#D4A574] to-[#C9A87C] rounded-3xl p-8 text-white shadow-2xl border-4 border-[#B8936E]">
            <div className="flex items-center gap-3 mb-6">
              <Award size={36} />
              <h2 className="text-3xl font-bold drop-shadow-md">⭐ Your Loyalty Card ⭐</h2>
            </div>
            <div className="grid grid-cols-6 gap-3 mb-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`aspect-square rounded-2xl flex items-center justify-center p-2 transition-all border-3 ${i < validStamps.length ? 'bg-white shadow-xl scale-105 border-[#D4A574]' : 'bg-white/30 border-white/40'}`}>
                  {i < validStamps.length ? (
                    <img 
                      src={stamp} 
                      alt="Fish stamp" 
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white/80 drop-shadow">{i + 1}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm bg-white/20 rounded-2xl p-4 backdrop-blur border-2 border-white/30">
              <Calendar size={18} />
              <span className="drop-shadow">Stamps valid for 2 months from first stamp ⏰</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-[#8B6F47] mb-4 flex items-center gap-2">
              <Gift size={28} />Your Rewards
            </h3>
            {activeRewards.length > 0 ? (
              <div className="space-y-4">
                {activeRewards.map(reward => (
                  <div key={reward.id} className="border-4 border-[#D4A574] rounded-3xl p-6 bg-gradient-to-r from-[#FFF8F0] to-[#F5E6D3] shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-3xl font-bold text-[#D4A574]"> ‧₊˚✧ 50% OFF ✧˚₊‧</p>
                        <p className="text-lg text-[#A67C52]">One item on your next order</p>
                      </div>
                      <div className="text-right text-sm text-[#A67C52]">
                        <p>Earned: {formatDate(reward.earnedDate)}</p>
                        <p>Expires: {getExpiryDate(reward.earnedDate)}</p>
                      </div>
                    </div>
                    <button onClick={() => redeemReward(reward.id)} className="w-full bg-gradient-to-r from-[#D4A574] to-[#B8936E] text-white py-4 rounded-full hover:from-[#B8936E] hover:to-[#A67C52] font-bold shadow-lg transition-all hover:scale-105">
                      ⋆˚࿔ Redeem Now! 𝜗𝜚˚⋆
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-4 border-dashed border-[#D4A574] rounded-3xl bg-white">
                <Gift size={64} className="mx-auto text-[#D4A574] mb-4" />
                <p className="text-[#8B6F47] text-xl font-bold">No rewards yet</p>
                <p className="text-[#A67C52]">⋆𐙚₊˚⊹♡ Collect 6 stamps to earn 50% off! ⋆𐙚₊˚⊹♡</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-[#FFF8F0] to-[#F5E6D3] rounded-3xl p-6 border-4 border-[#D4A574]">
            <h4 className="text-xl font-bold text-[#8B6F47] mb-4 flex items-center gap-2">
              <ShoppingBag size={24} />How it works
            </h4>
            <ul className="space-y-3 text-[#A67C52] text-base">
              <li className="flex items-center gap-2">🐟 Buy 1 item = Earn 1 stamp</li>
              <li className="flex items-center gap-2">🎁 Collect 6 stamps = Get 50% off your next item</li>
              <li className="flex items-center gap-2">⏰ Stamps expire 2 months after your first stamp</li>
              <li className="flex items-center gap-2">⭐ Rewards must be redeemed within 2 months of earning</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
