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
import { Checkbox } from "@/components/ui/checkbox";

// Types for state
interface State {
  mode: "sell" | "buy";
  // Sell fields
  sellPrice: string;
  mortgageBalance: string;
  realtorFeePercent: string;
  legalFees: string;
  otherCosts: string;
  stagingCosts: string;
  photographyCosts: string;
  marketingCosts: string;
  teamLogueProvides: boolean;
  // Buy fields
  buyPrice: string;
  downPayment: string;
  useSellProceeds: boolean;
  closingCosts: string;
  landTransferTax: string;
  isHaltonRegion: boolean;
  isFirstTimeBuyer: boolean;
}

type Action =
  | { type: 'SET_MODE'; payload: "sell" | "buy" }
  | { type: 'SET_SELL_PRICE'; payload: string }
  | { type: 'SET_MORTGAGE_BALANCE'; payload: string }
  | { type: 'SET_REALTOR_FEE_PERCENT'; payload: string }
  | { type: 'SET_LEGAL_FEES'; payload: string }
  | { type: 'SET_OTHER_COSTS'; payload: string }
  | { type: 'SET_STAGING_COSTS'; payload: string }
  | { type: 'SET_PHOTOGRAPHY_COSTS'; payload: string }
  | { type: 'SET_MARKETING_COSTS'; payload: string }
  | { type: 'SET_TEAM_LOGUE_PROVIDES'; payload: boolean }
  | { type: 'SET_BUY_PRICE'; payload: string }
  | { type: 'SET_DOWN_PAYMENT'; payload: string }
  | { type: 'SET_USE_SELL_PROCEEDS'; payload: boolean }
  | { type: 'SET_CLOSING_COSTS'; payload: string }
  | { type: 'SET_LAND_TRANSFER_TAX'; payload: string }
  | { type: 'SET_IS_HALTON_REGION'; payload: boolean }
  | { type: 'SET_IS_FIRST_TIME_BUYER'; payload: boolean };

