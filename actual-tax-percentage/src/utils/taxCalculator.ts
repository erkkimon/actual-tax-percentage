// Todellinen veroprosentti -laskuri
// Luvut ovat vuoden 2026 tasolla. Lähdeviitteet [n] on lueteltu
// AssumptionsAccordion-komponentin "Lähteet"-osiossa.

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
    realTaxPercentage: number;
    breakdown: TaxBreakdown;
}

function roundCents(num: number): number {
    return Math.round(num * 100) / 100;
}

// ---- Vuoden 2026 vakiot ----

// Työnantajan sivukulut 2026:
const employerRates: EmployerRates = {
    tyel: 0.1710,              // TyEL, työnantaja (keskimäärin) [1]
    unemployment: 0.0092,      // Työttömyysvakuutus, työnantaja (ka. 0,31–1,23 %) [2]
    healthInsurance: 0.0191,   // Sairausvakuutusmaksu, työnantaja [3]
    accidentInsurance: 0.0051, // Tapaturmavakuutus (ka. 0,05–5 %) [3]
    groupLife: 0.0006          // Ryhmähenkivakuutus (ennallaan) [3]
};

const employerOccupationalHealthcareRate = 0.01; // Työterveyshuolto (oletus)

// Työntekijän lakisääteiset maksut 2026:
// TyEL 7,30 % [1] + työttömyysvakuutus 0,89 % [2] + sairausvakuutus 1,98 % [3]
const employeeMandatoryRate = 0.0730 + 0.0089 + 0.0198; // = 10,17 %

// Kunnallis- ja kirkollisvero (keskiarvot 2026):
const municipalTaxRate = 0.0757; // Kunnallisvero, painotettu keskiarvo [4]
const churchTaxRate = 0.0106;    // Kirkollisvero, keskiarvo (noin) [5]

const employeeUnionFeeRate = 0.015; // Ammattiliiton jäsenmaksu (oletus)
const vatRate = 0.255;              // Yleinen ALV-kanta 25,5 % (1.9.2024 alkaen) [7]

// ---- Valtion tulovero 2026 ----
// Progressiivinen tuloveroasteikko. Alarajat on indeksoitu noin 3,5 % vuoden 2025
// tasosta (Verohallinto: "Muutokset veroperusteisiin 2026"); marginaaliveroasteet
// 12,64 / 19 / 30,25 / 34 / 41,75 %. [6]
const STATE_TAX_BRACKETS = [
    { lower: 21900, rate: 0.1264 },
    { lower: 32600, rate: 0.19 },
    { lower: 53900, rate: 0.3025 },
    { lower: 91300, rate: 0.34 },
    { lower: 155300, rate: 0.4175 }
];

// Vähennykset 2026 (porrastus yksinkertaistettu enimmäismääristä):
const EARNED_INCOME_DEDUCTION_MAX = 3430; // Työtulovähennys, enintään [6]
const BASIC_DEDUCTION_MAX = 4265;         // Perusvähennys, enintään [6]

function earnedIncomeDeduction(annualGross: number): number {
    // Työtulovähennys: täysi 3 430 € 20 000 €:n vuosituloon asti,
    // sen jälkeen vähenee 12,5 %:lla ylittävästä osasta.
    return Math.max(0, EARNED_INCOME_DEDUCTION_MAX - 0.125 * Math.max(0, annualGross - 20000));
}

function basicDeduction(annualGross: number): number {
    // Perusvähennys: täysi 4 265 € 3 700 €:n vuosituloon asti,
    // sen jälkeen vähenee 18 %:lla ylittävästä osasta.
    return Math.max(0, BASIC_DEDUCTION_MAX - 0.18 * Math.max(0, annualGross - 3700));
}

function taxableAnnualIncome(annualGross: number): number {
    return Math.max(0, annualGross - earnedIncomeDeduction(annualGross) - basicDeduction(annualGross));
}

function calculateStateTaxAnnual(taxableAnnual: number): number {
    let tax = 0;
    let remaining = taxableAnnual;
    for (let i = STATE_TAX_BRACKETS.length - 1; i >= 0; i--) {
        const bracket = STATE_TAX_BRACKETS[i];
        if (remaining > bracket.lower) {
            tax += (remaining - bracket.lower) * bracket.rate;
            remaining = bracket.lower;
        }
    }
    // Ensimmäinen porras (0–21 900 €) on verovapaa.
    return tax;
}

export function estimateSalary(monthlyGrossSalary: number): SalaryCalculation {
    const annualGrossSalary = monthlyGrossSalary * 12;

    // Työnantajan puoli.
    const employerRateSum = Object.values(employerRates).reduce((a, b) => a + b, 0);
    const employerContributions = monthlyGrossSalary * employerRateSum;
    const employerOccupationalHealthcareCost = monthlyGrossSalary * employerOccupationalHealthcareRate;
    const employerTotalCost =
        monthlyGrossSalary + employerContributions + employerOccupationalHealthcareCost;

    // Työntekijän puoli.
    const employeeMandatoryAmount = monthlyGrossSalary * employeeMandatoryRate;
    const taxableAnnual = taxableAnnualIncome(annualGrossSalary);
    const localTaxAmount = (municipalTaxRate + churchTaxRate) * (taxableAnnual / 12);
    const stateTaxAmount = calculateStateTaxAnnual(taxableAnnual) / 12;
    const totalTaxAmount = employeeMandatoryAmount + localTaxAmount + stateTaxAmount;

    const employeeUnionFee = monthlyGrossSalary * employeeUnionFeeRate;

    const netSalary = monthlyGrossSalary - (totalTaxAmount + employeeUnionFee);

    const employerVatAmount = employerTotalCost * vatRate;
    const employerTotalCostWithVAT = employerTotalCost + employerVatAmount;

    const netPercentageOfEmployerCost = (netSalary / employerTotalCostWithVAT) * 100;

    // Todellinen veroprosentti: verot ja veroluonteiset maksut suhteessa nettopalkkaan.
    // SE = nettiosuus (0…1), joten todellinen veroprosentti = (1 - SE) / SE × 100.
    const realTaxPercentage = netPercentageOfEmployerCost > 0
        ? ((100 - netPercentageOfEmployerCost) / netPercentageOfEmployerCost) * 100
        : 0;

    return {
        monthlyGrossSalary: roundCents(monthlyGrossSalary),
        annualGrossSalary: roundCents(annualGrossSalary),
        employerTotalCost: roundCents(employerTotalCost),
        employerTotalCostWithVAT: roundCents(employerTotalCostWithVAT),
        netSalary: roundCents(netSalary),
        netSalaryPctOfEmployerTotalCostWithVAT: roundCents(netPercentageOfEmployerCost),
        realTaxPercentage: roundCents(realTaxPercentage),
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
}
