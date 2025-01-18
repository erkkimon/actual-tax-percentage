# actual-tax-percentage

This project is a thought experiment that shows how much tax and tax-like expenses end up being paid when a Finnish citizen buys a product priced at 1 €. By tracing costs through wages, employer contributions, and consumption tax, the model demonstrates the cumulative tax burden embedded in a simple purchase.

Contributions are very welcome—especially pull requests adding country-specific branches for comparison, so we can explore how these figures differ worldwide.

# Assumptions and Methodology (English)

Below is a list of each cost component and how it is calculated in the algorithm. These details help clarify **why** each line item exists and how its value is derived.

1. **Monthly Gross Salary (User Input)**  
   - The algorithm starts with the employee’s **monthly gross** salary as provided by the user.

2. **Annual Gross Salary**  
   - We calculate:  
     \[
     \text{annualGrossSalary} = \text{monthlyGrossSalary} \times 12.5
     \]  
   - **Reason**: In Finland, many employment contracts include holiday pay or *lomaraha* equivalent to half a month’s salary, bringing the total year’s pay to ~12.5 months.

3. **Employer’s Statutory Contributions**  
   - The employer must pay these on **top** of the gross salary.  
   - Percentages (rough averages):  
     - **TyEL (pension)**: 17.70%  
     - **Unemployment (employer)**: 0.61%  
     - **Health Insurance (employer)**: 1.87%  
     - **Accident Insurance**: 0.70%  
     - **Group Life Insurance**: 0.06%  
   - In the code, they are combined into `employerRateSum`.

4. **Occupational Healthcare (Employer)**  
   - We assume an **average** of **1%** of the monthly gross salary for occupational health services.  
   - This cost varies in real life by employer’s contracts, scope of coverage, and industry.

5. **Employer Total Cost**  
   - Per month, defined as:  
     \[
     \text{monthlyGrossSalary} \;+\; 
     (\text{monthlyGrossSalary} \times \text{employerRateSum}) \;+\; 
     (\text{monthlyGrossSalary} \times 0.01)
     \]  
   - In other words, **gross salary + employer contributions + occupational healthcare**.  

6. **Employee’s Statutory Contributions**  
   - These are withheld **from** the employee’s gross pay.  
   - Average combined rate of ~9.64%:  
     - **TyEL (employee)**: 7.15%  
     - **Unemployment (employee)**: 0.59%  
     - **Health Insurance (employee)**: 1.90%

7. **Local Taxes (Municipal + Church)**  
   - We use an **average** of **8.92%** on the monthly gross salary.  
   - Actual rates differ by municipality and church membership status.

8. **State Income Tax**  
   - Computed via the **annual** brackets on `annualGrossSalary`.  
   - The resulting **annual** state tax is then divided by **12.5** to determine a **monthly** tax deduction.

9. **Union Fees**  
   - Assumed to be **1.5%** of the monthly gross salary, reflecting typical union dues in Finland.  
   - This is also withheld from the employee’s pay, though in reality union fees can vary or be based on net pay.

10. **Net Salary**  
    - The employee’s take-home pay each month:  
      \[
      \text{monthlyGrossSalary}
      \;-\; (\text{employee statutory contributions})
      \;-\; (\text{local tax})
      \;-\; (\text{monthly share of state tax})
      \;-\; (\text{union fees})
      \]

11. **25.5% “VAT on Wages” (Employer)**  
    - In **actual Finnish law**, wages are not subject to VAT.  
    - **However**, this model treats wages as though they incur a 25.5% non-deductible tax for the employer.  
    - Thus, an additional 25.5% is calculated on top of the **employer total cost**.

12. **Employer Total Cost With VAT**  
    \[
    \text{employerTotalCostWithVAT}
    = \text{employerTotalCost} \times (1 + 0.255)
    \]

13. **Percentage of Net Salary vs. Employer Total Cost With VAT**  
    - Finally, we compute how much of the **all-in employer outlay** (including the “VAT on wages”) ends up as the employee’s net salary.  
    - Percentage:  
      \[
      \frac{\text{netSalary}}{\text{employerTotalCostWithVAT}} \times 100
      \]

---

## Disclaimers and Notes

- **Holiday Pay**: Using a factor of **12.5** months is a simplification based on common Finnish practices. Some employers may handle holiday bonuses differently.  
- **Average Rates**: Statutory contribution percentages can vary slightly by year, sector, or age bracket. We use aggregated **typical** or “representative” values.  
- **Union Fees**: Not everyone pays union fees, or the rate might differ. This is just a generic assumption.  
- **Occupational Healthcare**: The 1% assumption is also approximate and can vary widely in reality.  
- **VAT on Wages**: This is **not** how Finnish VAT law works; it’s a **thought experiment** modeling wages as if they were taxed at 25.5% in the same way as ordinary business expenses that aren’t VAT-deductible.  
- **State Tax Brackets**: Official bracket thresholds for Finnish income tax are progressive and can include further nuances or deductions (e.g., tax credits, travel expenses, interest payments). We keep it simple with the base rates for 2025.  

# Oletukset ja laskentamenetelmä (Finnish)

Alla on lueteltu jokainen kustannuserä sekä niiden laskentaperiaate. Näiden tietojen avulla selviää **miksi** jokainen rivi on mukana ja miten sen arvo muodostuu.

1. **Kuukausibruttopalkka (Käyttäjän syöte)**  
   - Algoritmi alkaa työntekijän **kuukausittaisella bruttopalkalla**, joka annetaan syötteenä.

