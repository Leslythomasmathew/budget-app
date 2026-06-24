import React from "react";
import { Form, Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { formatCurrency, formatDateToLocalString } from "../helpers";

const ExpenseItem = ({ expense, budget, showBudget = true }) => {
  return (
    <>
      <td>{expense.name}</td>
      <td>{formatCurrency(expense.amount)}</td>
      <td>{formatDateToLocalString(expense.createdAt)}</td>
      {showBudget && budget && (
        <td>
          <Link
            to={`/budget/${budget.id}`}
            className="budget-badge"
            style={{
              backgroundColor: `hsla(${budget.color.split(" ")[0]}, 65%, 50%, 0.15)`,
              color: `hsl(${budget.color})`,
              border: `1px solid hsla(${budget.color.split(" ")[0]}, 65%, 50%, 0.3)`,
              textDecoration: "none",
            }}
          >
            {budget.name}
          </Link>
        </td>
      )}
      <td>
        <Form
          method="post"
          onSubmit={(e) => {
            if (!confirm(`Are you sure you want to delete the expense "${expense.name}"?`)) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="_action" value="deleteExpense" />
          <input type="hidden" name="expenseId" value={expense.id} />
          <button
            type="submit"
            className="btn btn-danger"
            aria-label={`Delete ${expense.name} expense`}
            style={{ padding: "0.4rem 0.6rem", borderRadius: "6px" }}
          >
            <Trash2 size={14} />
          </button>
        </Form>
      </td>
    </>
  );
};

export default ExpenseItem;
