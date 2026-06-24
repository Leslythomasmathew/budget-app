import React from "react";
import { Link, Form } from "react-router-dom";
import { Trash2, Eye } from "lucide-react";
import { calculateSpentByBudget, formatCurrency } from "../helpers";

const BudgetCard = ({ budget, showDelete = false }) => {
  const { id, name, amount, color } = budget;
  const spent = calculateSpentByBudget(id);
  const remaining = amount - spent;
  
  // Calculate percentage, capping the progress bar width at 100% for clean UI
  const percentage = spent / amount;
  const progressWidth = Math.min(percentage * 100, 100);

  return (
    <div
      className="card budget-card"
      style={{
        "--primary-accent": `hsl(${color})`,
        "--accent-muted": `hsla(${color.split(" ")[0]}, 65%, 50%, 0.15)`,
        borderLeft: `6px solid hsl(${color})`,
      }}
    >
      <div className="budget-card-header">
        <h3 className="budget-title">{name}</h3>
        <span className="budget-amount">{formatCurrency(amount)} Budgeted</span>
      </div>
      
      <div className="progress-wrapper">
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{
              width: `${progressWidth}%`,
              backgroundColor: "var(--primary-accent)",
            }}
          />
        </div>
        <div className="progress-info">
          <span>{formatCurrency(spent)} spent</span>
          <span
            style={{
              color: remaining < 0 ? "var(--color-danger)" : "var(--color-text-secondary)",
              fontWeight: remaining < 0 ? 600 : 400,
            }}
          >
            {remaining < 0
              ? `${formatCurrency(Math.abs(remaining))} over`
              : `${formatCurrency(remaining)} remaining`}
          </span>
        </div>
      </div>

      {showDelete ? (
        <Form
          method="post"
          onSubmit={(e) => {
            if (
              !confirm(
                "Are you sure you want to permanently delete this budget and all its associated expenses?"
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="_action" value="deleteBudget" />
          <input type="hidden" name="budgetId" value={id} />
          <button type="submit" className="btn btn-danger" style={{ width: "100%" }}>
            <span>Delete Budget</span>
            <Trash2 size={16} />
          </button>
        </Form>
      ) : (
        <div className="budget-card-actions">
          <Link to={`/budget/${id}`} className="btn btn-outline">
            <span>View Details</span>
            <Eye size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default BudgetCard;
