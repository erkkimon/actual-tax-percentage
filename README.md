# actual-tax-percentage

This project is a thought experiment that shows how much tax and tax-like expenses end up being paid when buying a product priced at 1€. By tracing costs through wages, employer contributions, and consumption tax, the model demonstrates the cumulative tax burden embedded in a simple purchase.

Contributions are very welcome—especially pull requests adding country-specific branches for comparison, so we can explore how these figures differ worldwide.

## Assumptions and Methodology

Below is a list of each cost component and how it is calculated in the algorithm. These details help clarify **why** each line item exists and how its value is derived.

1. **Monthly Gross Salary (User Input)**
   - The algorithm starts with the employee's **monthly gross** salary as provided by the user.

2. **Annual Gross Salary**
   - Calculated as monthly salary × 12
   - Some countries may have additional months of salary (e.g., holiday pay)

3. **Employer's Statutory Contributions**
   - The employer must pay these on **top** of the gross salary
   - Includes typical contributions like:
     - Pension
     - Unemployment insurance
     - Health insurance
     - Accident insurance
     - Group life insurance
   - In the code, they are combined into `employerRateSum`

4. **Occupational Healthcare (Employer)**
   - Assumed cost for providing healthcare services
   - This varies by country, employer, and industry

5. **Employer Total Cost**
   - Monthly cost calculated as:
   ```
   monthlyGrossSalary + 
   (monthlyGrossSalary × employerRateSum) + 
   occupationalHealthcareCost
   ```

6. **Employee's Statutory Contributions**
   - These are withheld **from** the employee's gross pay
   - Typically includes employee portions of:
     - Pension
     - Unemployment insurance
     - Health insurance

7. **Income Tax**
   - Applied based on tax brackets
   - Tax rates are progressive
   - May include local and state taxes

8. **Union Fees**
   - Optional membership fees
   - Usually a percentage of gross salary

9. **Net Salary**
   - The employee's take-home pay each month:
   ```
   monthlyGrossSalary
   - employeeStatutoryContributions
   - incomeTax
   - unionFees
   ```

10. **VAT on Total Cost**
    - Applied to employer's total cost
    - This is a thought experiment modeling wages as if they were taxed like other business expenses

11. **Employer Total Cost With VAT**
    ```
    employerTotalCostWithVAT = employerTotalCost × (1 + vatRate)
    ```

12. **Net Salary Percentage**
    - Shows how much of the total employer cost (including VAT) becomes net salary:
    ```
    (netSalary ÷ employerTotalCostWithVAT) × 100
    ```

## Disclaimers and Notes

- **Tax Rates**: The actual rates vary by country and can change yearly
- **Contributions**: Statutory contributions differ significantly between countries
- **Healthcare**: Healthcare costs and systems vary widely internationally
- **VAT**: The VAT calculation is a thought experiment, not reflecting actual tax law
- **Tax Brackets**: The implementation uses real tax brackets but simplifies many aspects of tax law
