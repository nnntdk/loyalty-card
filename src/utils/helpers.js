export const checkExpiredStamps = (user) => {
  const now = new Date();
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  return user.stamps.filter(stamp => new Date(stamp) > twoMonthsAgo);
};

export const checkExpiredRewards = (user) => {
  const now = new Date();
  return user.rewards.filter(reward => {
    if (reward.redeemed) return true;
    const earnedDate = new Date(reward.earnedDate);
    const expiryDate = new Date(earnedDate.getTime() + 60 * 24 * 60 * 60 * 1000);
    return now < expiryDate;
  });
};

export const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

export const getExpiryDate = (dateString) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 60);
  return date.toLocaleDateString();
};
