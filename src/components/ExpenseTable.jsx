import React from "react";
import ExpenseItem from "./ExpenseItem";

const ExpenseTable = ({ expenses, budgets, showBudget = true }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {["Name", "Amount", "Date", ...(showBudget ? ["Budget"] : []), "Actions"].map(
              (header, index) => (
                <th key={index}>{header}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => {
            const budget = budgets.find((b) => b.id === expense.budgetId);
            return (
              <tr key={expense.id}>
                <ExpenseItem
                  expense={expense}
                  budget={budget}
                  showBudget={showBudget}
                />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
