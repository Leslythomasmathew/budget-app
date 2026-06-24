// Fetch data from local storage
export const fetchData = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

// Delete item from local storage
export const deleteItem = ({ key, id }) => {
  if (id) {
    const existingItems = fetchData(key) ?? [];
    const newItems = existingItems.filter((item) => item.id !== id);
    localStorage.setItem(key, JSON.stringify(newItems));
  } else {
    localStorage.removeItem(key);
  }
};

// Generate a random HSL color hue
const generateRandomColor = () => {
  const existingBudgets = fetchData("budgets") || [];
  // Use length of budgets to shift hue, so they are always distinct
  const hue = (existingBudgets.length * 37) % 360;
  return `${hue} 65% 50%`;
};

// Create a new budget
export const createBudget = ({ name, amount }) => {
  const newItem = {
    id: crypto.randomUUID(),
    name,
    amount: +amount,
    createdAt: Date.now(),
    color: generateRandomColor(),
  };
  const existingBudgets = fetchData("budgets") || [];
  localStorage.setItem("budgets", JSON.stringify([...existingBudgets, newItem]));
};

// Create a new expense
export const createExpense = ({ name, amount, budgetId }) => {
  const newItem = {
    id: crypto.randomUUID(),
    name,
    amount: +amount,
    createdAt: Date.now(),
    budgetId,
  };
  const existingExpenses = fetchData("expenses") || [];
  localStorage.setItem("expenses", JSON.stringify([...existingExpenses, newItem]));
};

// Calculate spent by budget
export const calculateSpentByBudget = (budgetId) => {
  const expenses = fetchData("expenses") || [];
  const budgetSpent = expenses.reduce((acc, expense) => {
    if (expense.budgetId !== budgetId) return acc;
    return acc + expense.amount;
  }, 0);
  return budgetSpent;
};

// Format currency
export const formatCurrency = (amt) => {
  return amt.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
};

// Format percentage
export const formatPercentage = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  });
};

// Format date
export const formatDateToLocalString = (epoch) => {
  return new Date(epoch).toLocaleDateString();
};

// Wait simulation
export const waits = () => new Promise((res) => setTimeout(res, 800));
