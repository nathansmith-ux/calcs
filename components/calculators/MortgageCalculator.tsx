"use client"

import { useReducer } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChartBarLabel } from "@/components/ui/chart-bar-label";
import { ChartPieLabel } from "@/components/ui/chart-pie-label"
import { Percent, HandCoins } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label"
import Link from "next/link";

type PaymentTabDetailsProps = {
  principal: string;
  interestRate: string;
  paymentFrequency: string;
  calculatePayment: () => string | number;
  paymentPeriodLabel: (freq: string) => string;
};

function PaymentTabDetails({ principal, interestRate, paymentFrequency, calculatePayment, paymentPeriodLabel }: PaymentTabDetailsProps) {
  // Calculate interest per period
  const principalNum = Number(principal);
  const rateNum = Number(interestRate);
  let periodsPerYear = 12;
  if (paymentFrequency === "biweekly") periodsPerYear = 26;
  if (paymentFrequency === "weekly") periodsPerYear = 52;
  const interestPerPeriod = (principalNum && rateNum)
    ? principalNum * (rateNum / 100) / periodsPerYear
    : null;

  return (
    <div className="space-y-4">
      <div>
        <span className="block text-lg font-semibold mb-1">Principal</span>
        <span className="text-2xl font-bold text-brand-primary">
          {principalNum ? `$${principalNum.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "-"}
        </span>
      </div>
      <div>
        <span className="block text-lg font-semibold mb-1">Interest per period</span>
        <span className="text-2xl font-bold text-brand-primary">
          {interestPerPeriod !== null ? `$${interestPerPeriod.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "-"}
        </span>
      </div>
      <div>
        <span className="block text-lg font-semibold mb-1">Total Payment per period</span>
        <span className="text-2xl font-bold text-brand-primary">
          {(() => {
            const payment = calculatePayment();
            if (typeof payment === "string" && payment.startsWith("$")) {
              const num = Number(payment.replace(/[^0-9.]/g, ""));
              return `$${num.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
            }
            return payment;
          })()}
        </span>
        <span className="text-muted-foreground text-base ml-2 align-middle">
          {paymentPeriodLabel(paymentFrequency)}
        </span>
      </div>
    </div>
  );
}

function MortgageCalculator() {
  // Define state and action types
  type State = {
    isCondo: boolean;
    condoFee: string;
    mortgageAmount: string;
    interestRate: string;
    interestType: string;
    paymentFrequency: string;
    rateTerm: string;
    amortization: string;
    extraRecurringPayment: {
      amount: string;
      frequency: string;
    };
    extraOneTimePayment: {
      amount: string;
      year: string;
    };
  };

  type Action =
    | { type: 'SET_IS_CONDO'; payload: boolean }
    | { type: 'SET_CONDO_FEE'; payload: string }
    | { type: 'SET_MORTGAGE_AMOUNT'; payload: string }
    | { type: 'SET_INTEREST_RATE'; payload: string }
    | { type: 'SET_INTEREST_TYPE'; payload: string }
    | { type: 'SET_PAYMENT_FREQUENCY'; payload: string }
    | { type: 'SET_RATE_TERM'; payload: string }
    | { type: 'SET_AMORTIZATION'; payload: string }
    | { type: 'SET_EXTRA_RECURRING_PAYMENT_AMOUNT'; payload: string }
    | { type: 'SET_EXTRA_RECURRING_PAYMENT_FREQUENCY'; payload: string }
    | { type: 'SET_EXTRA_ONE_TIME_PAYMENT_AMOUNT'; payload: string }
    | { type: 'SET_EXTRA_ONE_TIME_PAYMENT_YEAR'; payload: string };

  // Define initial state
  const initialState: State = {
    isCondo: false,
    condoFee: '',
    mortgageAmount: '100000',
    interestRate: '4.25',
    interestType: 'fixed',
    paymentFrequency: 'monthly',
    rateTerm: 'fiveYear',
    amortization: 'twentyFiveYear',
    extraRecurringPayment: {
      amount: '',
      frequency: 'monthly',
    },
    extraOneTimePayment: {
      amount: '',
      year: '',
    },
  };

  // Reducer function
  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'SET_IS_CONDO':
        return { ...state, isCondo: action.payload };
      case 'SET_CONDO_FEE':
        return { ...state, condoFee: action.payload };
      case 'SET_MORTGAGE_AMOUNT':
        return { ...state, mortgageAmount: action.payload };
      case 'SET_INTEREST_RATE':
        return { ...state, interestRate: action.payload };
      case 'SET_INTEREST_TYPE':
        return { ...state, interestType: action.payload };
      case 'SET_PAYMENT_FREQUENCY':
        return { ...state, paymentFrequency: action.payload };
      case 'SET_RATE_TERM':
        return { ...state, rateTerm: action.payload };
      case 'SET_AMORTIZATION':
        return { ...state, amortization: action.payload };
      case 'SET_EXTRA_RECURRING_PAYMENT_AMOUNT':
        return { ...state, extraRecurringPayment: { ...state.extraRecurringPayment, amount: action.payload } };
      case 'SET_EXTRA_RECURRING_PAYMENT_FREQUENCY':
        return { ...state, extraRecurringPayment: { ...state.extraRecurringPayment, frequency: action.payload } };
      case 'SET_EXTRA_ONE_TIME_PAYMENT_AMOUNT':
        return { ...state, extraOneTimePayment: { ...state.extraOneTimePayment, amount: action.payload } };
      case 'SET_EXTRA_ONE_TIME_PAYMENT_YEAR':
        return { ...state, extraOneTimePayment: { ...state.extraOneTimePayment, year: action.payload } };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSetCondo = () => {
    dispatch({ type: 'SET_IS_CONDO', payload: !state.isCondo });
  }

  // Helper to get payment period label
  const paymentPeriodLabel = (freq: string) => {
    switch (freq || 'monthly') {
      case 'monthly':
        return 'Monthly';
      case 'biweekly':
        return 'Bi-Weekly';
      case 'weekly':
        return 'Weekly';
      default:
        return 'Monthly';
    }
  };

  // Simple function to generate chart data based on state
  function generateChartData() {
    const principal = Number(state.mortgageAmount);
    const rate = Number(state.interestRate) / 100;
    let years = 25;
    switch (state.amortization) {
      case "fiveYear": years = 5; break;
      case "tenYear": years = 10; break;
      case "fifteenYear": years = 15; break;
      case "twentyYear": years = 20; break;
      case "twentyFiveYear": years = 25; break;
      case "thirtyYear": years = 30; break;
    }
    if (!principal || !rate || !years) return [];
    // Simple linear decrease for demo (not real amortization)
    const yearlyDecrease = principal / years;
    let balance = principal;
    const data = [];
    for (let year = 1; year <= years; year++) {
      balance -= yearlyDecrease;
      if (balance < 0) balance = 0;
      data.push({ year: year.toString(), total: Math.round(balance) });
      if (balance <= 0) break;
    }
    return data;
  }

  // Replace static chartData with dynamic
  const chartData = generateChartData();

  // Amortized mortgage payment calculation using selected amortization period
  function calculatePayment() {
    const principal = Number(state.mortgageAmount);
    const rate = Number(state.interestRate) / 100;
    let years = 25;
    switch (state.amortization) {
      case "fiveYear": years = 5; break;
      case "tenYear": years = 10; break;
      case "fifteenYear": years = 15; break;
      case "twentyYear": years = 20; break;
      case "twentyFiveYear": years = 25; break;
      case "thirtyYear": years = 30; break;
    }
    if (!principal || !years) return '-';
    let freq = state.paymentFrequency || 'monthly';
    let periodsPerYear = 12;
    if (freq === 'biweekly') periodsPerYear = 26;
    if (freq === 'weekly') periodsPerYear = 52;
    const n = years * periodsPerYear;
    const periodRate = rate / periodsPerYear;
    // Amortized payment formula
    const payment = periodRate === 0
      ? principal / n
      : principal * (periodRate * Math.pow(1 + periodRate, n)) / (Math.pow(1 + periodRate, n) - 1);
    return payment ? `$${payment.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '-';
  }

  // Calculate pie chart data based on state
  function getPieChartData() {
    const principal = Number(state.mortgageAmount);
    const rate = Number(state.interestRate) / 100;
    let years = 25;
    switch (state.amortization) {
      case "fiveYear": years = 5; break;
      case "tenYear": years = 10; break;
      case "fifteenYear": years = 15; break;
      case "twentyYear": years = 20; break;
      case "twentyFiveYear": years = 25; break;
      case "thirtyYear": years = 30; break;
    }
    if (!principal || !rate || !years) return [];

    // Calculate extra principal paid
    let extraPrincipal = 0;
    const recurringAmount = Number(state.extraRecurringPayment.amount) || 0;
    const recurringFreq = state.extraRecurringPayment.frequency;
    let recurringPeriods = 0;
    if (recurringAmount > 0) {
      if (recurringFreq === 'monthly') recurringPeriods = years * 12;
      if (recurringFreq === 'biweekly') recurringPeriods = years * 26;
      if (recurringFreq === 'weekly') recurringPeriods = years * 52;
      extraPrincipal += recurringAmount * recurringPeriods;
    }
    const oneTimeAmount = Number(state.extraOneTimePayment.amount) || 0;
    const oneTimeYear = Number(state.extraOneTimePayment.year) || 0;
    if (oneTimeAmount > 0 && oneTimeYear > 0 && oneTimeYear <= years) {
      extraPrincipal += oneTimeAmount;
    }

    // Simple interest calculation for demo (not amortized)
    const totalInterest = principal * rate * years;
    const principalPaid = principal; // Assume all principal is paid over the term
    const remainingPrincipal = 0; // Assume paid off at end of term

    // If no extra principal, return original pie chart
    if (!extraPrincipal) {
      return [
        { label: "Principle Paid", value: principalPaid, fill: "black0" },
        { label: "Interest Paid", value: totalInterest, fill: "var(--color-brand-primary)" },
        { label: "Remaining Principle", value: remainingPrincipal, fill: "var(--color-brand-secondary)" },
      ];
    }

    // If extra principal, show it as a separate slice
    return [
      { label: "Principle Paid", value: principalPaid, fill: "black0" },
      { label: "Extra Principal Paid", value: extraPrincipal, fill: "#4ade80" }, // green
      { label: "Interest Paid", value: totalInterest, fill: "var(--color-brand-primary)" },
      { label: "Remaining Principle", value: remainingPrincipal, fill: "var(--color-brand-secondary)" },
    ];
  }

  const pieChartData = getPieChartData();

  // Function to generate accelerated mortgage payoff data
  function generateAcceleratedChartData() {
    const principal = Number(state.mortgageAmount);
    const rate = Number(state.interestRate) / 100;
    let years = 25;
    switch (state.amortization) {
      case "fiveYear": years = 5; break;
      case "tenYear": years = 10; break;
      case "fifteenYear": years = 15; break;
      case "twentyYear": years = 20; break;
      case "twentyFiveYear": years = 25; break;
      case "thirtyYear": years = 30; break;
    }
    if (!principal || !rate || !years) return [];

    // Payment frequency
    let freq = state.paymentFrequency || 'monthly';
    let periodsPerYear = 12;
    if (freq === 'biweekly') periodsPerYear = 26;
    if (freq === 'weekly') periodsPerYear = 52;

    // Recurring extra payment
    const recurringAmount = Number(state.extraRecurringPayment.amount) || 0;
    const recurringFreq = state.extraRecurringPayment.frequency;
    let recurringPeriodsPerYear = 0;
    if (recurringFreq === 'monthly') recurringPeriodsPerYear = 12;
    if (recurringFreq === 'biweekly') recurringPeriodsPerYear = 26;
    if (recurringFreq === 'weekly') recurringPeriodsPerYear = 52;

    // One-time extra payment
    const oneTimeAmount = Number(state.extraOneTimePayment.amount) || 0;
    const oneTimeYear = Number(state.extraOneTimePayment.year) || 0;

    // Standard payment per period (using simple amortization formula)
    const monthlyRate = rate / 12;
    const n = years * 12;
    const payment = monthlyRate === 0
      ? principal / n
      : principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);

    // Accelerated payoff simulation
    let balance = principal;
    let data = [];
    let year = 1;
    let month = 1;
    let totalMonths = 0;
    while (balance > 0 && year <= years * 2) { // allow for early payoff
      // Standard payment
      let paymentThisMonth = payment;
      // Add recurring extra payment (convert to monthly)
      if (recurringAmount > 0 && recurringPeriodsPerYear > 0) {
        paymentThisMonth += recurringAmount * (recurringPeriodsPerYear / 12);
      }
      // Add one-time payment if this is the right month
      if (oneTimeAmount > 0 && oneTimeYear === year && month === 1) {
        paymentThisMonth += oneTimeAmount;
      }
      // Interest for this month
      const interest = balance * monthlyRate;
      // Principal paid
      let principalPaid = paymentThisMonth - interest;
      if (principalPaid > balance) principalPaid = balance;
      balance -= principalPaid;
      if (balance < 0) balance = 0;
      if (month === 12 || balance === 0) {
        data.push({ year: year.toString(), total: Math.round(balance) });
      }
      month++;
      totalMonths++;
      if (month > 12) {
        month = 1;
        year++;
      }
      if (totalMonths > years * 12 * 2) break; // safety
    }
    return data;
  }

  // Show accelerated chart as standard unless extra payment info is present
  const hasExtraPayments =
    (Number(state.extraRecurringPayment.amount) > 0) ||
    (Number(state.extraOneTimePayment.amount) > 0 && Number(state.extraOneTimePayment.year) > 0);
  const acceleratedChartData = hasExtraPayments ? generateAcceleratedChartData() : chartData;

  return (
    <main className="max-w-7xl mx-auto">
      <section className="grid grid-cos-1 md:grid-cols-2 gap-4 md:gap-8 pt-20">
        <div className="w-full">
          <h1 className="text-4xl font-bold text-brand-primary">
            Mortgage Calculator
          </h1>
          <p className="mt-3">Plan your mortgage with precision using Team Logue's mortgage calculators. Our calculators helps you estimate mortgage payments and potential savings.</p>
          {/* <div className="flex items-center space-x-2 mt-3">
            <Switch
              id="condo-mode"
              checked={state.isCondo}
              onCheckedChange={handleSetCondo}
            />
            <Label htmlFor="condo-mode">Living In a Condo</Label>
          </div> 
          {state.isCondo && (
            <>
              <p className="text-sm text-brand-primary mt-3">You need to account for condo fees as this will contribute to your total monthly costs. Please add your condo/maintenance fees to the below</p>
              <div className="mt-3 w-1/4">
                <Input
                  type="text"
                  placeholder="$750"
                  value={state.condoFee ? Number(state.condoFee).toLocaleString("en-US", { maximumFractionDigits: 0 }) : ''}
                  onChange={e => {
                    const raw = e.target.value.replace(/[^\d.]/g, '');
                    dispatch({ type: 'SET_CONDO_FEE', payload: raw });
                  }}
                />
              </div>
            </>  
          )} */}
          <section className="grid grid-cols-6 gap-6 my-6 lg:my-12">
            <div className="col-span-4">
              <Input
                type="text"
                placeholder="Mortgage Amount"
                value={state.mortgageAmount ? Number(state.mortgageAmount).toLocaleString("en-US", { maximumFractionDigits: 0 }) : ''}
                onChange={e => {
                  const raw = e.target.value.replace(/[^\d.]/g, '');
                  dispatch({ type: 'SET_MORTGAGE_AMOUNT', payload: raw });
                }}
              />
              <div className="mt-2">
                <Slider
                  value={[Number(state.mortgageAmount) || 0]}
                  max={2000000}
                  min={0}
                  step={1000}
                  onValueChange={([val]) => dispatch({ type: 'SET_MORTGAGE_AMOUNT', payload: String(val) })}
                />
              </div>              
              </div>
            <div className="col-span-2">
            <Select
              value={state.paymentFrequency}
              onValueChange={val => dispatch({ type: 'SET_PAYMENT_FREQUENCY', payload: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Payment frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Payment Frequency</SelectLabel>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            </div>
          </section>
            <Separator className="my-4" />
          <section className="my-6 lg:my-12">
            <div className="flex items-center">
              <Percent strokeWidth={0.5} size={20}/>
              <h2 className="ml-2">Interest Rate</h2>
            </div>
            <div className="mt-3">
              <p>Your mortgage interest rate can either be Fixed for the term or Variable (which changes with the prime rate). The Rate Term is the contract length with a lender.</p>
            </div>
            <section className="grid grid-cols-6 gap-6 mt-6">
              <div className="col-span-2 flex items-center">
                <Input
                  type="text"
                  placeholder="2.5%"
                  value={state.interestRate ? Number(state.interestRate).toLocaleString("en-US", { maximumFractionDigits: 2 }) : ''}
                  onChange={e => {
                    const raw = e.target.value.replace(/[^\d.]/g, '');
                    dispatch({ type: 'SET_INTEREST_RATE', payload: raw });
                  }}
                />
              </div>
              <div className="col-span-1 flex items-center">
                <Select
                  value={state.rateTerm}
                  onValueChange={val => dispatch({ type: 'SET_RATE_TERM', payload: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Rate term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Rate Term</SelectLabel>
                      <SelectItem value="fiveYear">5 Year</SelectItem>
                      <SelectItem value="tenYear">10 Year</SelectItem>
                      <SelectItem value="fifteenYear">15 Year</SelectItem>
                      <SelectItem value="twentyYear">20 Year</SelectItem>
                      <SelectItem value="twentyFiveYear">25 Year</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3 pl-6 flex items-center space-x-2">
                <Select
                  value={state.amortization}
                  onValueChange={val => dispatch({ type: 'SET_AMORTIZATION', payload: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Amortization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Amortization</SelectLabel>
                      <SelectItem value="fiveYear">5 Year</SelectItem>
                      <SelectItem value="tenYear">10 Year</SelectItem>
                      <SelectItem value="fifteenYear">15 Year</SelectItem>
                      <SelectItem value="twentyYear">20 Year</SelectItem>
                      <SelectItem value="twentyFiveYear">25 Year</SelectItem>
                      <SelectItem value="thirtyYear">30 Year</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  value={state.interestType}
                  onValueChange={val => dispatch({ type: 'SET_INTEREST_TYPE', payload: val })}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Interest Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Interest Type</SelectLabel>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="variable">Variable</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </section>
          </section>
            <Separator className="my-4" />
            <section className="my-6 lg:my-12">
            <div className="flex items-center">
              <HandCoins strokeWidth={0.5} size={20}/>
              <h2 className="ml-2">Pay Off Mortgage Faster</h2>
            </div>
            <div className="mt-3">
              <p>Accelerate your mortgage payoff by making extra payments. You can add recurring extra payments or a one-time lump sum payment.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Recurring Extra Payment</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    type="text"
                    placeholder="$100"
                    value={state.extraRecurringPayment.amount ? Number(state.extraRecurringPayment.amount).toLocaleString("en-US", { maximumFractionDigits: 0 }) : ''}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d.]/g, '');
                      dispatch({ type: 'SET_EXTRA_RECURRING_PAYMENT_AMOUNT', payload: raw });
                    }}
                    className="w-24"
                  />
                  <Select
                    value={state.extraRecurringPayment.frequency}
                    onValueChange={val => dispatch({ type: 'SET_EXTRA_RECURRING_PAYMENT_FREQUENCY', payload: val })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Frequency</SelectLabel>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>One-Time Extra Payment</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    type="text"
                    placeholder="$5000"
                    value={state.extraOneTimePayment.amount ? Number(state.extraOneTimePayment.amount).toLocaleString("en-US", { maximumFractionDigits: 0 }) : ''}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d.]/g, '');
                      dispatch({ type: 'SET_EXTRA_ONE_TIME_PAYMENT_AMOUNT', payload: raw });
                    }}
                    className="w-24"
                  />
                  <Input
                    type="text"
                    placeholder="Year (e.g. 3)"
                    value={state.extraOneTimePayment.year}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d]/g, '');
                      dispatch({ type: 'SET_EXTRA_ONE_TIME_PAYMENT_YEAR', payload: raw });
                    }}
                    className="w-24"
                  />
                </div>
              </div>
            </div>
            {/* Explanation for additional payments */}
            <div className="mt-4 bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-base mb-2">How to Use Additional Payments</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li><strong>Recurring Extra Payment:</strong> Enter an amount (e.g., $100) and select how often you want to make this extra payment (monthly, bi-weekly, or weekly). This amount will be added to every regular payment, helping you pay down your principal faster.</li>
                <li><strong>One-Time Extra Payment:</strong> Enter a lump sum amount (e.g., $5,000) and specify the year (e.g., 3) when you plan to make this payment. This amount will be applied directly to your principal in the chosen year.</li>
                <li>Both types of extra payments reduce your mortgage balance more quickly, saving you money on interest and shortening your overall payoff period. Try different values to see how much you can save!</li>
              </ul>
            </div>
          </section>
            <Separator className="my-4" />
            <section className="my-6 lg:my-12">
            <div className="flex items-center">
              <HandCoins strokeWidth={0.5} size={20}/>
              <h2 className="ml-2">Payments over Time</h2>
            </div>
            <div className="mt-3">
              <p>Your mortgage interest rate can either be Fixed for the term or Variable (which changes with the prime rate). The Rate Term is the contract length with a lender.</p>
            </div>
            <Separator className="my-4" />
            <section className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Standard Mortgage Payoff Timeline</h3>
              <p className="mb-4 text-muted-foreground text-sm">This chart shows your mortgage balance decreasing over time with your current payment schedule, without any extra payments.</p>
              <ChartBarLabel 
                title="Mortgage Balance Over Time"
                data={chartData}
              />
            </section>
            <Separator className="my-4" />
            {/* Accelerated payoff graph */}
            <section className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Accelerated Mortgage Payoff Timeline</h3>
              <p className="mb-4 text-muted-foreground text-sm">This chart shows how your mortgage balance decreases more quickly when you make extra payments, allowing you to pay off your mortgage sooner and save on interest.</p>
              <ChartBarLabel 
                title="Accelerated Mortgage Payoff (with Extra Payments)"
                data={acceleratedChartData}
              />
            </section>
            {/* Explanation of accelerated payoff */}
            <section className="mt-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">How Extra Payments Save You Money</h3>
                <p>
                  By making extra payments—either recurring or as a one-time lump sum—you reduce your mortgage principal faster. This means less interest accrues over time, since interest is calculated on a lower balance each month. As a result, you pay off your mortgage sooner and save significantly on total interest costs. The accelerated payoff chart above shows how your balance drops more quickly and your loan is paid off earlier compared to the standard schedule. The more you pay extra, and the earlier you start, the greater your savings and the faster you become mortgage-free.
                </p>
              </div>
            </section>
          </section>
        </div>
        <div className="w-full relative">
          <div className="sticky top-12">
              <Card>
                <CardHeader className="pb-2">
                  <div className="text-muted-foreground text-base font-medium mb-1">Mortgage Payment</div>
                  <div className="flex items-end space-x-2">
                    <span className="text-5xl font-extrabold text-brand-primary leading-none">
                      {(() => {
                        const payment = calculatePayment();
                        if (typeof payment === "string" && payment.startsWith("$") ) {
                          return payment;
                        }
                        return payment;
                      })()}
                    </span>
                    <span className="text-2xl font-bold text-brand-primary leading-none mb-1">
                      {paymentPeriodLabel(state.paymentFrequency)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="payment">
                    <TabsList>
                      <TabsTrigger value="payment">Payment</TabsTrigger>
                      {/* <TabsTrigger value="term">Term</TabsTrigger> */}
                      <TabsTrigger value="total">Total</TabsTrigger>
                    </TabsList>
                    <TabsContent value="payment">
                    <Separator className="my-4" />
                      <PaymentTabDetails
                        principal={state.mortgageAmount}
                        interestRate={state.interestRate}
                        paymentFrequency={state.paymentFrequency}
                        calculatePayment={calculatePayment}
                        paymentPeriodLabel={paymentPeriodLabel}
                      />
                    </TabsContent>
                    <TabsContent value="total">
                      <ChartPieLabel 
                        title="Breakdown"
                        data={pieChartData}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
          <div className="mt-2 flex justify-end">
            <Link href="https://www.realty-ai.com" className="hover:text-blue-500">
              <p>Powered By Realty AI</p>
            </Link>
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MortgageCalculator;
// ... existing code ... 