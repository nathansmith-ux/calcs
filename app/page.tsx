"use client"

import { useReducer } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link";

export default function MortgageCalculator() {

  // Define state and action types
  type State = {
    isCondo: boolean;
    condoFee: string;
    mortgageAmount: string;
    interestRate: string;
    paymentFrequency: string;
    rateTerm: string;
    amortization: string;
  };

  type Action =
    | { type: 'SET_IS_CONDO'; payload: boolean }
    | { type: 'SET_CONDO_FEE'; payload: string }
    | { type: 'SET_MORTGAGE_AMOUNT'; payload: string }
    | { type: 'SET_INTEREST_RATE'; payload: string }
    | { type: 'SET_PAYMENT_FREQUENCY'; payload: string }
    | { type: 'SET_RATE_TERM'; payload: string }
    | { type: 'SET_AMORTIZATION'; payload: string };

  // Define initial state
  const initialState: State = {
    isCondo: false,
    condoFee: '',
    mortgageAmount: '100000',
    interestRate: '4.25',
    paymentFrequency: 'monthly',
    rateTerm: 'fiveYear',
    amortization: 'twentyFiveYear',
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
      case 'SET_PAYMENT_FREQUENCY':
        return { ...state, paymentFrequency: action.payload };
      case 'SET_RATE_TERM':
        return { ...state, rateTerm: action.payload };
      case 'SET_AMORTIZATION':
        return { ...state, amortization: action.payload };
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

  // Simple mortgage payment calculation (not amortized, just for display)
  function calculatePayment() {
    const principal = Number(state.mortgageAmount);
    const rate = Number(state.interestRate);
    if (!principal || !rate) return '-';
    let freq = state.paymentFrequency || 'monthly';
    let periodsPerYear = 12;
    if (freq === 'biweekly') periodsPerYear = 26;
    if (freq === 'weekly') periodsPerYear = 52;
    // Simple interest per period (not amortized)
    const payment = principal * (rate / 100) / periodsPerYear;
    return payment ? `$${payment.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '-';
  }

  return (
    <main className="max-w-7xl mx-auto">
      <section className="grid grid-cos-1 md:grid-cols-2 gap-4 md:gap-8 pt-20">
        <div className="w-full">
          <h1 className="text-4xl font-bold text-brand-primary">
            Mortgage Calculator
          </h1>
          <p className="mt-3">Plan your mortgage with precision using Team Logue's mortgage calculators. Our calculators helps you estimate mortgage payments and potential savings.</p>
          <div className="flex items-center space-x-2 mt-3">
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
                  type="number"
                  placeholder="$750"
                  value={state.condoFee}
                  onChange={e => dispatch({ type: 'SET_CONDO_FEE', payload: e.target.value })}
                />
              </div>
            </>  
          )}
          <section className="grid grid-cols-6 gap-6 my-6 lg:my-12">
            <div className="col-span-4">
              <Input
                type="number"
                placeholder="Mortgage Amount"
                value={state.mortgageAmount}
                onChange={e => dispatch({ type: 'SET_MORTGAGE_AMOUNT', payload: e.target.value })}
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
              <div className="col-span-3">
                <Input
                  type="number"
                  placeholder="2.5%"
                  value={state.interestRate}
                  onChange={e => dispatch({ type: 'SET_INTEREST_RATE', payload: e.target.value })}
                />
                <div className="mt-2">
                  <Slider
                    value={[Number(state.interestRate) || 0]}
                    max={20}
                    min={0}
                    step={0.01}
                    onValueChange={([val]) => dispatch({ type: 'SET_INTEREST_RATE', payload: String(val) })}
                  />
                </div>
              </div>
              <div className="col-span-1">
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
              <div className="col-span-2 pl-6">
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
              <h2 className="ml-2">Payments over Time</h2>
            </div>
            <div className="mt-3">
              <p>Your mortgage interest rate can either be Fixed for the term or Variable (which changes with the prime rate). The Rate Term is the contract length with a lender.</p>
            </div>
            <section className="mt-6">
              <ChartBarLabel />
            </section>
          </section>
        </div>
        <div className="w-full relative">
          <div className="sticky top-12">
              <Card>
                <CardHeader>
                  <CardTitle>{calculatePayment()}</CardTitle>
                  <CardDescription>{paymentPeriodLabel(state.paymentFrequency)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="payment">
                    <TabsList>
                      <TabsTrigger value="payment">Payment</TabsTrigger>
                      {/* <TabsTrigger value="term">Term</TabsTrigger> */}
                      <TabsTrigger value="total">Total</TabsTrigger>
                    </TabsList>
                    <TabsContent value="payment">
                      <div>
                        {/* Email input removed */}
                        {/* <Input type="email" placeholder="Email" /> */}
                        {/* <div className="mt-2">
                          <Slider defaultValue={[33]} max={100} step={1} />
                        </div> */}
                      </div>
                    </TabsContent>
                    {/* <TabsContent value="term">
                      <ChartBarLabel />
                    </TabsContent> */}
                    <TabsContent value="total">
                      <ChartPieLabel />
                    </TabsContent>
                  </Tabs>
                  <Separator className="my-4" />
                  {/* Display summary info here */}
                  <div className="space-y-2">
                    <p><span className="font-semibold">Mortgage Amount:</span> {state.mortgageAmount ? `$${Number(state.mortgageAmount).toLocaleString()}` : '-'}</p>
                    <p><span className="font-semibold">Interest Rate:</span> {state.interestRate ? `${state.interestRate}%` : '-'}</p>
                    <p><span className="font-semibold">Payment Frequency:</span> {state.paymentFrequency ? state.paymentFrequency.charAt(0).toUpperCase() + state.paymentFrequency.slice(1) : '-'}</p>
                    <p><span className="font-semibold">Rate Term:</span> {state.rateTerm ? state.rateTerm.replace('Year', ' Year') : '-'}</p>
                    <p><span className="font-semibold">Amortization:</span> {state.amortization ? state.amortization.replace('Year', ' Year') : '-'}</p>
                    {state.isCondo && (
                      <p><span className="font-semibold">Condo Fee:</span> {state.condoFee ? `$${Number(state.condoFee).toLocaleString()}` : '-'}</p>
                    )}
                  </div>
                  <Separator className="my-4" />
                    <div>
                      <p>Total Mortgage Payment</p>
                    </div>
                  <Separator className="my-4" />
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
