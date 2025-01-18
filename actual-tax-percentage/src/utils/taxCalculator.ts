interface EmployerRates {
    tyel: number;
    unemployment: number;
    healthInsurance: number;
    accidentInsurance: number;
    groupLife: number;
}

interface EmployerContributions {
    tyel: number;
    unemployment: number;
    healthInsurance: number;
    accidentInsurance: number;
    groupLife: number;
    occupationalHealthcare: number;
}

interface EmployeeDeductions {
    pensionUnemploymentHealth: number;
    localTax: number;
    stateTaxMonthly: number;
    unionFee: number;
}

interface TaxBreakdown {
    employerContributions: EmployerContributions;
    employeeDeductions: EmployeeDeductions;
    employerVAT: {
        vatRate: number;
        employerVATonWages: number;
    };
}

export interface SalaryCalculation {
    monthlyGrossSalary: number;
    annualGrossSalary: number;
    employerTotalCost: number;
    employerTotalCostWithVAT: number;
    netSalary: number;
    netSalaryPctOfEmployerTotalCostWithVAT: number;
    breakdown: TaxBreakdown;
}

function calculateStateTaxAnnual(annualIncome: number): number {
    if (annualIncome <= 0) {
        return 0;
    } else if (annualIncome <= 21200) {
        return annualIncome * 0.1264;
    } else if (annualIncome <= 31500) {
        return 2679.68 + (annualIncome - 21200) * 0.19;
    } else if (annualIncome <= 52100) {
        return 4636.68 + (annualIncome - 31500) * 0.3025;
    } else if (annualIncome <= 88200) {
        return 10868.18 + (annualIncome - 52100) * 0.34;
    } else if (annualIncome <= 150000) {
        return 23142.18 + (annualIncome - 88200) * 0.4175;
    } else {
        return 48943.68 + (annualIncome - 150000) * 0.4425;
    }
}

function roundCents(num: number): number {
    return Math.round(num * 100) / 100;
}

export function estimateSalary(monthlyGrossSalary: number): SalaryCalculation {
    const annualGrossSalary = monthlyGrossSalary * 12.5;

    const employerRates: EmployerRates = {
        tyel: 0.1770,
        unemployment: 0.0061,
        healthInsurance: 0.0187,
        accidentInsurance: 0.0070,
        groupLife: 0.0006
    };

    const employerRateSum = Object.values(employerRates).reduce((a, b) => a + b, 0);
    const employerContributions = monthlyGrossSalary * employerRateSum;

    const employerOccupationalHealthcareRate = 0.01;
    const employerOccupationalHealthcareCost = monthlyGrossSalary * employerOccupationalHealthcareRate;

    const employerTotalCost =
        monthlyGrossSalary +
        employerContributions +
        employerOccupationalHealthcareCost;

    const employeeMandatoryRate = 0.0715 + 0.0059 + 0.0190;
    const employeeMandatoryAmount = monthlyGrossSalary * employeeMandatoryRate;

    const localTaxRate = 0.0892;
    const localTaxAmount = monthlyGrossSalary * localTaxRate;

    const annualStateTax = calculateStateTaxAnnual(annualGrossSalary);
    const monthlyStateTax = annualStateTax / 12.5;

    const employeeUnionFeeRate = 0.015;
    const employeeUnionFee = monthlyGrossSalary * employeeUnionFeeRate;

    const netSalary =
        monthlyGrossSalary -
        (employeeMandatoryAmount + localTaxAmount + monthlyStateTax + employeeUnionFee);

    const vatRate = 0.255;
    const employerVatAmount = employerTotalCost * vatRate;
    const employerTotalCostWithVAT = employerTotalCost + employerVatAmount;

    const netPercentageOfEmployerCost = (netSalary / employerTotalCostWithVAT) * 100;

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
                vatRate,
                employerVATonWages: roundCents(employerVatAmount)
            }
        }
    };
}