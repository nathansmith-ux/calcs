import MortgageCalculator from "@/components/calculators/MortgageCalculator";
import BuyAndSellCalculator from "@/components/calculators/BuyAndSellCalculator";
import CashflowCalculator from "@/components/calculators/CashflowCalculator";

export default function Page() {
  return (
    <main className="py-12">
      <MortgageCalculator />
      <BuyAndSellCalculator/>
      <CashflowCalculator />
    </main>
  );
}