const initialState: State = {
  mode: "sell",
  sellPrice: "900000",
  mortgageBalance: "500000",
  realtorFeePercent: "5",
  legalFees: "1500",
  otherCosts: "2000",
  stagingCosts: "3000",
  photographyCosts: "500",
  marketingCosts: "1000",
  teamLogueProvides: false,
  buyPrice: "1000000",
  downPayment: "",
  useSellProceeds: true,
  closingCosts: "2000",
  landTransferTax: "0",
  isHaltonRegion: false,
  isFirstTimeBuyer: false,
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
    case 'SET_STAGING_COSTS':
      return { ...state, stagingCosts: action.payload };
    case 'SET_PHOTOGRAPHY_COSTS':
      return { ...state, photographyCosts: action.payload };
    case 'SET_MARKETING_COSTS':
      return { ...state, marketingCosts: action.payload };
    case 'SET_TEAM_LOGUE_PROVIDES':
      return { ...state, teamLogueProvides: action.payload };
    case 'SET_BUY_PRICE':
      return { ...state, buyPrice: action.payload };
    case 'SET_DOWN_PAYMENT':
      return { ...state, downPayment: action.payload };
    case 'SET_USE_SELL_PROCEEDS':
      return { ...state, useSellProceeds: action.payload };
    case 'SET_CLOSING_COSTS':
      return { ...state, closingCosts: action.payload };
    case 'SET_LAND_TRANSFER_TAX':
      return { ...state, landTransferTax: action.payload };
    case 'SET_IS_HALTON_REGION':
      return { ...state, isHaltonRegion: action.payload };
    case 'SET_IS_FIRST_TIME_BUYER':
      return { ...state, isFirstTimeBuyer: action.payload };
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
  
  // Additional costs
  const staging = state.teamLogueProvides ? 0 : (Number(state.stagingCosts) || 0);
  const photography = state.teamLogueProvides ? 0 : (Number(state.photographyCosts) || 0);
  const marketing = state.teamLogueProvides ? 0 : (Number(state.marketingCosts) || 0);
  
  // Calculate HST on fees (13% in Ontario)
  const hstRate = 0.13;
  const hstOnRealtorFee = realtorFee * hstRate;
  const hstOnLegalFees = legal * hstRate;
  const hstOnOtherCosts = other * hstRate;
  const hstOnStaging = staging * hstRate;
  const hstOnPhotography = photography * hstRate;
  const hstOnMarketing = marketing * hstRate;
  
  const totalHST = hstOnRealtorFee + hstOnLegalFees + hstOnOtherCosts + hstOnStaging + hstOnPhotography + hstOnMarketing;
  
  const net = price - mortgage - realtorFee - legal - other - staging - photography - marketing - totalHST;
  
  return {
    price,
    mortgage,
    realtorFee,
    legal,
    other,
    staging,
    photography,
    marketing,
    hstOnRealtorFee,
    hstOnLegalFees,
    hstOnOtherCosts,
    hstOnStaging,
    hstOnPhotography,
    hstOnMarketing,
    totalHST,
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
  
  // Calculate Ontario Land Transfer Tax based on current rates
  let landTransferTax = 0;
  if (price > 0) {
    // Ontario Land Transfer Tax rates (effective January 1, 2017)
    if (price <= 55000) {
      landTransferTax = price * 0.005;
    } else if (price <= 250000) {
      landTransferTax = (price * 0.01) - 275;
    } else if (price <= 400000) {
      landTransferTax = (price * 0.015) - 1525;
    } else if (price <= 2000000) {
      // For properties with one or two single family residences
      landTransferTax = (price * 0.02) - 3525;
    } else {
      // For properties with one or two single family residences over $2M
      landTransferTax = (price * 0.025) - 13525;
    }
    
    // Apply Toronto double tax if not in Halton region
    if (!state.isHaltonRegion) {
      landTransferTax *= 2; // Toronto has both provincial and municipal land transfer tax
    }
    
    // Apply first-time buyer rebate (up to $4,000)
    if (state.isFirstTimeBuyer) {
      const rebate = Math.min(landTransferTax, 4000);
      landTransferTax -= rebate;
    }
  }
  
      return {
      price,
      down,
      mortgage,
      closing,
      landTransferTax,
      totalCost: price + closing + landTransferTax - down
    };
}

function BuyAndSellCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const sell = calculateSellNet(state);
  const buy = calculateBuy(state, sell.net);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 pt-8 md:pt-20">
        {/* Left: Inputs and Explanations */}
        <div className="w-full order-2 lg:order-1">

          {state.mode === "sell" ? (
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-primary mb-2">Sale Equity Calculator</h1>
              <p className="mb-4 text-sm md:text-base">Estimate how much you will walk away with after selling your property.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6 lg:my-12">
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
                <div>
                  <Label className={state.teamLogueProvides ? "line-through text-muted-foreground" : ""}>Staging Costs</Label>
                  <Input
                    className={`mt-2 ${state.teamLogueProvides ? "line-through text-muted-foreground opacity-50" : ""}`}
                    type="text"
                    placeholder="$3,000"
                    value={state.stagingCosts ? Number(state.stagingCosts).toLocaleString("en-US", { maximumFractionDigits: 0 }) : ''}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d.]/g, '');
                      dispatch({ type: 'SET_STAGING_COSTS', payload: raw });
                    }}
                    disabled={state.teamLogueProvides}
                  />
                  {state.teamLogueProvides && (
                    <div className="mt-1 text-xs text-brand-fourth font-medium">✓ Included with Team Logue</div>
                  )}
                </div>
                <div>
                  <Label className={state.teamLogueProvides ? "line-through text-muted-foreground" : ""}>Photography Costs</Label>
                  <Input
                    className={`mt-2 ${state.teamLogueProvides ? "line-through text-muted-foreground opacity-50" : ""}`}
                    type="text"
                    placeholder="$500"
                    value={state.photographyCosts ? Number(state.photographyCosts).toLocaleString("en-US", { maximumFractionDigits: 0 }) : ''}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d.]/g, '');
                      dispatch({ type: 'SET_PHOTOGRAPHY_COSTS', payload: raw });
                    }}
                    disabled={state.teamLogueProvides}
                  />
                  {state.teamLogueProvides && (
                    <div className="mt-1 text-xs text-brand-fourth font-medium">✓ Included with Team Logue</div>
                  )}
                </div>
                <div>
                  <Label className={state.teamLogueProvides ? "line-through text-muted-foreground" : ""}>Marketing Costs</Label>
                  <Input
                    className={`mt-2 ${state.teamLogueProvides ? "line-through text-muted-foreground opacity-50" : ""}`}
                    type="text"
                    placeholder="$1,000"
                    value={state.marketingCosts ? Number(state.marketingCosts).toLocaleString("en-US", { maximumFractionDigits: 0 }) : ''}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d.]/g, '');
                      dispatch({ type: 'SET_MARKETING_COSTS', payload: raw });
                    }}
                    disabled={state.teamLogueProvides}
                  />
                  {state.teamLogueProvides && (
                    <div className="mt-1 text-xs text-brand-fourth font-medium">✓ Included with Team Logue</div>
                  )}
                </div>
              </div>
              
              {/* Team Logue Checkbox - Updated with brand colors */}
              <div className="mt-8 mb-6 p-4 md:p-6 bg-gradient-to-r from-brand-fifth/20 to-brand-fourth/10 border-2 border-brand-fourth/30 rounded-xl shadow-md">
                <div className="flex items-center space-x-4">
                  <Checkbox
                    id="team-logue-provides"
                    checked={state.teamLogueProvides}
                    onCheckedChange={(checked) => dispatch({ type: 'SET_TEAM_LOGUE_PROVIDES', payload: checked as boolean })}
                    className="h-6 w-6 data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary"
                  />
                  <div className="flex flex-col">
                    <Label htmlFor="team-logue-provides" className="text-lg font-bold text-brand-primary">
                      Team Logue Services Included
                    </Label>
                    <span className="text-sm text-brand-fourth mt-1">
                      Staging • Photography • Marketing
                    </span>
                    <span className="text-xs text-brand-fourth/80 mt-2">
                      Check this box if Team Logue will provide these services (costs will be removed from calculations)
                    </span>
                  </div>
                </div>
              </div>

                            {/* Mode Toggle */}
                            <div className="mt-8 text-center">
                <div className="text-sm text-gray-600 mb-3">Want to calculate buying costs instead?</div>
                <div className="flex items-center justify-center">
                  <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                    <button
                      onClick={() => dispatch({ type: 'SET_MODE', payload: "sell" })}
                      className="px-4 py-2 rounded-md font-medium transition-all duration-200 bg-white text-brand-primary shadow-sm border border-gray-200"
                    >
                      Sale Calculator
                    </button>
                    <button
                      onClick={() => dispatch({ type: 'SET_MODE', payload: "buy" })}
                      className="px-4 py-2 rounded-md font-medium transition-all duration-200 text-gray-600 hover:text-gray-800"
                    >
                      Buy Calculator
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-muted p-4 rounded-lg">
                <h3 className="font-semibold text-base mb-2">How Net Proceeds Are Calculated</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li><strong>Sale Price:</strong> The price your home sells for.</li>
                  <li><strong>Mortgage Balance:</strong> The remaining amount owed on your mortgage.</li>
                  <li><strong>Realtor Fee:</strong> Typically 5% of sale price (can vary).</li>
                  <li><strong>Legal Fees & Other Costs:</strong> Closing and miscellaneous costs.</li>
                  <li><strong>Staging, Photography & Marketing:</strong> Professional services for selling (can be provided by Team Logue).</li>
                  <li><strong>HST:</strong> 13% tax on all fees and services.</li>
                  <li><strong>Net Proceeds:</strong> What you walk away with after all costs are paid.</li>
                </ul>
              </div>
              
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-primary mb-2">Buy Calculator</h1>
              <p className="mb-4 text-sm md:text-base">Estimate your down payment, mortgage, and total cost when buying a property. You can use your net proceeds from the sale or enter a custom down payment.</p>
              
              {/* Land Transfer Tax Section */}
              <div className="mb-6">
                <Label>Land Transfer Tax (Calculated)</Label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
                  <Input
                    type="text"
                    placeholder="$0"
                    value={buy.landTransferTax ? buy.landTransferTax.toLocaleString("en-US", { maximumFractionDigits: 0 }) : ''}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d.]/g, '');
                      dispatch({ type: 'SET_LAND_TRANSFER_TAX', payload: raw });
                    }}
                    className="flex-1"
                  />
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is-halton-region"
                        checked={state.isHaltonRegion}
                        onCheckedChange={(checked) => dispatch({ type: 'SET_IS_HALTON_REGION', payload: checked as boolean })}
                        className="data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary"
                      />
                      <Label htmlFor="is-halton-region" className="text-sm">
                        Halton Region
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is-first-time-buyer"
                        checked={state.isFirstTimeBuyer}
                        onCheckedChange={(checked) => dispatch({ type: 'SET_IS_FIRST_TIME_BUYER', payload: checked as boolean })}
                        className="data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary"
                      />
                      <Label htmlFor="is-first-time-buyer" className="text-sm">
                        First-time Buyer
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Based on Ontario rates: 0.5% up to $55K, 1% to $250K, 1.5% to $400K, 2% to $2M, 2.5% over $2M
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6 lg:my-12">
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
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
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
                      className="flex-1"
                    />
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="use-sell-proceeds"
                        checked={state.useSellProceeds}
                        onCheckedChange={checked => dispatch({ type: 'SET_USE_SELL_PROCEEDS', payload: checked })}
                        className="data-[state=checked]:bg-brand-primary"
                      />
                      <Label htmlFor="use-sell-proceeds" className="text-xs">Use net proceeds from sale</Label>
                    </div>
                  </div>
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
                             {/* Mode Toggle */}
                             <div className="mt-8 text-center">
                <div className="text-sm text-gray-600 mb-3">Want to calculate selling proceeds instead?</div>
                <div className="flex items-center justify-center">
                  <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                    <button
                      onClick={() => dispatch({ type: 'SET_MODE', payload: "sell" })}
                      className="px-4 py-2 rounded-md font-medium transition-all duration-200 text-gray-600 hover:text-gray-800"
                    >
                      Sale Calculator
                    </button>
                    <button
                      onClick={() => dispatch({ type: 'SET_MODE', payload: "buy" })}
                      className="px-4 py-2 rounded-md font-medium transition-all duration-200 bg-white text-brand-primary shadow-sm border border-gray-200"
                    >
                      Buy Calculator
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-muted p-4 rounded-lg">
                <h3 className="font-semibold text-base mb-2">How Your Purchase is Calculated</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li><strong>Purchase Price:</strong> The price of the home you want to buy.</li>
                  <li><strong>Down Payment:</strong> Either your net proceeds from the sale or a custom amount.</li>
                  <li><strong>Closing Costs:</strong> Legal and other costs to complete the purchase.</li>
                  <li><strong>Land Transfer Tax:</strong> Automatically calculated based on Ontario rates and purchase price.</li>
                  <li><strong>Halton Region:</strong> Check if property is in Halton (avoids Toronto&apos;s double land transfer tax).</li>
                  <li><strong>First-time Buyer:</strong> Check if eligible for up to $4,000 land transfer tax rebate.</li>
                </ul>
              </div>
            </>
          )}
        </div>
        {/* Right: Sticky Results Card */}
        <div className="w-full relative order-1 lg:order-2">
          <div className="sticky top-4 md:top-12">
            <Card>
              <CardHeader className="pb-2">
                <div className="text-muted-foreground text-base font-medium mb-1">
                  {state.mode === "sell" ? "Sale Equity Summary" : "Buy Summary"}
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
                    <div className="flex justify-between">
                      <span className={state.teamLogueProvides ? "line-through text-muted-foreground" : ""}>Staging Costs</span>
                      <span className={state.teamLogueProvides ? "line-through text-muted-foreground" : ""}>-${sell.staging.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={state.teamLogueProvides ? "line-through text-muted-foreground" : ""}>Photography Costs</span>
                      <span className={state.teamLogueProvides ? "line-through text-muted-foreground" : ""}>-${sell.photography.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={state.teamLogueProvides ? "line-through text-muted-foreground" : ""}>Marketing Costs</span>
                      <span className={state.teamLogueProvides ? "line-through text-muted-foreground" : ""}>-${sell.marketing.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>HST on Fees</span>
                      <span>-${sell.totalHST.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
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
                      <span>Closing Costs</span>
                      <span>-${buy.closing.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Land Transfer Tax</span>
                      <span>-${buy.landTransferTax.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <Separator className="my-2" />
                    <Separator className="my-2" />
                    <div className="bg-brand-fifth/20 p-4 rounded-lg border border-brand-fourth/30">
                      <div className="text-center">
                        <div className="text-sm text-brand-fourth font-medium mb-1">Remaining Cost After Down Payment</div>
                        <div className="text-2xl font-bold text-brand-primary">${buy.totalCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
                        <div className="text-xs text-brand-fourth mt-1">
                          Purchase Price + Taxes + Costs - Down Payment
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="mt-2 flex justify-end">
              <a href="https://www.realty-ai.com" className="hover:text-brand-primary text-sm">
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