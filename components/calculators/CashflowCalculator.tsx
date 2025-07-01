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

interface CashflowItem {
  id: string;
  name: string;
  amount: string;
  type: "income" | "expense";
}

interface State {
  items: CashflowItem[];
}

type Action =
  | { type: "ADD_ITEM"; payload: { type: "income" | "expense" } }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_ITEM"; payload: { id: string; name?: string; amount?: string } };

const initialState: State = {
  items: [
    { id: "income-1", name: "Salary", amount: "", type: "income" },
    { id: "expense-1", name: "Rent", amount: "", type: "expense" },
  ],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_ITEM": {
      const id = `${action.payload.type}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      return {
        ...state,
        items: [
          ...state.items,
          { id, name: "", amount: "", type: action.payload.type },
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
    default:
      return state;
  }
}

function CashflowCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const totalIncome = state.items
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalExpenses = state.items
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const netCashflow = totalIncome - totalExpenses;

  // Pie chart data for donut
  const pieChartData = [
    { label: "Income", value: totalIncome, fill: "#4ade80" },
    { label: "Expenses", value: totalExpenses, fill: "#f87171" },
  ];
  if (netCashflow > 0) {
    pieChartData.push({ label: "Net Cashflow", value: netCashflow, fill: "#60a5fa" });
  } else if (netCashflow < 0) {
    pieChartData.push({ label: "Net Loss", value: Math.abs(netCashflow), fill: "#fbbf24" });
  }

  return (
    <main className="max-w-7xl mx-auto">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 pt-20">
        {/* Left: Inputs and Explanations */}
        <div className="w-full">
          <h1 className="text-3xl font-bold text-brand-primary mb-2">Cashflow Calculator</h1>
          <p className="mb-4">Add your income and expenses below to calculate your monthly or yearly cashflow. You can add as many rows as you like for both income and expenses.</p>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Income</h2>
            {state.items.filter((item) => item.type === "income").map((item) => (
              <div key={item.id} className="flex items-center gap-2 mb-2">
                <Input
                  className="w-1/2"
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
                  className="w-1/3"
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
                <button
                  type="button"
                  className="text-lg px-2 py-1 rounded hover:bg-gray-100"
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
              <div key={item.id} className="flex items-center gap-2 mb-2">
                <Input
                  className="w-1/2"
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
                  className="w-1/3"
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
                <button
                  type="button"
                  className="text-lg px-2 py-1 rounded hover:bg-gray-100"
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
              <li>Add as many income and expense rows as you need.</li>
              <li>Give each row a name and enter the amount (per month or per year).</li>
              <li>Remove any row by clicking the × button.</li>
              <li>See your total income, expenses, and net cashflow summary on the right.</li>
            </ul>
          </div>
        </div>
        {/* Right: Sticky Results Card */}
        <div className="w-full relative">
          <div className="sticky top-12">
            <Card>
              <CardHeader className="pb-2">
                <div className="text-muted-foreground text-base font-medium mb-1">
                  Cashflow Summary
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Income</span>
                    <span className="font-bold text-green-600">${totalIncome.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Expenses</span>
                    <span className="font-bold text-red-600">${totalExpenses.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Net Cashflow</span>
                    <span className={netCashflow >= 0 ? "text-green-700" : "text-red-700"}>
                      ${netCashflow.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <ChartPieDonutText />
                </div>
              </CardContent>
            </Card>
            <div className="mt-2 flex justify-end">
              <a href="https://www.realty-ai.com" className="hover:text-blue-500">
                <p>Powered By Realty AI</p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CashflowCalculator; 