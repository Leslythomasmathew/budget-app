import React, { useRef, useEffect } from "react";
import { useNavigation, Form } from "react-router-dom";
import { PlusCircle as Plus, Loader2 as Loader } from "lucide-react";

const AddExpenseForm = ({ budgets, budgetId }) => {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" &&
    navigation.formData.get("_action") === "createExpense";

  const formRef = useRef();
  const focusRef = useRef();

  useEffect(() => {
    if (!isSubmitting) {
      formRef.current?.reset();
      focusRef.current?.focus();
    }
  }, [isSubmitting]);

  return (
    <div className="card">
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
        Add New Expense{" "}
        {budgets.length === 1 && `to ${budgets[0].name}`}
      </h2>
      <Form method="post" className="form-grid" ref={formRef}>
        <div className="form-group">
          <label htmlFor="newExpense">Expense Name</label>
          <input
            type="text"
            name="newExpense"
            id="newExpense"
            placeholder="e.g., Coffee"
            required
            ref={focusRef}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newExpenseAmount">Amount</label>
          <input
            type="number"
            step="0.01"
            name="newExpenseAmount"
            id="newExpenseAmount"
            placeholder="e.g., 4.50"
            required
            inputMode="decimal"
          />
        </div>
        {/* If budgetId is passed or there's only 1 budget, hide select and set value. Otherwise show dropdown */}
        {budgets.length > 1 && !budgetId ? (
          <div className="form-group">
            <label htmlFor="newExpenseBudget">Budget Category</label>
            <select name="newExpenseBudget" id="newExpenseBudget" required>
              {budgets
                .sort((a, b) => a.createdAt - b.createdAt)
                .map((budget) => (
                  <option key={budget.id} value={budget.id}>
                    {budget.name}
                  </option>
                ))}
            </select>
          </div>
        ) : (
          <input
            type="hidden"
            name="newExpenseBudget"
            value={budgetId || budgets[0]?.id || ""}
          />
        )}
        <input type="hidden" name="_action" value="createExpense" />
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span>Adding...</span>
              <Loader size={18} style={{ animation: "floatIcon 1s ease-in-out infinite" }} />
            </>
          ) : (
            <>
              <span>Add Expense</span>
              <Plus size={18} />
            </>
          )}
        </button>
      </Form>
    </div>
  );
};

export default AddExpenseForm;
