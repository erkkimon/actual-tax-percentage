function calculateStateTaxAnnual(annualIncome) {
  // 2025 Finnish state tax brackets (annual):
  //   0–21 200:               0 + 12.64% of amount over 0
  //   21 200–31 500:       2 679.68 + 19% of amount over 21 200
  //   31 500–52 100:       4 636.68 + 30.25% of amount over 31 500
  //   52 100–88 200:      10 868.18 + 34% of amount over 52 100
  //   88 200–150 000:     23 142.18 + 41.75% of amount over 88 200
  //   150 000 and above:  48 943.68 + 44.25% of amount over 150 000

  let tax = 0;

  if (annualIncome <= 0) {
    return 0;
  } else if (annualIncome <= 21200) {
    tax = annualIncome * 0.1264;
  } else if (annualIncome <= 31500) {
    tax = 2679.68 + (annualIncome - 21200) * 0.19;
  } else if (annualIncome <= 52100) {
    tax = 4636.68 + (annualIncome - 31500) * 0.3025;
  } else if (annualIncome <= 88200) {
    tax = 10868.18 + (annualIncome - 52100) * 0.34;
  } else if (annualIncome <= 150000) {
    tax = 23142.18 + (annualIncome - 88200) * 0.4175;
  } else {
    // Above 150,000
    tax = 48943.68 + (annualIncome - 150000) * 0.4425;
  }
  return tax;
}

function estimateSalary(monthlyGrossSalary) {
  //
  // 1. Convert monthly to annual for bracket-based taxes,
  //    using 12.5 months to account for holiday pay (lomaraha).
  //
  const annualGrossSalary = monthlyGrossSalary * 12.5;

  //
  // 2. Employer’s statutory contributions (averages).
  //
  const employerRates = {
    tyel: 0.1770,            // TyEL (employer portion)
    unemployment: 0.0061,    // Työttömyysvakuutus (employer)
    healthInsurance: 0.0187, // Sairausvakuutus (employer)
    accidentInsurance: 0.0070,
    groupLife: 0.0006
  };
  const employerRateSum = Object.values(employerRates).reduce((a, b) => a + b, 0);

  // Sum of employer's statutory costs on top of salary
  const employerContributions = monthlyGrossSalary * employerRateSum;

  //
  // 3. Employer's Occupational Healthcare (assumed 1% of gross salary)
  //
  const employerOccupationalHealthcareRate = 0.01; // 1%
  const employerOccupationalHealthcareCost = monthlyGrossSalary * employerOccupationalHealthcareRate;

  //
  // 4. Employer's total direct wage cost (per month)
  //    = gross salary + statutory contributions + occupational healthcare
  //
  const employerTotalCost = 
    monthlyGrossSalary + 
    employerContributions + 
    employerOccupationalHealthcareCost;

  //
  // 5. Employee’s statutory contributions (withheld from salary):
  //    - TyEL (employee)   = 7.15%
  //    - Unemployment      = 0.59%
  //    - Health (average)  = 1.90%
  //   Sum ~ 9.64%
  //
  const employeeMandatoryRate = 0.0715 + 0.0059 + 0.0190; 
  const employeeMandatoryAmount = monthlyGrossSalary * employeeMandatoryRate;

  //
  // 6. Local taxes (municipal + church), average ~8.92% (per month).
  //
  const localTaxRate = 0.0892;
  const localTaxAmount = monthlyGrossSalary * localTaxRate;

  //
  // 7. State income tax (annual -> monthly).
  //
  const annualStateTax = calculateStateTaxAnnual(annualGrossSalary);
  const monthlyStateTax = annualStateTax / 12.5;

  //
  // 8. Employee Union Fee (assumed 1.5% of gross)
  //
  const employeeUnionFeeRate = 0.015;  // 1.5%
  const employeeUnionFee = monthlyGrossSalary * employeeUnionFeeRate;

  //
  // 9. Net salary = gross - (all employee-side deductions)
  //
  const netSalary = 
    monthlyGrossSalary - 
    (employeeMandatoryAmount + localTaxAmount + monthlyStateTax + employeeUnionFee);

  //
  // 10. Employer's “VAT” on wages (per your cost model),
  //     i.e., 25.5% of employerTotalCost.
  //
  const vatRate = 0.255;
  const employerVatAmount = employerTotalCost * vatRate;
  const employerTotalCostWithVAT = employerTotalCost + employerVatAmount;

  //
  // 11. Percentage: how much net salary is
  //     of employerTotalCostWithVAT
  //
  const netPercentageOfEmployerCost = (netSalary / employerTotalCostWithVAT) * 100;

  //
  // 12. Structured JSON output
  //
  return {
    monthlyGrossSalary: roundCents(monthlyGrossSalary),
    annualGrossSalary: roundCents(annualGrossSalary),
    employerTotalCost: roundCents(employerTotalCost),
    employerTotalCostWithVAT: roundCents(employerTotalCostWithVAT),
    netSalary: roundCents(netSalary),
    netSalaryPctOfEmployerTotalCostWithVAT: roundCents(netPercentageOfEmployerCost),
    breakdown: {
      employerContributions: {
        tyel: roundCents(monthlyGrossSalary * employerRates.tyel),
        unemployment: roundCents(monthlyGrossSalary * employerRates.unemployment),
        healthInsurance: roundCents(monthlyGrossSalary * employerRates.healthInsurance),
        accidentInsurance: roundCents(monthlyGrossSalary * employerRates.accidentInsurance),
        groupLife: roundCents(monthlyGrossSalary * employerRates.groupLife),
        occupationalHealthcare: roundCents(employerOccupationalHealthcareCost)
      },
      employeeDeductions: {
        pensionUnemploymentHealth: roundCents(employeeMandatoryAmount),
        localTax: roundCents(localTaxAmount),
        stateTaxMonthly: roundCents(monthlyStateTax),
        unionFee: roundCents(employeeUnionFee)
      },
      employerVAT: {
        vatRate: vatRate,
        employerVATonWages: roundCents(employerVatAmount)
      }
    }
  };
}

// Helper function: round to two decimals
function roundCents(num) {
  return Math.round(num * 100) / 100;
}

// -----------------------------------------------
// EXAMPLE USAGE
// -----------------------------------------------
console.log("== 2,300 €/mo ==");
console.log(estimateSalary(2300));

console.log("\n== 3,800 €/mo ==");
console.log(estimateSalary(3800));

console.log("\n== 6,500 €/mo ==");
console.log(estimateSalary(6500));
