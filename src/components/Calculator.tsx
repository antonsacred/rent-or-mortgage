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
                    <Label id={ownershipCostsLabelId}>Ownership Costs (annual %)</Label>
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

        <section className="mt-16 space-y-12">
          <nav
            aria-label="In-page navigation"
            className="flex flex-wrap gap-3 rounded-xl border bg-background/80 p-4 text-sm font-medium"
          >
            <a className="text-primary underline-offset-2 hover:underline" href="#methodology">
              Methodology
            </a>
            <a className="text-primary underline-offset-2 hover:underline" href="#compare-scenarios">
              When to Rent vs Buy
            </a>
            <a className="text-primary underline-offset-2 hover:underline" href="#faq">
              FAQ
            </a>
            <a className="text-primary underline-offset-2 hover:underline" href="#glossary">
              Glossary
            </a>
          </nav>

          <section id="methodology" className="space-y-4 rounded-2xl bg-card p-8 shadow-sm">
            <h2 className="text-3xl font-semibold text-foreground">How we calculate rent vs buy</h2>
            <p className="text-muted-foreground">
              The calculator models a complete mortgage amortization schedule, yearly ownership
              costs, rent inflation, and the opportunity cost of investing your down payment. Each
              slider updates the projection instantly so you can evaluate conservative and aggressive
              market conditions.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Mortgage payments use the standard fixed-rate formula and adjust monthly as loan
                balances shrink.
              </li>
              <li>
                Ownership costs bundle property tax, HOA dues, insurance, and repairs as a single
                percentage of the current home value.
              </li>
              <li>
                Rent grows based on the House & Rental Inflation slider, mirroring the same trend
                used for home appreciation.
              </li>
              <li>
                The investment account compounds annually and captures the cash flow difference
                between renting and the mortgage payment.
              </li>
            </ul>
            <p className="text-muted-foreground">
              Because the model keeps every assumption transparent, you can cite the exact inputs in
              mortgage applications, financial plans, or content marketing pieces.
            </p>
          </section>

          <section id="compare-scenarios" className="grid gap-6 rounded-2xl bg-secondary/30 p-8 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-semibold text-primary">When buying makes sense</h3>
              <p className="mt-2 text-muted-foreground">
                Buying often wins when you can lock in a competitive interest rate, expect moderate
                appreciation, and plan to stay in the property beyond the breakeven timeframe. Larger
                down payments reduce PMI and shrink total interest charges, letting equity compound
                faster than rent increases.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-destructive">When renting is smarter</h3>
              <p className="mt-2 text-muted-foreground">
                Renting tends to win if you relocate frequently, live in overheated markets, or can
                reliably earn higher returns by investing the down payment. Use the Investment Return
                slider to stress-test future bull or bear markets and check how sensitive your plan
                is to opportunity cost.
              </p>
            </div>
          </section>

          <section id="faq" className="space-y-8 rounded-2xl bg-card p-8 shadow-sm">
            <div>
              <h2 className="text-3xl font-semibold text-foreground">Frequently asked questions</h2>
              <p className="text-muted-foreground">
                These answers provide extra context you can cite in blog posts or onboarding flows.
              </p>
            </div>
            <article>
              <h3 className="text-xl font-semibold text-foreground">Do I need to include PMI?</h3>
              <p className="text-muted-foreground">
                Private mortgage insurance is implicitly captured in the Ownership Costs slider. Set
                the percentage slightly higher when your down payment is below 20% so the projection
                mirrors PMI premiums plus maintenance.
              </p>
            </article>
            <article>
              <h3 className="text-xl font-semibold text-foreground">What growth rate should I use?</h3>
              <p className="text-muted-foreground">
                Start with the historical national average of 3–4% for home appreciation, then adjust
                it to match your metro&apos;s Case-Shiller trend. The same slider feeds rent growth
                to keep the comparison grounded in one macro scenario.
              </p>
            </article>
            <article>
              <h3 className="text-xl font-semibold text-foreground">Can I model variable-rate loans?</h3>
              <p className="text-muted-foreground">
                Variable loans are not modeled yet, but you can approximate them by inputting your
                expected blended rate and shortening the Years to Compare slider to the fixed period.
                Layer manual notes alongside this summary for underwriting use.
              </p>
            </article>
          </section>

          <section id="glossary" className="rounded-2xl bg-secondary/20 p-8">
            <h2 className="text-3xl font-semibold text-foreground">Quick glossary</h2>
            <dl className="mt-4 grid gap-6 md:grid-cols-2">
              <div>
                <dt className="font-semibold text-foreground">Opportunity cost</dt>
                <dd className="text-muted-foreground">
                  The foregone investment gains from tying cash up in a down payment and ongoing
                  ownership expenses.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Equity</dt>
                <dd className="text-muted-foreground">
                  The market value of your home minus the remaining loan balance—shown in the
                  calculator as “Equity Built”.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Total rent cost</dt>
                <dd className="text-muted-foreground">
                  All rent payments minus gains from investing the down payment and monthly cash flow
                  spreads.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Total buy cost</dt>
                <dd className="text-muted-foreground">
                  Down payment, mortgage payments, and ownership costs minus the equity accrued over
                  the comparison period.
                </dd>
              </div>
            </dl>
          </section>
        </section>
      </div>
    </div>
  );
};
