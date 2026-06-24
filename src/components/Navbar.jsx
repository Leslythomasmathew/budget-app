import React from "react";
import { Form, NavLink } from "react-router-dom";
import { Wallet, Trash2 } from "lucide-react";

const Navbar = ({ userName }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="logo">
          <Wallet size={28} />
          <span>Your Expense Manager</span>
        </NavLink>
        {userName && (
          <Form
            method="post"
            action="/logout"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Are you sure you want to delete your account and all data? This cannot be undone."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit" className="btn btn-danger">
              <span>Delete User</span>
              <Trash2 size={16} />
            </button>
          </Form>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
