import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CalculatorInputs } from "./Calculator";
import { Home, TrendingDown, TrendingUp } from "lucide-react";

interface CalculatorResultsProps {
  inputs: CalculatorInputs;
}

interface YearData {
  year: number;
  buyCost: number;
  rentCost: number;
}

export const CalculatorResults = ({ inputs }: CalculatorResultsProps) => {
  const calculations = useMemo(() => {
    const {
      homePrice,
      downPaymentPercent,
      interestRate,
      loanTerm,
      monthlyRent,
      ownershipCostsRate,
      marketGrowthRate,
      investmentReturn,
      yearsToCompare,
    } = inputs;

    const downPayment = (homePrice * downPaymentPercent) / 100;
    const loanAmount = homePrice - downPayment;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Calculate monthly mortgage payment using the mortgage formula
    const monthlyMortgage =
      monthlyInterestRate === 0
        ? loanAmount / numberOfPayments
        : loanAmount *
          (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
          (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    const yearlyData: YearData[] = [];
    let cumulativeBuyCost = downPayment;
    let cumulativeRentCost = 0;
    const initialInvestment = downPayment;
    let investmentBalance = initialInvestment;
    let currentRent = monthlyRent;
    let currentHomeValue = homePrice;
    let remainingLoanBalance = loanAmount;
    let totalMortgagePaid = 0;
    let totalOwnershipCostsPaid = 0;
    let finalNetInvestmentGain = 0;

    for (let year = 0; year <= yearsToCompare; year++) {
      if (year > 0) {
        // Update home value with appreciation
        currentHomeValue *= 1 + marketGrowthRate / 100;

        // Annual costs for buying (principal + interest actually paid this year)
        let annualMortgagePaid = 0;
        for (let month = 0; month < 12; month++) {
          if (remainingLoanBalance <= 0) {
            break;
          }
          const interestPayment = remainingLoanBalance * monthlyInterestRate;
          const principalPayment = monthlyMortgage - interestPayment;
          const actualPrincipalPayment = Math.min(principalPayment, remainingLoanBalance);
          const actualPayment = actualPrincipalPayment + interestPayment;
          annualMortgagePaid += actualPayment;
          remainingLoanBalance -= actualPrincipalPayment;
        }

        const annualOwnershipCosts = (currentHomeValue * ownershipCostsRate) / 100;
        const totalAnnualBuyCost = annualMortgagePaid + annualOwnershipCosts;

        cumulativeBuyCost += totalAnnualBuyCost;
        totalMortgagePaid += annualMortgagePaid;
        totalOwnershipCostsPaid += annualOwnershipCosts;

        // Annual costs for renting
        const annualRent = currentRent * 12;
        cumulativeRentCost += annualRent;
        
        // Update investment balance (independent renter portfolio growth)
        investmentBalance *= 1 + investmentReturn / 100;

        // Update rent for next year
        currentRent *= 1 + marketGrowthRate / 100;
      }

      const equity = currentHomeValue - remainingLoanBalance;
      const netInvestmentGain = investmentBalance - initialInvestment;
      finalNetInvestmentGain = netInvestmentGain;

      yearlyData.push({
        year,
        buyCost: Math.round(cumulativeBuyCost - equity),
        rentCost: Math.round(cumulativeRentCost - netInvestmentGain),
      });
    }

    const finalBuyCost = yearlyData[yearlyData.length - 1].buyCost;
    const finalRentCost = yearlyData[yearlyData.length - 1].rentCost;
    const difference = Math.abs(finalBuyCost - finalRentCost);
    const isBuyingCheaper = finalBuyCost < finalRentCost;

    return {
      yearlyData,
      monthlyMortgage,
      finalBuyCost,
      finalRentCost,
      difference,
      isBuyingCheaper,
      equityBuilt: currentHomeValue - remainingLoanBalance,
      downPayment,
      totalMortgagePaid,
      totalOwnershipCostsPaid,
      totalBuyCashOut: cumulativeBuyCost,
      totalRentPaid: cumulativeRentCost,
      netInvestmentGain: finalNetInvestmentGain,
    };
  }, [inputs]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-card to-secondary/20 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            {calculations.isBuyingCheaper ? (
              <>
                <Home className="h-6 w-6 text-primary" />
                <span>Buying is Cheaper</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-6 w-6 text-destructive" />
                <span>Renting is Cheaper</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Over {inputs.yearsToCompare} years, {calculations.isBuyingCheaper ? "buying" : "renting"} will save you:
              </p>
              <p className="text-4xl font-bold text-primary">
                {formatCurrency(calculations.difference)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Total Buy Cost</p>
                <p className="text-2xl font-semibold text-primary">
                  {formatCurrency(calculations.finalBuyCost)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Rent Cost</p>
                <p className="text-2xl font-semibold text-destructive">
                  {formatCurrency(calculations.finalRentCost)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost Comparison Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={calculations.yearlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="year"
                label={{ value: "Years", position: "insideBottom", offset: -5 }}
                className="text-xs"
              />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                label={{ value: "Cost ($)", angle: -90, position: "insideLeft" }}
                className="text-xs"
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="buyCost"
                stroke="hsl(var(--chart-buy))"
                strokeWidth={3}
                name="Buying Cost"
                dot={{ fill: "hsl(var(--chart-buy))" }}
              />
              <Line
                type="monotone"
                dataKey="rentCost"
                stroke="hsl(var(--chart-rent))"
                strokeWidth={3}
                name="Renting Cost"
                dot={{ fill: "hsl(var(--chart-rent))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm font-medium">Monthly Mortgage Payment</span>
              <span className="text-lg font-semibold text-primary">
                {formatCurrency(calculations.monthlyMortgage)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm font-medium">Current Monthly Rent</span>
              <span className="text-lg font-semibold text-destructive">
                {formatCurrency(inputs.monthlyRent)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg border-2 border-accent">
              <span className="text-sm font-medium">Projected Home Equity</span>
              <span className="text-lg font-semibold text-accent">
                {formatCurrency(calculations.equityBuilt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Buying
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Down Payment</span>
                  <span className="font-semibold">
                    {formatCurrency(calculations.downPayment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Mortgage Payments</span>
                  <span className="font-semibold">
                    {formatCurrency(calculations.totalMortgagePaid)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Ownership Costs</span>
                  <span className="font-semibold">
                    {formatCurrency(calculations.totalOwnershipCostsPaid)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cash Out</span>
                  <span className="font-semibold">
                    {formatCurrency(calculations.totalBuyCashOut)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Equity Built</span>
                  <span className="font-semibold text-accent">
                    {formatCurrency(calculations.equityBuilt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Net Buy Cost</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(calculations.finalBuyCost)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Renting
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Rent Paid</span>
                  <span className="font-semibold text-destructive">
                    {formatCurrency(calculations.totalRentPaid)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Investment Growth</span>
                  <span className="font-semibold text-accent">
                    {formatCurrency(calculations.netInvestmentGain)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Net Rent Cost</span>
                  <span className="font-semibold text-destructive">
                    {formatCurrency(calculations.finalRentCost)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
