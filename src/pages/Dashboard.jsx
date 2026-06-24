import React, { useState } from "react";
import { useLoaderData, Link, Form } from "react-router-dom";
import { toast } from "react-toastify";
import { Edit2, Check, X, PiggyBank, Wallet, Activity, AlertTriangle } from "lucide-react";
import { fetchData, createBudget, createExpense, deleteItem, waits, formatCurrency, formatPercentage } from "../helpers";

// Components
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetCard from "../components/BudgetCard";
import ExpenseTable from "../components/ExpenseTable";

// Loader to fetch dashboard state
export async function dashboardLoader() {
  const budgets = fetchData("budgets") || [];
  const expenses = fetchData("expenses") || [];
  const totalFunds = fetchData("totalFunds") || 0;
  return { budgets, expenses, totalFunds };
}

// Action to process all submissions on the Dashboard
export async function dashboardAction({ request }) {
  await waits(); // Simulate delay to display interactive loading states

  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  // Update Funds Action
  if (_action === "updateFunds") {
    try {
      localStorage.setItem("totalFunds", JSON.stringify(+values.totalFunds || 0));
      toast.success("Total funds updated!");
      return null;
    } catch (e) {
      throw new Error("There was a problem updating your total funds.");
    }
  }

  // 2. Create Budget Category
  if (_action === "createBudget") {
    try {
      createBudget({
        name: values.newBudget,
        amount: values.newBudgetAmount,
      });
      toast.success("Budget category created!");
      return null;
    } catch (e) {
      throw new Error("There was a problem creating your budget.");
    }
  }

  // 3. Create Expense Item
  if (_action === "createExpense") {
    try {
      createExpense({
        name: values.newExpense,
        amount: values.newExpenseAmount,
        budgetId: values.newExpenseBudget,
      });
      toast.success(`Expense "${values.newExpense}" added!`);
      return null;
    } catch (e) {
      throw new Error("There was a problem adding your expense.");
    }
  }

  // 4. Delete Expense Item
  if (_action === "deleteExpense") {
    try {
      deleteItem({
        key: "expenses",
        id: values.expenseId,
      });
      toast.success("Expense deleted.");
      return null;
    } catch (e) {
      throw new Error("There was a problem deleting your expense.");
    }
  }
}

