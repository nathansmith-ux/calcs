"use client";

import { useReducer } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ChartPieDonutText } from "@/components/ui/chart-pie-donut-text";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CashflowItem {
  id: string;
  name: string;
  amount: string;
  type: "income" | "expense";
  timePeriod: "monthly" | "yearly" | "annual";
}

interface State {
  items: CashflowItem[];
  displayPeriod: "monthly" | "yearly" | "quarterly";
}

type Action =
  | { type: "ADD_ITEM"; payload: { type: "income" | "expense" } }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_ITEM"; payload: { id: string; name?: string; amount?: string; timePeriod?: "monthly" | "yearly" | "annual" } }
  | { type: "SET_DISPLAY_PERIOD"; payload: "monthly" | "yearly" | "quarterly" };

const initialState: State = {
  items: [
    { id: "income-1", name: "Monthly Salary", amount: "4000", type: "income", timePeriod: "monthly" },
    { id: "expense-1", name: "Rent", amount: "1000", type: "expense", timePeriod: "monthly" },
  ],
  displayPeriod: "monthly",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_ITEM": {
      const id = `${action.payload.type}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      return {
        ...state,
        items: [
          ...state.items,
          { id, name: "", amount: "", type: action.payload.type, timePeriod: "monthly" },
        ],
      };
    }
    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }
    case "UPDATE_ITEM": {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload }
            : item
        ),
      };
    }
    case "SET_DISPLAY_PERIOD": {
      return {
        ...state,
        displayPeriod: action.payload,
      };
    }
    default:
      return state;
  }
}

function BudgetCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Convert amounts to monthly based on item's time period
  const convertToMonthly = (amount: number, period: "monthly" | "yearly" | "annual"): number => {
    switch (period) {
      case "monthly":
        return amount;
      case "yearly":
      case "annual":
        return amount / 12;
      default:
        return amount;
    }
  };

  // Convert monthly amount to display amount based on selected display period
  const convertToDisplayAmount = (monthlyAmount: number, displayPeriod: "monthly" | "yearly" | "quarterly"): number => {
    switch (displayPeriod) {
      case "monthly":
        return monthlyAmount;
      case "quarterly":
        return monthlyAmount * 3;
      case "yearly":
        return monthlyAmount * 12;
      default:
        return monthlyAmount;
    }
  };

  const totalIncome = state.items
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + convertToMonthly(Number(item.amount) || 0, item.timePeriod), 0);
  const totalExpenses = state.items
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + convertToMonthly(Number(item.amount) || 0, item.timePeriod), 0);
  const netCashflow = totalIncome - totalExpenses;

  // Pie chart data for donut (always use monthly values)
  const pieChartData = [
    { label: "income", value: totalIncome, fill: "#4ade80" },
    { label: "expenses", value: totalExpenses, fill: "#f87171" },
  ];

  // Display amounts based on selected display period
  const displayIncome = convertToDisplayAmount(totalIncome, state.displayPeriod);
  const displayExpenses = convertToDisplayAmount(totalExpenses, state.displayPeriod);
  const displayNetCashflow = convertToDisplayAmount(netCashflow, state.displayPeriod);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 pt-8 md:pt-20">
        {/* Left: Inputs and Explanations */}
        <div className="w-full order-2 lg:order-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-primary">Budget Calculator</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">View:</span>
              <Select
                value={state.displayPeriod}
                onValueChange={(value: "monthly" | "yearly" | "quarterly") =>
                  dispatch({ type: "SET_DISPLAY_PERIOD", payload: value })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="mb-4 text-sm md:text-base">
            Add your income and expenses below. Each item can have its own time period (Monthly, Yearly, or Annual). 
            All calculations are converted to monthly for accurate cashflow analysis, then displayed in your selected view.
          </p>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Income</h2>
            {state.items.filter((item) => item.type === "income").map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2 space-y-2 sm:space-y-0">
                <Input
                  className="w-full sm:w-2/5"
                  type="text"
                  placeholder="Income name"
                  value={item.name}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_ITEM",
                      payload: { id: item.id, name: e.target.value },
                    })
                  }
                />
                <Input
                  className="w-full sm:w-1/4"
                  type="text"
                  placeholder="$0"
                  value={item.amount}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_ITEM",
                      payload: {
                        id: item.id,
                        amount: e.target.value.replace(/[^\d.]/g, ""),
                      },
                    })
                  }
                />
                <Select
                  value={item.timePeriod}
                  onValueChange={(value: "monthly" | "yearly" | "annual") =>
                    dispatch({
                      type: "UPDATE_ITEM",
                      payload: { id: item.id, timePeriod: value },
                    })
                  }
                >
                  <SelectTrigger className="w-full sm:w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  className="text-lg px-2 py-1 rounded hover:bg-gray-100 self-start sm:self-center"
                  aria-label="Remove income"
                  onClick={() => dispatch({ type: "REMOVE_ITEM", payload: { id: item.id } })}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 px-3 py-1 rounded border bg-white hover:bg-gray-100 text-sm font-medium"
              onClick={() => dispatch({ type: "ADD_ITEM", payload: { type: "income" } })}
            >
              + Add Income
            </button>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Expenses</h2>
            {state.items.filter((item) => item.type === "expense").map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2 space-y-2 sm:space-y-0">
                <Input
                  className="w-full sm:w-2/5"
                  type="text"
                  placeholder="Expense name"
                  value={item.name}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_ITEM",
                      payload: { id: item.id, name: e.target.value },
                    })
                  }
                />
                <Input
                  className="w-full sm:w-1/4"
                  type="text"
                  placeholder="$0"
                  value={item.amount}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_ITEM",
                      payload: {
                        id: item.id,
                        amount: e.target.value.replace(/[^\d.]/g, ""),
                      },
                    })
                  }
                />
                <Select
                  value={item.timePeriod}
                  onValueChange={(value: "monthly" | "yearly" | "annual") =>
                    dispatch({
                      type: "UPDATE_ITEM",
                      payload: { id: item.id, timePeriod: value },
                    })
                  }
                >
                  <SelectTrigger className="w-full sm:w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  className="text-lg px-2 py-1 rounded hover:bg-gray-100 self-start sm:self-center"
                  aria-label="Remove expense"
                  onClick={() => dispatch({ type: "REMOVE_ITEM", payload: { id: item.id } })}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 px-3 py-1 rounded border bg-white hover:bg-gray-100 text-sm font-medium"
              onClick={() => dispatch({ type: "ADD_ITEM", payload: { type: "expense" } })}
            >
              + Add Expense
            </button>
          </div>
          <div className="mt-4 bg-muted p-4 rounded-lg">
            <h3 className="font-semibold text-base mb-2">How to Use</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Each income and expense item can have its own time period (Monthly, Yearly, or Annual).</li>
              <li>Use the &quot;View&quot; dropdown to switch between Monthly, Quarterly, and Yearly summaries.</li>
              <li>Add as many income and expense rows as you need.</li>
              <li>Enter the amount and select the appropriate time period for each item.</li>
              <li>All amounts are automatically converted to monthly for accurate cashflow analysis.</li>
              <li>Remove any row by clicking the × button.</li>
              <li>See your total income, expenses, and net cashflow summary on the right.</li>
            </ul>
          </div>
        </div>
        {/* Right: Sticky Results Card */}
        <div className="w-full relative order-1 lg:order-2">
          <div className="sticky top-4 md:top-12">
            <Card>
              <CardHeader className="pb-2">
                <div className="text-muted-foreground text-base font-medium mb-1">
                  Cashflow Summary ({state.displayPeriod})
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Income</span>
                    <span className="font-bold text-green-600">${displayIncome.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Expenses</span>
                    <span className="font-bold text-red-600">${displayExpenses.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Net Cashflow</span>
                    <span className={displayNetCashflow >= 0 ? "text-green-700" : "text-red-700"}>
                      ${displayNetCashflow.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <ChartPieDonutText data={pieChartData} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="mt-2 flex justify-end">
              <a href="https://www.realty-ai.com" className="hover:text-blue-500 text-sm">
                <p>Powered By Realty AI</p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BudgetCalculator; 