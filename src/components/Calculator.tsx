import { useId, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CalculatorResults } from "./CalculatorResults";

export interface CalculatorInputs {
  homePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  monthlyRent: number;
  ownershipCostsRate: number;
  marketGrowthRate: number;
  investmentReturn: number;
  yearsToCompare: number;
}

const defaultInputs: CalculatorInputs = {
  homePrice: 400000,
  downPaymentPercent: 20,
  interestRate: 6.5,
  loanTerm: 30,
  monthlyRent: 2000,
  ownershipCostsRate: 2,
  marketGrowthRate: 3,
  investmentReturn: 7,
  yearsToCompare: 20,
};

export const Calculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const homePriceLabelId = useId();
  const downPaymentLabelId = useId();
  const interestRateLabelId = useId();
  const loanTermLabelId = useId();
  const ownershipCostsLabelId = useId();
  const ownershipCostsDescriptionId = useId();
  const monthlyRentLabelId = useId();
  const yearsToCompareLabelId = useId();
  const marketGrowthLabelId = useId();
  const marketGrowthDescriptionId = useId();
  const investmentReturnLabelId = useId();

  const updateInput = (key: keyof CalculatorInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const annualOwnershipCost = (inputs.homePrice * inputs.ownershipCostsRate) / 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Rent vs Buy Calculator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Make an informed decision about your housing future. Compare the real costs of renting versus buying over time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Home Purchase Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label id={homePriceLabelId}>Home Price</Label>
                    <span className="text-sm font-semibold text-primary">
                      ${inputs.homePrice.toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    aria-labelledby={homePriceLabelId}
                    value={[inputs.homePrice]}
                    onValueChange={([value]) => updateInput("homePrice", value)}
                    min={100000}
                    max={2000000}
                    step={10000}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label id={downPaymentLabelId}>Down Payment</Label>
                    <span className="text-sm font-semibold text-primary">
                      {inputs.downPaymentPercent}% (${((inputs.homePrice * inputs.downPaymentPercent) / 100).toLocaleString()})
                    </span>
                  </div>
                  <Slider
                    aria-labelledby={downPaymentLabelId}
                    value={[inputs.downPaymentPercent]}
                    onValueChange={([value]) => updateInput("downPaymentPercent", value)}
                    min={0}
                    max={50}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label id={interestRateLabelId}>Interest Rate</Label>
                    <span className="text-sm font-semibold text-primary">
                      {inputs.interestRate}%
                    </span>
                  </div>
                  <Slider
                    aria-labelledby={interestRateLabelId}
                    value={[inputs.interestRate]}
                    onValueChange={([value]) => updateInput("interestRate", value)}
                    min={2}
                    max={12}
                    step={0.1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label id={loanTermLabelId}>Loan Term (years)</Label>
                    <span className="text-sm font-semibold text-primary">
                      {inputs.loanTerm} years
                    </span>
                  </div>
                  <Slider
                    aria-labelledby={loanTermLabelId}
                    value={[inputs.loanTerm]}
                    onValueChange={([value]) => updateInput("loanTerm", value)}
                    min={10}
                    max={30}
                    step={5}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label id={ownershipCostsLabelId}>Total Ownership Costs (annual %)</Label>
                    <span className="text-sm font-semibold text-primary">
                      {inputs.ownershipCostsRate}% ({formatCurrency(annualOwnershipCost)}/yr)
                    </span>
                  </div>
                  <p id={ownershipCostsDescriptionId} className="text-xs text-muted-foreground">
                    Includes property taxes, HOA, insurance, maintenance, repairs
                  </p>
                  <Slider
                    aria-labelledby={ownershipCostsLabelId}
                    aria-describedby={ownershipCostsDescriptionId}
                    value={[inputs.ownershipCostsRate]}
                    onValueChange={([value]) => updateInput("ownershipCostsRate", value)}
                    min={0}
                    max={6}
                    step={0.1}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rental Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label id={monthlyRentLabelId}>Monthly Rent</Label>
                    <span className="text-sm font-semibold text-destructive">
                      ${inputs.monthlyRent.toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    aria-labelledby={monthlyRentLabelId}
                    value={[inputs.monthlyRent]}
                    onValueChange={([value]) => updateInput("monthlyRent", value)}
                    min={500}
                    max={10000}
                    step={100}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label id={yearsToCompareLabelId}>Years to Compare</Label>
                    <span className="text-sm font-semibold text-foreground">
                      {inputs.yearsToCompare} years
                    </span>
                  </div>
                  <Slider
                    aria-labelledby={yearsToCompareLabelId}
                    value={[inputs.yearsToCompare]}
                    onValueChange={([value]) => updateInput("yearsToCompare", value)}
                    min={1}
                    max={40}
                    step={1}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <Label id={marketGrowthLabelId}>House & Rental Inflation (annual)</Label>
                    <span className="text-sm font-semibold text-primary">
                      {inputs.marketGrowthRate}%
                    </span>
                  </div>
                  <p id={marketGrowthDescriptionId} className="text-xs text-muted-foreground">
                    Drives yearly changes for both home value and rent
                  </p>
                  <Slider
                    aria-labelledby={marketGrowthLabelId}
                    aria-describedby={marketGrowthDescriptionId}
                    value={[inputs.marketGrowthRate]}
                    onValueChange={([value]) => updateInput("marketGrowthRate", value)}
                    min={-2}
                    max={10}
                    step={0.5}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label id={investmentReturnLabelId}>Investment Return Rate (annual)</Label>
                    <span className="text-sm font-semibold text-accent">
                      {inputs.investmentReturn}%
                    </span>
                  </div>
                  <Slider
                    aria-labelledby={investmentReturnLabelId}
                    value={[inputs.investmentReturn]}
                    onValueChange={([value]) => updateInput("investmentReturn", value)}
                    min={0}
                    max={15}
                    step={0.5}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <CalculatorResults inputs={inputs} />
          </div>
        </div>
      </div>
    </div>
  );
};