const Dashboard = () => {
  const { budgets, expenses, totalFunds } = useLoaderData();
  const [isEditingFunds, setIsEditingFunds] = useState(false);

  // Calculations
  const totalSpent = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const remainingFunds = totalFunds - totalSpent;
  const totalBudgeted = budgets.reduce((acc, b) => acc + b.amount, 0);

  // Spend Analysis values
  const allocationPercentage = totalFunds > 0 ? (totalBudgeted / totalFunds) * 100 : 0;
  const spendingPercentage = totalFunds > 0 ? (totalSpent / totalFunds) * 100 : 0;

  // Group expenses by budget category for spend analysis breakdown
  const categorySpending = budgets.map(budget => {
    const spent = expenses
      .filter(e => e.budgetId === budget.id)
      .reduce((acc, e) => acc + e.amount, 0);
    const share = totalSpent > 0 ? (spent / totalSpent) * 100 : 0;
    return {
      ...budget,
      spent,
      share
    };
  }).sort((a, b) => b.spent - a.spent); // Sort by highest spend first

  return (
    <div className="dashboard-grid fade-in">
      {/* Header */}
      <div style={{ marginBottom: "1rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>
          Your <span style={{ color: "var(--primary-accent)" }}>Expense Manager</span>
        </h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Take control of your money and review your expenditures.
        </p>
      </div>

      {/* Financial Overview Cards */}
      <div className="forms-section" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {/* Total Funds Card */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.95rem", color: "var(--color-text-secondary)", fontWeight: 500 }}>Total Funds Available</span>
            <Wallet size={20} style={{ color: "var(--primary-accent)", marginLeft: "auto" }} />
          </div>
          <div style={{ margin: "1rem 0" }}>
            {isEditingFunds ? (
              <Form method="post" onSubmit={() => setIsEditingFunds(false)} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input type="hidden" name="_action" value="updateFunds" />
                <input
                  type="number"
                  step="0.01"
                  name="totalFunds"
                  defaultValue={totalFunds}
                  required
                  placeholder="e.g. 5000"
                  autoFocus
                  style={{
                    padding: "0.4rem 0.6rem",
                    width: "100%",
                    background: "var(--bg-input)",
                    border: "1px solid var(--primary-accent)",
                    borderRadius: "6px",
                    color: "var(--color-text-primary)",
                    outline: "none",
                    fontFamily: "var(--font-family)"
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: "0.5rem", borderRadius: "6px" }} aria-label="Save funds">
                  <Check size={16} />
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setIsEditingFunds(false)} style={{ padding: "0.5rem", borderRadius: "6px" }} aria-label="Cancel">
                  <X size={16} />
                </button>
              </Form>
            ) : (
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: 800 }}>{formatCurrency(totalFunds)}</span>
                <button onClick={() => setIsEditingFunds(true)} style={{ background: "transparent", border: "none", color: "var(--color-text-secondary)", cursor: "pointer", padding: "4px" }} aria-label="Edit total funds">
                  <Edit2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Total Spent Card */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.95rem", color: "var(--color-text-secondary)", fontWeight: 500 }}>Total Spent</span>
            <Activity size={20} style={{ color: "var(--color-danger)", marginLeft: "auto" }} />
          </div>
          <div style={{ margin: "1rem 0" }}>
            <span style={{ fontSize: "2rem", fontWeight: 800 }}>{formatCurrency(totalSpent)}</span>
          </div>
        </div>

        {/* Remaining Balance Card */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.95rem", color: "var(--color-text-secondary)", fontWeight: 500 }}>Remaining Balance</span>
            <PiggyBank size={20} style={{ color: remainingFunds >= 0 ? "var(--color-success)" : "var(--color-danger)", marginLeft: "auto" }} />
          </div>
          <div style={{ margin: "1rem 0" }}>
            <span style={{ fontSize: "2rem", fontWeight: 800, color: remainingFunds >= 0 ? "var(--color-success)" : "var(--color-danger)" }}>
              {formatCurrency(remainingFunds)}
            </span>
          </div>
        </div>
      </div>

      {budgets.length > 0 ? (
        <div className="dashboard-grid">
          {/* Form Input Layout */}
          <div className="forms-section">
            <AddBudgetForm />
            <AddExpenseForm budgets={budgets} />
          </div>

          {/* Spend Analysis Section */}
          <div className="card" style={{ marginTop: "1rem" }}>
            <h2 className="section-title" style={{ marginBottom: "1.5rem" }}>
              <Activity size={24} style={{ color: "var(--primary-accent)" }} />
              Spend Analysis
            </h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              {/* Allocation and Expense Rate */}
              <div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: 600 }}>Budget Allocation Rate</span>
                    <span style={{ color: allocationPercentage > 100 ? "var(--color-danger)" : "var(--color-text-secondary)", fontWeight: 600 }}>
                      {formatPercentage(allocationPercentage / 100)}
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(allocationPercentage, 100)}%`,
                        backgroundColor: allocationPercentage > 100 ? "var(--color-danger)" : "var(--primary-accent)"
                      }}
                    />
                  </div>
                  {allocationPercentage > 100 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-danger)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                      <AlertTriangle size={14} />
                      <span>Budget allocations exceed total funds by {formatCurrency(totalBudgeted - totalFunds)}!</span>
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: 600 }}>Spending Rate</span>
                    <span style={{ color: spendingPercentage > 100 ? "var(--color-danger)" : "var(--color-text-secondary)", fontWeight: 600 }}>
                      {formatPercentage(spendingPercentage / 100)}
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(spendingPercentage, 100)}%`,
                        backgroundColor: spendingPercentage > 90 ? "var(--color-danger)" : "var(--color-success)"
                      }}
                    />
                  </div>
                  {spendingPercentage > 100 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-danger)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                      <AlertTriangle size={14} />
                      <span>Total expenses exceed total funds! You are overdrawn by {formatCurrency(totalSpent - totalFunds)}!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category distribution breakdown */}
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>Category Expenditure Share</h3>
                {totalSpent > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {categorySpending.map(cat => (
                      <div key={cat.id} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem" }}>
                          <span
                            className="budget-badge"
                            style={{
                              backgroundColor: `hsla(${cat.color.split(" ")[0]}, 65%, 50%, 0.15)`,
                              color: `hsl(${cat.color})`,
                              border: `1px solid hsla(${cat.color.split(" ")[0]}, 65%, 50%, 0.3)`,
                            }}
                          >
                            {cat.name}
                          </span>
                          <span style={{ fontWeight: 500 }}>
                            {formatCurrency(cat.spent)} ({formatPercentage(cat.share / 100)})
                          </span>
                        </div>
                        <div className="progress-bar-bg" style={{ height: "6px" }}>
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${cat.share}%`,
                              backgroundColor: `hsl(${cat.color})`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem" }}>
                    Log your first expense to view the spending distribution.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Budgets Grid */}
          <div className="budgets-section">
            <h2 className="section-title">Existing Budgets</h2>
            <div className="budgets-grid">
              {budgets
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((budget) => (
                  <BudgetCard key={budget.id} budget={budget} />
                ))}
            </div>
          </div>

          {/* Recent Expenses List */}
          {expenses.length > 0 && (
            <div className="expenses-section">
              <h2 className="section-title">Recent Expenses</h2>
              <ExpenseTable
                expenses={expenses
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .slice(0, 8)}
                budgets={budgets
                  .sort((a, b) => b.createdAt - a.createdAt)}
              />
              {expenses.length > 8 && (
                <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                  <Link to="/expenses" className="btn btn-outline">
                    View All Expenses
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="dashboard-grid">
          <div className="card" style={{ padding: "2.5rem", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              No Budgets Found
            </h3>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>
              To get started tracking expenditures, please create your first budget category below.
            </p>
            <div style={{ maxWidth: "500px", margin: "0 auto", textAlign: "left" }}>
              <AddBudgetForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