2. **Vuosibruttopalkka**  
   - Lasketaan:
     \[
     \text{annualGrossSalary} = \text{monthlyGrossSalary} \times 12.5
     \]  
   - **Perustelu**: Suomessa monissa työsopimuksissa maksetaan lomaraha (noin puoli kuukautta lisää palkkaa), jolloin vuoden kokonaispalkka on **noin 12,5** kuukauden palkkaa.

3. **Työnantajan lakisääteiset sivukulut**  
   - Työnantaja maksaa nämä **bruttopalkan päälle**.  
   - Käytetyt keskimääräiset prosentit:
     - **TyEL (työeläke, työnantajan osuus)**: 17,70 %  
     - **Työttömyysvakuutus (työnantajan osuus)**: 0,61 %  
     - **Sairausvakuutus (työnantajan osuus)**: 1,87 %  
     - **Tapaturmavakuutus**: 0,70 %  
     - **Ryhmähenkivakuutus**: 0,06 %  
   - Koodissa nämä summataan `employerRateSum`-muuttujaan.

4. **Työterveydenhuolto (Työnantajan kustannus)**  
   - Oletamme keskimääräiseksi kustannukseksi **1 %** kuukausibruttopalkasta.  
   - Todellisuudessa kustannus vaihtelee työnantajan sopimusten, toimialan ja kattavuuden mukaan.

5. **Työnantajan kokonaiskustannus**  
   - Kuukaudessa määritellään:
     \[
     \text{monthlyGrossSalary} \;+\; 
     (\text{monthlyGrossSalary} \times \text{employerRateSum}) \;+\;
     (\text{monthlyGrossSalary} \times 0.01)
     \]  
   - Toisin sanoen **bruttopalkka + työnantajan lakisääteiset kulut + työterveydenhuoltokulut**.

6. **Työntekijän lakisääteiset pidätykset**  
   - Vähennetään **työntekijän bruttopalkasta**.  
   - Yhteensä n. 9,64 %:
     - **TyEL (työntekijän osuus)**: 7,15 %  
     - **Työttömyysvakuutus (työntekijän osuus)**: 0,59 %  
     - **Sairausvakuutus (työntekijän osuus)**: 1,90 %

7. **Kunnallisvero (kunnallis- ja kirkollisvero)**  
   - Käytämme keskimääräistä **8,92 %** bruttopalkasta.  
   - Todellisuudessa vaihtelee kunnittain ja kirkkokuntajäsenyyden mukaan.

8. **Valtion tulovero**  
   - Lasketaan **vuositulon** perusteella (`annualGrossSalary`) progressiivisella verotaulukolla.  
   - Sen jälkeen jaetaan veron kokonaismäärä **12,5**:lla, jotta saadaan kuukausittain pidätettävä osuus.

9. **Ammattiliiton jäsenmaksu**  
   - Oletus **1,5 %** kuukausibruttopalkasta.  
   - Monilla aloilla liiton jäsenmaksu on tässä suuruusluokassa (1–2 %). Jotkut laskevat maksun nettopalkasta. Tässä esimerkissä käytetään bruttopalkkapohjaa.

10. **Nettopalkka**  
    - Työntekijän käteen jäävä palkka kuukausittain:
      \[
      \text{monthlyGrossSalary}
      \;-\; (\text{työntekijän lakisääteiset pidätykset})
      \;-\; (\text{kunnallisvero})
      \;-\; (\text{kuukausittainen osuus valtionverosta})
      \;-\; (\text{liiton jäsenmaksu})
      \]

11. **25,5 %:n “ALV palkoista” (työnantajan näkökulma)**  
    - Oikeassa Suomen ALV-lainsäädännössä palkat ovat ALV:n ulkopuolella.  
    - Tässä mallissa kuitenkin oletetaan, että palkat aiheuttavat **25,5 %**:n “ALV-tyyppisen” kustannuksen työnantajalle (ikään kuin palkkoja ei voisi vähentää arvonlisäverotuksessa).

12. **Työnantajan kokonaiskustannus ALV:lla**  
    \[
    \text{employerTotalCostWithVAT}
    = \text{employerTotalCost} \times (1 + 0.255)
    \]

13. **Nettopalkan osuus työnantajan kokonaiskustannuksesta**  
    - Lopuksi lasketaan, kuinka monta prosenttia työntekijän nettopalkka on työnantajan kaikista kuluista:
      \[
      \frac{\text{netSalary}}{\text{employerTotalCostWithVAT}} \times 100
      \]

---

## Huomioita ja rajoituksia

- **Lomaraha**: 12,5 kuukauden kertoimella huomioimme yleisen käytännön. Joillakin aloilla lomapalkan määrä voi kuitenkin poiketa tästä.  
- **Keskimääräiset sivukuluprosentit**: Vuosittain, toimialoittain ja ikäryhmittäin voi olla vaihtelua. Esimerkissä käytetään likimääräisiä perusarvoja.  
- **Liiton jäsenmaksu**: Ei ole lakisääteinen, ja sen suuruus vaihtelee. Tässä käytetään 1,5 % bruttopalkasta.  
- **Työterveydenhuolto**: 1 % bruttopalkasta on likimääräinen arvio, todelliset kustannukset voivat vaihdella merkittävästi.  
- **ALV palkoista**: Oletuksena on, että työnantaja myy tuotteita 25,5 %:n ALV-kannalla, mutta palkkakustannuksia ei voi vähentää arvonlisäverotuksessa. Jokaisesta palkkoihin käytetystä eurosta syntyy näin 25,5 %:n lisäkustannus.
- **Valtion tuloveron laskenta**: Käytetyt taulukot ja rajat ovat vuoden 2025 tuloveroperusteiden mukaiset. Todellisuudessa verotukseen vaikuttavat monet vähennykset ja muut seikat, joita ei tässä huomioida.  

