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
      propertyTaxRate,
      hoaFees,
      homeInsurance,
      maintenanceRate,
      homeAppreciation,
      rentIncrease,
      investmentReturn,
      yearsToCompare,
    } = inputs;

    const downPayment = (homePrice * downPaymentPercent) / 100;
    const loanAmount = homePrice - downPayment;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Calculate monthly mortgage payment using the mortgage formula
    const monthlyMortgage =
      loanAmount *
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    const yearlyData: YearData[] = [];
    let cumulativeBuyCost = downPayment;
    let cumulativeRentCost = 0;
    let investmentBalance = downPayment; // For renters, this is opportunity cost
    let currentRent = monthlyRent;
    let currentHomeValue = homePrice;

    for (let year = 0; year <= yearsToCompare; year++) {
      if (year > 0) {
        // Update home value with appreciation
        currentHomeValue *= 1 + homeAppreciation / 100;
        
        // Annual costs for buying
        const annualMortgage = monthlyMortgage * 12;
        const annualPropertyTax = (currentHomeValue * propertyTaxRate) / 100;
        const annualHOA = hoaFees * 12;
        const annualMaintenance = (currentHomeValue * maintenanceRate) / 100;
        const totalAnnualBuyCost =
          annualMortgage + annualPropertyTax + annualHOA + homeInsurance + annualMaintenance;

        cumulativeBuyCost += totalAnnualBuyCost;

        // Annual costs for renting
        const annualRent = currentRent * 12;
        cumulativeRentCost += annualRent;
        
        // Update investment balance (opportunity cost of down payment)
        investmentBalance *= 1 + investmentReturn / 100;
        investmentBalance += annualMortgage + annualPropertyTax + annualHOA + homeInsurance + annualMaintenance - annualRent;

        // Update rent for next year
        currentRent *= 1 + rentIncrease / 100;
      }

      yearlyData.push({
        year,
        buyCost: Math.round(cumulativeBuyCost - (currentHomeValue - homePrice)), // Subtract equity gain
        rentCost: Math.round(cumulativeRentCost + investmentBalance),
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
      equityBuilt: currentHomeValue - homePrice + downPayment,
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
    </div>
  );
};
