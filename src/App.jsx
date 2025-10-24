import React, { useState, useEffect } from 'react';
import { Gift, Award, Calendar, ShoppingBag, LogIn, UserPlus, LogOut, Plus, Trash2 } from 'lucide-react';
import { supabase } from './supabaseClient';
import './App.css';
import logo from '/logo.jpg';
import stamp from '/Stamp.png';

export default function LoyaltyCardApp() {
  const [users, setUsers] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupName, setSignupName] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
    setLoading(false);
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      if (data) {
        const usersObj = {};
        data.forEach(user => {
          usersObj[user.email] = user;
        });
        setUsers(usersObj);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

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

  const handleLogin = async () => {
    if (loginEmail === 'admin') {
      setIsAdmin(true);
      setCurrentUser(null);
      setMessage('');
      return;
    }

    try {
      const { data, error } = await supabase.from('users').select('*').eq('email', loginEmail).single();
      if (error || !data) {
        setMessage('Email not found. Please sign up first!');
        return;
      }

      const validStamps = checkExpiredStamps(data);
      const validRewards = checkExpiredRewards(data);
      
      if (validStamps.length !== data.stamps.length || validRewards.length !== data.rewards.length) {
        await supabase.from('users').update({ stamps: validStamps, rewards: validRewards }).eq('email', loginEmail);
        setCurrentUser({ ...data, stamps: validStamps, rewards: validRewards });
      } else {
        setCurrentUser(data);
      }
      
      setLoginEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('Error logging in. Please try again.');
    }
  };

  const handleSignup = async () => {
    if (!signupEmail || !signupName) {
      setMessage('Please enter both name and email');
      return;
    }

    try {
      const { data: existingUser } = await supabase.from('users').select('*').eq('email', signupEmail).single();
      if (existingUser) {
        setMessage('Email already exists. Please login instead.');
        return;
      }

      const { data, error } = await supabase.from('users').insert([{
        email: signupEmail,
        name: signupName,
        stamps: [],
        rewards: []
      }]).select().single();

      if (error) throw error;

      setUsers(prev => ({ ...prev, [signupEmail]: data }));
      setCurrentUser(data);
      setSignupEmail('');
      setSignupName('');
      setMessage('');
      
      await fetchUsers();
    } catch (error) {
      console.error('Error signing up:', error);
      setMessage('Error creating account. Please try again.');
    }
  };

  const addStamp = async (userEmail) => {
    const user = users[userEmail];
    const validStamps = checkExpiredStamps(user);
    const newStamps = [...validStamps, new Date().toISOString()];
    let newRewards = [...user.rewards];
    
    if (newStamps.length >= 6) {
      newRewards.push({ id: Date.now(), earnedDate: newStamps[0], redeemed: false });
      newStamps.splice(0, 6);
    }

    const updatedUser = { ...user, stamps: newStamps, rewards: newRewards };
    
    try {
      const { error } = await supabase.from('users').update({ stamps: newStamps, rewards: newRewards }).eq('email', userEmail);
      if (error) throw error;
      
      setUsers(prev => ({ ...prev, [userEmail]: updatedUser }));
      if (currentUser && currentUser.email === userEmail) setCurrentUser(updatedUser);
    } catch (error) {
      console.error('Error adding stamp:', error);
    }
  };

  const redeemReward = async (rewardId) => {
    const updatedRewards = currentUser.rewards.map(r => 
      r.id === rewardId ? { ...r, redeemed: true } : r
    );
    const updatedUser = { ...currentUser, rewards: updatedRewards };
    
    try {
      const { error } = await supabase.from('users').update({ rewards: updatedRewards }).eq('email', currentUser.email);
      if (error) throw error;
      
      setUsers(prev => ({ ...prev, [currentUser.email]: updatedUser }));
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error('Error redeeming reward:', error);
    }
  };

  const deleteUser = async (userEmail) => {
    try {
      const { error } = await supabase.from('users').delete().eq('email', userEmail);
      if (error) throw error;
      
      const newUsers = { ...users };
      delete newUsers[userEmail];
      setUsers(newUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setMessage('');
  };

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getExpiryDate = (dateString) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 60);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};


  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading... ⋆˚࿔</div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="app-container">
        <div className="card card-admin">
          <div className="header">
            <div className="header-left">
              <img src={logo} alt="Kiko's Studio" className="logo logo-small" />
              <h1 className="title-large">Admin Dashboard</h1>
            </div>
            <button onClick={logout} className="btn btn-logout">
              <LogOut size={20} />Logout
            </button>
          </div>
          <div>
            {Object.values(users).map(user => {
              const validStamps = checkExpiredStamps(user);
              const validRewards = checkExpiredRewards(user);
              return (
                <div key={user.email} className="admin-user-card">
                  <div className="admin-user-header">
                    <div>
                      <h3 className="admin-user-name">🐻 {user.name}</h3>
                      <p className="admin-user-email">{user.email}</p>
                    </div>
                    <button onClick={() => deleteUser(user.email)} className="btn-delete">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="stats-grid">
                    <div className="stat-box">
                      <p className="stat-label">🐟 Active Stamps</p>
                      <p className="stat-value">{validStamps.length} / 6</p>
                    </div>
                    <div className="stat-box">
                      <p className="stat-label">🎁 Available Rewards</p>
                      <p className="stat-value reward">{validRewards.filter(r => !r.redeemed).length}</p>
                    </div>
                  </div>
                  <button onClick={() => addStamp(user.email)} className="btn btn-add-stamp">
                    <Plus size={20} />Add Stamp ⭐
                  </button>
                </div>
              );
            })}
            {Object.keys(users).length === 0 && <p className="no-users">No customers yet (｡•́︿•̀｡)</p>}
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
    <div className="app-container">
      <div className="card card-user">
        <div className="header">
          <div>
            <h1 className="title-large">Welcome, {currentUser.name}! ♡ </h1>
            <p className="subtitle">{currentUser.email}</p>
          </div>
          <button onClick={logout} className="btn btn-secondary">
            <LogOut size={20} />Logout
          </button>
        </div>

        <div className="loyalty-card">
          <div className="loyalty-card-header">
            <h2 className="loyalty-card-title">Your Loyalty Card</h2>
          </div>
          <div className="stamps-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`stamp-box ${i < validStamps.length ? 'filled' : 'empty'}`}>
                {i < validStamps.length ? (
                  <img src={stamp} alt="Fish stamp" className="stamp-img" />
                ) : (
                  <span className="stamp-number">{i + 1}</span>
                )}
              </div>
            ))}
          </div>
          <div className="stamp-info">
            <Calendar size={18} />
            <span>Stamps valid for 2 months from first stamp ⏰</span>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 className="rewards-header">
            <Gift size={28} />Your Rewards
          </h3>
          {activeRewards.length > 0 ? (
            <div>
              {activeRewards.map(reward => (
                <div key={reward.id} className="reward-card">
                  <div className="reward-content">
                    <div>
                      <p className="reward-title"> ‧₊˚✧ 50% OFF ✧˚₊‧</p>
                      <p className="reward-subtitle">One item on your next order</p>
                    </div>
                    <div className="reward-dates">
                      <p>Earned: {formatDate(reward.earnedDate)}</p>
                      <p>Expires: {getExpiryDate(reward.earnedDate)}</p>
                    </div>
                  </div>
                  <p className="text-small" style={{ marginTop: '1rem', color: '#8B6F47' }}>
                    💬 Got a reward waiting? To redeem, Slide into my DMs on Instagram <a href="https://instagram.com/kiko.sstudio" target="_blank" rel="noopener noreferrer" style={{ color: '#D4A574', textDecoration: 'none', fontWeight: 'bold' }}>@kiko.sstudio</a>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-rewards">
              <Gift size={64} className="no-rewards-icon" />
              <p className="no-rewards-title">No rewards yet</p>
              <p className="no-rewards-text">⋆𐙚₊˚⊹♡ Collect 6 stamps to earn 50% off! ⋆𐙚₊˚⊹♡</p>
            </div>
          )}
        </div>

        <div className="info-box">
          <h4 className="info-title">
            <ShoppingBag size={24} />How it works
          </h4>
          <ul className="info-list">
            <li>🐟 Buy 1 item = Earn 1 stamp</li>
            <li>🎁 Collect 6 stamps = Get 50% off your next item</li>
            <li>⏰ Stamps expire 2 months after your first stamp</li>
            <li>⭐ Rewards must be redeemed within 2 months of earning</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


  return (
    <div className="centered-container">
      <div className="card card-max-width">
        <div className="logo-container">
          <img src={logo} alt="Kiko's Studio" className="logo" />
          <h1 className="title-large text-center">Loyalty Rewards</h1>
          <p className="subtitle text-center">Earn stamps, get rewards!</p>
        </div>

        {message && (
          <div className="message-box">
            <p className="message-text">{message}</p>
          </div>
        )}

        <div className="tab-container">
          <button onClick={() => setShowLogin(true)} className={`btn btn-tab ${showLogin ? 'active' : ''}`}>
            Login
          </button>
          <button onClick={() => setShowLogin(false)} className={`btn btn-tab ${!showLogin ? 'active' : ''}`}>
            Sign Up
          </button>
        </div>

        {showLogin ? (
          <div>
            <div className="form-group">
              <label className="form-label">📧 Email</label>
              <input 
                type="email" 
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="form-input" 
                placeholder="your@email.com"
              />
            </div>
            <button onClick={handleLogin} className="btn btn-primary">
              <LogIn size={20} />Login
            </button>
            <p className="text-small" style={{ marginTop: '1rem' }}>Just enter your email to access your rewards!</p>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label className="form-label">⭐ Name</label>
              <input 
                type="text" 
                value={signupName} 
                onChange={(e) => setSignupName(e.target.value)} 
                className="form-input" 
                placeholder="Your name" 
              />
            </div>
            <div className="form-group">
              <label className="form-label">📧 Email</label>
              <input 
                type="email" 
                value={signupEmail} 
                onChange={(e) => setSignupEmail(e.target.value)} 
                className="form-input" 
                placeholder="your@email.com" 
              />
            </div>
            <button onClick={handleSignup} className="btn btn-primary">
              <UserPlus size={20} />Sign Up
            </button>
            <p className="text-small" style={{ marginTop: '1rem' }}>No password needed - instant access!</p>
          </div>
        )}
      </div>
    </div>
  );
}
