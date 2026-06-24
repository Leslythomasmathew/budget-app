import React from "react";
import { Form } from "react-router-dom";
import { UserPlus, Wallet } from "lucide-react";

const Intro = () => {
  return (
    <div className="intro-container">
      <div className="intro-content">
        <h1>Take Control of Your Money</h1>
        <p>
          Personal budgeting is the secret to financial freedom. Start your journey today by creating a budget that works for you.
        </p>
        <Form method="post" className="form-grid card">
          <div className="form-group">
            <label htmlFor="userName">What is your name?</label>
            <input
              type="text"
              name="userName"
              id="userName"
              required
              placeholder="Enter your name"
              autoComplete="given-name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="totalFunds">Initial Funds Available</label>
            <input
              type="number"
              step="0.01"
              name="totalFunds"
              id="totalFunds"
              required
              placeholder="e.g. 5000"
              inputMode="decimal"
              min="0"
            />
          </div>
          <input type="hidden" name="_action" value="newUser" />
          <button type="submit" className="btn btn-primary">
            <span>Create Account</span>
            <UserPlus size={18} />
          </button>
        </Form>
      </div>
      <div className="intro-illustration">
        <div className="illustration-card">
          <Wallet className="illustration-icon" />
          <p style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>
            Your Expense Manager
          </p>
        </div>
      </div>
    </div>
  );
};

export default Intro;
