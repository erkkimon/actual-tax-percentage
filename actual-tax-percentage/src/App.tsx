import { useState } from 'react';
import {
  Container,
  ContentWrapper,
  Header,
  Subheader,
  InputContainer,
  Input,
  ResultContainer,
  MainResult,
  GraphContainer,
  AccordionContainer,
  EmployerCostContainer
} from './styles/StyledComponents';
import { SalaryCalculation, estimateSalary } from './utils/taxCalculator';
import { TaxBreakdownChart } from './components/TaxBreakdownChart';
import { AssumptionsAccordion } from './components/AssumptionsAccordion';
import { ThemeProvider } from './styles/ThemeProvider';

function App() {
  const [salary, setSalary] = useState<SalaryCalculation | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setInputValue(value);

    if (value) {
      setSalary(estimateSalary(Number(value)));
    } else {
      setSalary(null);
    }
  };

  const content = (
    <Container>
      <ContentWrapper>
        {/* SEO-optimized Finnish header */}
        <header>
          <Header>Suomalaisen euro</Header>
          <Subheader>Laske, miten paljon palkastasi haihtuu veroihin ja veroluonteisiin maksuihin</Subheader>
        </header>

        <main>
          <InputContainer>
            <Input
              type="text"
              placeholder="Bruttotulot / kk"
              onChange={handleInputChange}
              value={inputValue}
              aria-label="Syötä bruttotulosi kuukaudessa"
            />
          </InputContainer>

          {salary && (
            <ResultContainer>
              <EmployerCostContainer>
                <h3>Kustannus työnantajalle</h3>
                <p>{salary.employerTotalCostWithVAT.toLocaleString('fi-FI')} €</p>
              </EmployerCostContainer>

              <MainResult
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={salary.netSalaryPctOfEmployerTotalCostWithVAT}
              >
                <h3>Eurosi on</h3>
                <p>{Math.round(salary.netSalaryPctOfEmployerTotalCostWithVAT)} senttiä</p>
              </MainResult>

              <GraphContainer>
                <TaxBreakdownChart salary={salary} />
              </GraphContainer>

              <AccordionContainer>
                <AssumptionsAccordion />
              </AccordionContainer>
            </ResultContainer>
          )}
        </main>

        {/* SEO-optimized Finnish metadata */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <h2>Verojen ja veroluonteisten maksujen laskuri</h2>
          <p>
            Laske, kuinka paljon veroja ja veroluonteisia maksuja maksat palkastasi.
            Sisältää työnantajan sivukulut, työntekijän lakisääteiset maksut,
            kunnallisveron, kirkollisveron, valtion tuloveron ja ammattiliiton jäsenmaksut.
          </p>
          <p>
            Laskuri näyttää myös, kuinka suuri osa työnantajan maksamasta
            kokonaiskustannuksesta päätyy työntekijän nettopalkaksi.
          </p>
        </div>
      </ContentWrapper>
    </Container>
  );

  return (
    <ThemeProvider>
      {content}
    </ThemeProvider>
  );
}

export default App;
