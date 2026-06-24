import { redirect } from "react-router-dom";
import { deleteItem } from "../helpers";
import { toast } from "react-toastify";

// Logout/Clear all data action
export async function logoutAction() {
  // Delete storage data
  deleteItem({ key: "userName" });
  deleteItem({ key: "budgets" });
  deleteItem({ key: "expenses" });
  deleteItem({ key: "totalFunds" });
  
  toast.success("All budget data cleared!");
  
  // Redirect to Dashboard
  return redirect("/");
}
