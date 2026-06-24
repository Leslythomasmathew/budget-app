import React from "react";
import { useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchData, deleteItem, waits } from "../helpers";

// Components
import ExpenseTable from "../components/ExpenseTable";

// Loader to fetch all expenses and budgets
export async function expensesLoader() {
  const budgets = fetchData("budgets") || [];
  const expenses = fetchData("expenses") || [];
  return { budgets, expenses };
}

// Action to process deletions in the general expenses page
export async function expensesAction({ request }) {
  await waits(); // Simulate delay

  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

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

const ExpensesPage = () => {
  const { budgets, expenses } = useLoaderData();

  return (
    <div className="dashboard-grid fade-in">
      <div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>All Expenses</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          {expenses.length > 0
            ? `Viewing all ${expenses.length} logged transactions.`
            : "No logged transactions found."}
        </p>
      </div>

      {expenses.length > 0 ? (
        <div className="expenses-section" style={{ marginTop: "0.5rem" }}>
          <ExpenseTable expenses={expenses.sort((a, b) => b.createdAt - a.createdAt)} budgets={budgets} />
        </div>
      ) : (
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            No Transactions Found
          </h3>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Go back to the dashboard to create budgets and log expenses.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
