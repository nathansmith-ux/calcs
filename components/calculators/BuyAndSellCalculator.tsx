"use client"

import { useReducer } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Input
} from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Types for state
interface State {
  mode: "sell" | "buy";
  // Sell fields
  sellPrice: string;
  mortgageBalance: string;
  realtorFeePercent: string;
  legalFees: string;
  otherCosts: string;
  // Buy fields
  buyPrice: string;
  downPayment: string;
  useSellProceeds: boolean;
  mortgageRate: string;
  amortization: string;
  closingCosts: string;
}

type Action =
  | { type: 'SET_MODE'; payload: "sell" | "buy" }
  | { type: 'SET_SELL_PRICE'; payload: string }
  | { type: 'SET_MORTGAGE_BALANCE'; payload: string }
  | { type: 'SET_REALTOR_FEE_PERCENT'; payload: string }
  | { type: 'SET_LEGAL_FEES'; payload: string }
  | { type: 'SET_OTHER_COSTS'; payload: string }
  | { type: 'SET_BUY_PRICE'; payload: string }
  | { type: 'SET_DOWN_PAYMENT'; payload: string }
  | { type: 'SET_USE_SELL_PROCEEDS'; payload: boolean }
  | { type: 'SET_MORTGAGE_RATE'; payload: string }
  | { type: 'SET_AMORTIZATION'; payload: string }
  | { type: 'SET_CLOSING_COSTS'; payload: string };

const initialState: State = {
  mode: "sell",
  sellPrice: "900000",
  mortgageBalance: "500000",
  realtorFeePercent: "5",
  legalFees: "1500",
  otherCosts: "2000",
  buyPrice: "1000000",
  downPayment: "",
  useSellProceeds: true,
  mortgageRate: "4",
  amortization: "25",
  closingCosts: "2000",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_SELL_PRICE':
      return { ...state, sellPrice: action.payload };
    case 'SET_MORTGAGE_BALANCE':
      return { ...state, mortgageBalance: action.payload };
    case 'SET_REALTOR_FEE_PERCENT':
      return { ...state, realtorFeePercent: action.payload };
    case 'SET_LEGAL_FEES':
      return { ...state, legalFees: action.payload };
    case 'SET_OTHER_COSTS':
      return { ...state, otherCosts: action.payload };
    case 'SET_BUY_PRICE':
      return { ...state, buyPrice: action.payload };
    case 'SET_DOWN_PAYMENT':
      return { ...state, downPayment: action.payload };
    case 'SET_USE_SELL_PROCEEDS':
      return { ...state, useSellProceeds: action.payload };
    case 'SET_MORTGAGE_RATE':
      return { ...state, mortgageRate: action.payload };
    case 'SET_AMORTIZATION':
      return { ...state, amortization: action.payload };
    case 'SET_CLOSING_COSTS':
      return { ...state, closingCosts: action.payload };
    default:
      return state;
  }
}

function calculateSellNet(state: State) {
  const price = Number(state.sellPrice) || 0;
  const mortgage = Number(state.mortgageBalance) || 0;
  const realtorFee = price * (Number(state.realtorFeePercent) / 100);
  const legal = Number(state.legalFees) || 0;
  const other = Number(state.otherCosts) || 0;
  const net = price - mortgage - realtorFee - legal - other;
  return {
    price,
    mortgage,
    realtorFee,
    legal,
    other,
    net: Math.max(net, 0)
  };
}

function calculateBuy(state: State, sellNet: number) {
  const price = Number(state.buyPrice) || 0;
  const closing = Number(state.closingCosts) || 0;
  const useSell = state.useSellProceeds;
  let down = useSell ? sellNet : Number(state.downPayment) || 0;
  if (down > price) down = price;
  const mortgage = price - down;
  const rate = Number(state.mortgageRate) / 100;
  const years = Number(state.amortization) || 25;
  const n = years * 12;
  const periodRate = rate / 12;
  const payment = periodRate === 0 ? mortgage / n : mortgage * (periodRate * Math.pow(1 + periodRate, n)) / (Math.pow(1 + periodRate, n) - 1);
  return {
    price,
    down,
    mortgage,
    closing,
    payment: mortgage > 0 ? payment : 0
  };
}

function BuyAndSellCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const sell = calculateSellNet(state);
  const buy = calculateBuy(state, sell.net);

  return (
    <main className="max-w-7xl mx-auto">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 pt-20">
        {/* Left: Inputs and Explanations */}
        <div className="w-full">
          <div className="flex items-center mb-6">
            <Switch
              id="mode-switch"
              checked={state.mode === "buy"}
              onCheckedChange={checked => dispatch({ type: 'SET_MODE', payload: checked ? "buy" : "sell" })}
            />
            <Label htmlFor="mode-switch" className="ml-2 text-lg font-semibold">
              {state.mode === "sell" ? "Sell Mode" : "Buy Mode"}
            </Label>
          </div>
          {state.mode === "sell" ? (
            <>
              <h1 className="text-3xl font-bold text-brand-primary mb-2">Sell Calculator</h1>
              <p className="mb-4">Estimate how much you will walk away with after selling your property.</p>
              <div className="grid grid-cols-2 gap-6 my-6 lg:my-12">
                <div>
                  <Label>Sale Price</Label>
                  <Input
                    className="mt-2"
                    type="text"
                    placeholder="$900,000"
                    value={state.sellPrice ? Number(state.sellPrice).toLocaleString("en-US", { maximumFractionDigits: 0 }) : ''}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d.]/g, '');
                      dispatch({ type: 'SET_SELL_PRICE', payload: raw });
                    }}
                  />
                  <div className="mt-2">
                    <Slider
                      value={[Number(state.sellPrice) || 0]}
                      max={2000000}
                      min={0}
                      step={10000}
                      onValueChange={([val]) => dispatch({ type: 'SET_SELL_PRICE', payload: String(val) })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Mortgage Balance</Label>
                  <Input
                    className="mt-2"
                    type="text"
                    placeholder="$500,000"
                    value={state.mortgageBalance ? Number(state.mortgageBalance).toLocaleString("en-US", { maximumFractionDigits: 0 }) : ''}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d.]/g, '');
                      dispatch({ type: 'SET_MORTGAGE_BALANCE', payload: raw });
                    }}
                  />
                </div>
                <div>
                  <Label>Realtor Fee (%)</Label>
                  <Input
                    className="mt-2"
                    type="text"
                    placeholder="5%"
                    value={state.realtorFeePercent}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d.]/g, '');
                      dispatch({ type: 'SET_REALTOR_FEE_PERCENT', payload: raw });
                    }}
                  />
                </div>
                <div>
                  <Label>Legal Fees</Label>
                  <Input
                    className="mt-2"
                    type="text"
                    placeholder="$1,500"
                    value={state.legalFees ? Number(state.legalFees).toLocaleString("en-US", { maximumFractionDigits: 0 }) : ''}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d.]/g, '');
                      dispatch({ type: 'SET_LEGAL_FEES', payload: raw });
                    }}
                  />
                </div>
                <div>
                  <Label>Other Costs</Label>
                  <Input
                    className="mt-2"
                    type="text"
                    placeholder="$2,000"
                    value={state.otherCosts ? Number(state.otherCosts).toLocaleString("en-US", { maximumFractionDigits: 0 }) : ''}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d.]/g, '');
                      dispatch({ type: 'SET_OTHER_COSTS', payload: raw });
                    }}
                  />
                </div>
              </div>
              <div className="mt-4 bg-muted p-4 rounded-lg">
                <h3 className="font-semibold text-base mb-2">How Net Proceeds Are Calculated</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li><strong>Sale Price:</strong> The price your home sells for.</li>
                  <li><strong>Mortgage Balance:</strong> The remaining amount owed on your mortgage.</li>
                  <li><strong>Realtor Fee:</strong> Typically 5% of sale price (can vary).</li>
                  <li><strong>Legal Fees & Other Costs:</strong> Closing and miscellaneous costs.</li>
                  <li><strong>Net Proceeds:</strong> What you walk away with after all costs are paid.</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-brand-primary mb-2">Buy Calculator</h1>
              <p className="mb-4">Estimate your down payment, mortgage, and monthly payment when buying a property. You can use your net proceeds from the sale or enter a custom down payment.</p>
              <div className="grid grid-cols-2 gap-6 my-6 lg:my-12">
                <div>
                  <Label>Purchase Price</Label>
                  <Input
                    className="mt-2"
                    type="text"
                    placeholder="$1,000,000"
                    value={state.buyPrice ? Number(state.buyPrice).toLocaleString("en-US", { maximumFractionDigits: 0 }) : ''}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d.]/g, '');
                      dispatch({ type: 'SET_BUY_PRICE', payload: raw });
                    }}
                  />
                  <div className="mt-2">
                    <Slider
                      value={[Number(state.buyPrice) || 0]}
                      max={2000000}
                      min={0}
                      step={10000}
                      onValueChange={([val]) => dispatch({ type: 'SET_BUY_PRICE', payload: String(val) })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Down Payment</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      type="text"
                      placeholder="$200,000"
                      value={state.useSellProceeds ? (buy.down ? buy.down.toLocaleString("en-US", { maximumFractionDigits: 0 }) : '') : (state.downPayment ? Number(state.downPayment).toLocaleString("en-US", { maximumFractionDigits: 0 }) : '')}
                      onChange={e => {
                        const raw = e.target.value.replace(/[^\d.]/g, '');
                        dispatch({ type: 'SET_DOWN_PAYMENT', payload: raw });
                        dispatch({ type: 'SET_USE_SELL_PROCEEDS', payload: false });
                      }}
                      disabled={state.useSellProceeds}
                    />
                    <Switch
                      id="use-sell-proceeds"
                      checked={state.useSellProceeds}
                      onCheckedChange={checked => dispatch({ type: 'SET_USE_SELL_PROCEEDS', payload: checked })}
                    />
                    <Label htmlFor="use-sell-proceeds" className="text-xs">Use net proceeds from sale</Label>
                  </div>
                </div>
                <div>
                  <Label>Mortgage Rate (%)</Label>
                  <Input
                    className="mt-2"
                    type="text"
                    placeholder="4%"
                    value={state.mortgageRate}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d.]/g, '');
                      dispatch({ type: 'SET_MORTGAGE_RATE', payload: raw });
                    }}
                  />
                </div>
                <div>
                  <Label>Amortization (years)</Label>
                  <Input
                    className="mt-2"
                    type="text"
                    placeholder="25"
                    value={state.amortization}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d]/g, '');
                      dispatch({ type: 'SET_AMORTIZATION', payload: raw });
                    }}
                  />
                </div>
                <div>
                  <Label>Closing Costs</Label>
                  <Input
                    className="mt-2"
                    type="text"
                    placeholder="$2,000"
                    value={state.closingCosts ? Number(state.closingCosts).toLocaleString("en-US", { maximumFractionDigits: 0 }) : ''}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d.]/g, '');
                      dispatch({ type: 'SET_CLOSING_COSTS', payload: raw });
                    }}
                  />
                </div>
              </div>
              <div className="mt-4 bg-muted p-4 rounded-lg">
                <h3 className="font-semibold text-base mb-2">How Your Purchase is Calculated</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li><strong>Purchase Price:</strong> The price of the home you want to buy.</li>
                  <li><strong>Down Payment:</strong> Either your net proceeds from the sale or a custom amount.</li>
                  <li><strong>Mortgage:</strong> The amount you need to borrow after down payment.</li>
                  <li><strong>Mortgage Rate & Amortization:</strong> Used to estimate your monthly payment.</li>
                  <li><strong>Closing Costs:</strong> Legal and other costs to complete the purchase.</li>
                </ul>
              </div>
            </>
          )}
        </div>
        {/* Right: Sticky Results Card */}
        <div className="w-full relative">
          <div className="sticky top-12">
            <Card>
              <CardHeader className="pb-2">
                <div className="text-muted-foreground text-base font-medium mb-1">
                  {state.mode === "sell" ? "Net Proceeds Summary" : "Buy Summary"}
                </div>
              </CardHeader>
              <CardContent>
                {state.mode === "sell" ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Sale Price</span>
                      <span className="font-bold">${sell.price.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mortgage Balance</span>
                      <span>-${sell.mortgage.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Realtor Fee</span>
                      <span>-${sell.realtorFee.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Legal Fees</span>
                      <span>-${sell.legal.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Costs</span>
                      <span>-${sell.other.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Net Proceeds</span>
                      <span className="text-brand-primary">${sell.net.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Purchase Price</span>
                      <span className="font-bold">${buy.price.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Down Payment</span>
                      <span>-${buy.down.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mortgage</span>
                      <span>-${buy.mortgage.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Closing Costs</span>
                      <span>-${buy.closing.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Monthly Payment</span>
                      <span className="text-brand-primary">${buy.payment.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                )}
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

export default BuyAndSellCalculator; 