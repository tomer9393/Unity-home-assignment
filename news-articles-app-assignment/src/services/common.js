// Checked if the two input dates are the same day
const isToday = (savedDate, currentDate) => {  
    return currentDate.getUTCFullYear() === savedDate.getUTCFullYear() &&
    currentDate.getUTCMonth() === savedDate.getUTCMonth() &&
    currentDate.getUTCDate() === savedDate.getUTCDate();
};

export { isToday }