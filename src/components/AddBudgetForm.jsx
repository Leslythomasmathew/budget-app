import React, { useRef, useEffect } from "react";
import { useNavigation, Form } from "react-router-dom";
import { PlusCircle, Loader2 } from "lucide-react";

const AddBudgetForm = () => {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" &&
    navigation.formData.get("_action") === "createBudget";

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
        Create Budget
      </h2>
      <Form method="post" className="form-grid" ref={formRef}>
        <div className="form-group">
          <label htmlFor="newBudget">Budget Name</label>
          <input
            type="text"
            name="newBudget"
            id="newBudget"
            placeholder="e.g., Groceries"
            required
            ref={focusRef}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newBudgetAmount">Amount</label>
          <input
            type="number"
            step="0.01"
            name="newBudgetAmount"
            id="newBudgetAmount"
            placeholder="e.g., 350"
            required
            inputMode="decimal"
          />
        </div>
        <input type="hidden" name="_action" value="createBudget" />
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span>Creating...</span>
              <Loader2 size={18} style={{ animation: "floatIcon 1s ease-in-out infinite" }} />
            </>
          ) : (
            <>
              <span>Create Budget</span>
              <PlusCircle size={18} />
            </>
          )}
        </button>
      </Form>
    </div>
  );
};

export default AddBudgetForm;
