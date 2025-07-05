import MortgageCalculator from "@/components/calculators/MortgageCalculator";
import BuyAndSellCalculator from "@/components/calculators/BuyAndSellCalculator";
import BudgetCalculator from "@/components/calculators/BudgetCalculator";
import CashflowCalculator from "@/components/calculators/CashflowCalculator";

export default function Page() {
  return (
    <main className="py-12">
      <MortgageCalculator />
      <BuyAndSellCalculator/>
      <BudgetCalculator />
      <CashflowCalculator />
    </main>
  );
}
