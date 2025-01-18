import taxBrackets from '../assets/tax-brackets-fi-2025.json';

export interface TaxBracket {
    monthlySalary: string;
    taxPercentage: string;
}

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
    incomeTax: number;
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

function roundCents(num: number): number {
    return Math.round(num * 100) / 100;
}

function findTaxPercentage(monthlySalary: number): number {
    // Sort brackets by salary to ensure they're in ascending order
    const sortedBrackets = [...taxBrackets].sort((a, b) =>
        parseFloat(a.monthlySalary) - parseFloat(b.monthlySalary)
    );

    // If salary is lower than the lowest bracket, use the lowest bracket
    const lowestBracket = sortedBrackets[0];
    if (monthlySalary < parseFloat(lowestBracket.monthlySalary)) {
        return parseFloat(lowestBracket.taxPercentage) / 100;
    }

    // Find the first bracket where the salary is less than the bracket's salary
    const upperBracket = sortedBrackets.find(bracket =>
        parseFloat(bracket.monthlySalary) > monthlySalary
    );

    if (!upperBracket) {
        // If no upper bracket found, use the highest bracket
        const highestBracket = sortedBrackets[sortedBrackets.length - 1];
        return parseFloat(highestBracket.taxPercentage) / 100;
    }

    // Find the lower bracket (the one we should use)
    const lowerBracketIndex = sortedBrackets.indexOf(upperBracket) - 1;
    const lowerBracket = sortedBrackets[lowerBracketIndex];

    // Use the lower bracket's tax rate
    return parseFloat(lowerBracket.taxPercentage) / 100;
}

export function estimateSalary(monthlyGrossSalary: number): SalaryCalculation {
    console.log('\nCalculating salary for:', monthlyGrossSalary, '€');

    const annualGrossSalary = monthlyGrossSalary * 12;

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

    const totalTaxRate = findTaxPercentage(monthlyGrossSalary);
    const totalTaxAmount = monthlyGrossSalary * totalTaxRate;

    const employeeUnionFeeRate = 0.015;
    const employeeUnionFee = monthlyGrossSalary * employeeUnionFeeRate;

    const netSalary =
        monthlyGrossSalary -
        (totalTaxAmount + employeeUnionFee);

    const vatRate = 0.255;
    const employerVatAmount = employerTotalCost * vatRate;
    const employerTotalCostWithVAT = employerTotalCost + employerVatAmount;

    const netPercentageOfEmployerCost = (netSalary / employerTotalCostWithVAT) * 100;

    const result = {
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
                incomeTax: roundCents(totalTaxAmount),
                unionFee: roundCents(employeeUnionFee)
            },
            employerVAT: {
                vatRate,
                employerVATonWages: roundCents(employerVatAmount)
            }
        }
    };

    console.log('Calculator output:', JSON.stringify(result, null, 2));
    return result;
}