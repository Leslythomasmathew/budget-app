import { redirect } from "react-router-dom";
import { deleteItem } from "../helpers";
import { toast } from "react-toastify";

// Logout/Delete User action
export async function logoutAction() {
  // Delete storage data
  deleteItem({ key: "userName" });
  deleteItem({ key: "budgets" });
  deleteItem({ key: "expenses" });
  deleteItem({ key: "totalFunds" });
  
  toast.success("Account deleted successfully!");
  
  // Redirect to Dashboard (which will show the Intro welcome page)
  return redirect("/");
}
