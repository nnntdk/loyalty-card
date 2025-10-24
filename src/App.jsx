import React, { useState, useEffect } from 'react';
import { Gift, Award, Calendar, ShoppingBag, LogIn, UserPlus, LogOut, Plus, Trash2 } from 'lucide-react';

export default function LoyaltyCardApp() {
  const [users, setUsers] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');

  useEffect(() => {
    const data = { 'test@test.com': { email: 'test@test.com', password: 'test123', name: 'Test User', stamps: [], rewards: [] } };
    setUsers(data);
  }, []);

  const checkExpiredStamps = (user) => {
    const now = new Date();
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    return user.stamps.filter(stamp => new Date(stamp) > twoMonthsAgo);
  };

  const checkExpiredRewards = (user) => {
    const now = new Date();
    return user.rewards.filter(reward => {
      if (reward.redeemed) return true;
      const earnedDate = new Date(reward.earnedDate);
      const expiryDate = new Date(earnedDate.getTime() + 60 * 24 * 60 * 60 * 1000);
      return now < expiryDate;
    });
  };

  const handleLogin = () => {
    if (loginEmail === 'admin' && loginPassword === 'admin123') {
      setIsAdmin(true);
      setCurrentUser(null);
      return;
    }

    const user = users[loginEmail];
    if (user && user.password === loginPassword) {
      const validStamps = checkExpiredStamps(user);
      const validRewards = checkExpiredRewards(user);
      const updatedUser = { ...user, stamps: validStamps, rewards: validRewards };
      setUsers(prev => ({ ...prev, [loginEmail]: updatedUser }));
      setCurrentUser(updatedUser);
      setLoginEmail('');
      setLoginPassword('');
    } else {
      alert('Invalid credentials (╥﹏╥)');
    }
  };

  const handleSignup = () => {
    if (users[signupEmail]) {
      alert('Email already exists (｡•́︿•̀｡)');
      return;
    }
    const newUser = { email: signupEmail, password: signupPassword, name: signupName, stamps: [], rewards: [] };
    setUsers(prev => ({ ...prev, [signupEmail]: newUser }));
    setCurrentUser(newUser);
    setSignupEmail('');
    setSignupPassword('');
    setSignupName('');
  };

  const addStamp = (userEmail) => {
    const user = users[userEmail];
    const validStamps = checkExpiredStamps(user);
    const newStamps = [...validStamps, new Date().toISOString()];
    let newRewards = [...user.rewards];
    
    if (newStamps.length >= 6) {
      newRewards.push({ id: Date.now(), earnedDate: newStamps[0], redeemed: false });
      newStamps.splice(0, 6);
    }

    const updatedUser = { ...user, stamps: newStamps, rewards: newRewards };
    setUsers(prev => ({ ...prev, [userEmail]: updatedUser }));
    if (currentUser && currentUser.email === userEmail) setCurrentUser(updatedUser);
  };

  const redeemReward = (rewardId) => {
    const updatedRewards = currentUser.rewards.map(r => r.id === rewardId ? { ...r, redeemed: true } : r);
    const updatedUser = { ...currentUser, rewards: updatedRewards };
    setUsers(prev => ({ ...prev, [currentUser.email]: updatedUser }));
    setCurrentUser(updatedUser);
  };

  const deleteUser = (userEmail) => {
    const newUsers = { ...users };
    delete newUsers[userEmail];
    setUsers(newUsers);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const getExpiryDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 60);
    return date.toLocaleDateString();
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#D9B99B] p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#FFF8F0] rounded-3xl shadow-2xl p-8 border-4 border-[#B8936E]">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <img src="/logo.jpg" alt="Kiko's Studio" className="w-20 h-20 rounded-full border-4 border-[#B8936E]" />
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

  if (currentUser) {
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
                        src="/Stamp.jpg" 
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
                          <p className="text-3xl font-bold text-[#D4A574]">🎉 50% OFF 🎉</p>
                          <p className="text-lg text-[#A67C52]">One item on your next order ⭐</p>
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

  return (
    <div className="min-h-screen bg-[#D9B99B] flex items-center justify-center p-4">
      <div className="bg-[#FFF8F0] rounded-3xl shadow-2xl p-8 w-full max-w-md border-4 border-[#B8936E]">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <img src="/logo.jpg" alt="Kiko's Studio" className="w-32 h-32 rounded-full border-4 border-[#D4A574] shadow-lg mx-auto" />
          </div>
          <h1 className="text-4xl font-bold text-[#8B6F47] mb-2 drop-shadow">Kiko's Loyalty Rewards</h1>
          <p className="text-[#A67C52] text-lg">Earn stamps, get rewards!</p>
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={() => setShowLogin(true)} className={`flex-1 py-3 rounded-full font-bold transition-all border-2 ${showLogin ? 'bg-gradient-to-r from-[#D4A574] to-[#B8936E] text-white shadow-lg scale-105 border-[#B8936E]' : 'bg-[#F5E6D3] text-[#8B6F47] border-[#D4A574]'}`}>
            Login
          </button>
          <button onClick={() => setShowLogin(false)} className={`flex-1 py-3 rounded-full font-bold transition-all border-2 ${!showLogin ? 'bg-gradient-to-r from-[#D4A574] to-[#B8936E] text-white shadow-lg scale-105 border-[#B8936E]' : 'bg-[#F5E6D3] text-[#8B6F47] border-[#D4A574]'}`}>
            Sign Up
          </button>
        </div>

        {showLogin ? (
          <div className="space-y-4">
            <div>
              <label className="block text-base font-bold text-[#8B6F47] mb-2">📧 Email</label>
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full px-4 py-3 border-3 border-[#D4A574] rounded-2xl focus:ring-4 focus:ring-[#E8D4BA] focus:border-[#B8936E] bg-white shadow-sm" />
            </div>
            <div>
              <label className="block text-base font-bold text-[#8B6F47] mb-2">🔒 Password</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full px-4 py-3 border-3 border-[#D4A574] rounded-2xl focus:ring-4 focus:ring-[#E8D4BA] focus:border-[#B8936E] bg-white shadow-sm" />
            </div>
            <button onClick={handleLogin} className="w-full bg-gradient-to-r from-[#D4A574] to-[#B8936E] text-white py-4 rounded-full hover:from-[#B8936E] hover:to-[#A67C52] font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105">
              <LogIn size={20} />Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-base font-bold text-[#8B6F47] mb-2">⭐ Name</label>
              <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} className="w-full px-4 py-3 border-3 border-[#D4A574] rounded-2xl focus:ring-4 focus:ring-[#E8D4BA] focus:border-[#B8936E] bg-white shadow-sm" />
            </div>
            <div>
              <label className="block text-base font-bold text-[#8B6F47] mb-2">📧 Email</label>
              <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className="w-full px-4 py-3 border-3 border-[#D4A574] rounded-2xl focus:ring-4 focus:ring-[#E8D4BA] focus:border-[#B8936E] bg-white shadow-sm" />
            </div>
            <div>
              <label className="block text-base font-bold text-[#8B6F47] mb-2">🔒 Password</label>
              <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} className="w-full px-4 py-3 border-3 border-[#D4A574] rounded-2xl focus:ring-4 focus:ring-[#E8D4BA] focus:border-[#B8936E] bg-white shadow-sm" />
            </div>
            <button onClick={handleSignup} className="w-full bg-gradient-to-r from-[#D4A574] to-[#B8936E] text-white py-4 rounded-full hover:from-[#B8936E] hover:to-[#A67C52] font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105">
              <UserPlus size={20} />Sign Up (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
            </button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t-3 border-[#D4A574]">
          <p className="text-base text-[#8B6F47] text-center mb-2 font-bold">Business Owner? (◕‿◕✿)</p>
          <p className="text-sm text-[#A67C52] text-center">Login: <span className="font-mono bg-[#F5E6D3] px-3 py-1 rounded-full border-2 border-[#D4A574]">admin / admin123</span></p>
          <p className="text-sm text-[#A67C52] text-center mt-2">Test customer: <span className="font-mono bg-[#F5E6D3] px-3 py-1 rounded-full border-2 border-[#D4A574]">test@test.com / test123</span></p>
        </div>
      </div>
    </div>
  );
}
