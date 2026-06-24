import React from "react";
import { useLoaderData, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchData, createExpense, deleteItem, waits } from "../helpers";

// Components
import BudgetCard from "../components/BudgetCard";
import AddExpenseForm from "../components/AddExpenseForm";
import ExpenseTable from "../components/ExpenseTable";

// Loader to fetch details of a specific budget
export async function budgetLoader({ params }) {
  const budgets = fetchData("budgets") || [];
  const expenses = fetchData("expenses") || [];

  const budget = budgets.find((b) => b.id === params.id);

  if (!budget) {
    throw new Error("The budget category you are trying to view does not exist.");
  }

  const budgetExpenses = expenses.filter((e) => e.budgetId === params.id);

  return { budget, expenses: budgetExpenses };
}

// Action to process add expense, delete expense, or delete budget
export async function budgetAction({ request }) {
  await waits(); // Simulate delay

  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  // 1. Create Expense
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

  // 2. Delete Expense
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

  // 3. Delete Budget
  if (_action === "deleteBudget") {
    try {
      // Delete budget
      deleteItem({
        key: "budgets",
        id: values.budgetId,
      });

      // Cascade delete matching expenses
      const allExpenses = fetchData("expenses") || [];
      const remainingExpenses = allExpenses.filter((e) => e.budgetId !== values.budgetId);
      localStorage.setItem("expenses", JSON.stringify(remainingExpenses));

      toast.success("Budget category and all associated expenses deleted.");
      return redirect("/");
    } catch (e) {
      throw new Error("There was a problem deleting your budget.");
    }
  }
}

const BudgetPage = () => {
  const { budget, expenses } = useLoaderData();

  return (
    <div
      className="dashboard-grid fade-in"
      style={{
        "--accent-hue": budget.color.split(" ")[0],
      }}
    >
      <div className="budget-details-header">
        <div>
          <h1 className="budget-details-title">
            <span style={{ color: `hsl(${budget.color})` }}>{budget.name}</span> Details
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Review expenditures and log transactions specifically for this category.
          </p>
        </div>
      </div>

      <div className="forms-section" style={{ alignItems: "start" }}>
        <BudgetCard budget={budget} showDelete={true} />
        <AddExpenseForm budgets={[budget]} budgetId={budget.id} />
      </div>

      {expenses.length > 0 ? (
        <div className="expenses-section" style={{ marginTop: "1rem" }}>
          <h2 className="section-title">
            <span style={{ color: `hsl(${budget.color})` }}>{budget.name}</span> Expenses
          </h2>
          <ExpenseTable expenses={expenses} budgets={[budget]} showBudget={false} />
        </div>
      ) : (
        <div className="card" style={{ padding: "2rem", textAlign: "center", marginTop: "1rem" }}>
          <h3 style={{ fontSize: "1.25rem", color: "var(--color-text-secondary)" }}>
            No expenses logged for this budget category yet.
          </h3>
        </div>
      )}
    </div>
  );
};

export default BudgetPage;
