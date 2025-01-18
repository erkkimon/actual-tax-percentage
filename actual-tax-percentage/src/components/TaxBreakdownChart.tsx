import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { SalaryCalculation } from '../utils/taxCalculator';
import { theme } from '../styles/theme';

interface TaxBreakdownChartProps {
    salary: SalaryCalculation;
}

interface ChartData {
    name: string;
    value: number;
    description: string;
    isNetSalary?: boolean;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
    active?: boolean;
    payload?: Array<{
        payload: ChartData;
        value: number;
    }>;
}

export const TaxBreakdownChart: React.FC<TaxBreakdownChartProps> = ({ salary }) => {
    const data: ChartData[] = [
        {
            name: 'Nettopalkka',
            value: salary.netSalary,
            description: 'Käteen jäävä osuus palkasta verojen ja veroluonteisten maksujen jälkeen',
            isNetSalary: true
        },
        {
            name: 'TyEL (työnantaja)',
            value: salary.breakdown.employerContributions.tyel,
            description: 'Työnantajan eläkemaksu'
        },
        {
            name: 'Työttömyysvakuutus (työnantaja)',
            value: salary.breakdown.employerContributions.unemployment,
            description: 'Työnantajan työttömyysvakuutusmaksu'
        },
        {
            name: 'Sairausvakuutus (työnantaja)',
            value: salary.breakdown.employerContributions.healthInsurance,
            description: 'Työnantajan sairausvakuutusmaksu'
        },
        {
            name: 'Tapaturmavakuutus',
            value: salary.breakdown.employerContributions.accidentInsurance,
            description: 'Lakisääteinen tapaturmavakuutus'
        },
        {
            name: 'Ryhmähenkivakuutus',
            value: salary.breakdown.employerContributions.groupLife,
            description: 'Työntekijän ryhmähenkivakuutus'
        },
        {
            name: 'Työterveyshuolto',
            value: salary.breakdown.employerContributions.occupationalHealthcare,
            description: 'Työterveyshuollon kustannukset'
        },
        {
            name: 'Lakisääteiset maksut (työntekijä)',
            value: salary.breakdown.employeeDeductions.pensionUnemploymentHealth,
            description: 'Työntekijän eläke-, työttömyys- ja sairausvakuutusmaksut'
        },
        {
            name: 'Kunnallisvero',
            value: salary.breakdown.employeeDeductions.localTax,
            description: 'Kunnallis- ja kirkollisvero'
        },
        {
            name: 'Valtion tulovero',
            value: salary.breakdown.employeeDeductions.stateTaxMonthly,
            description: 'Valtion progressiivinen tulovero'
        },
        {
            name: 'Ammattiliiton jäsenmaksu',
            value: salary.breakdown.employeeDeductions.unionFee,
            description: 'Ammattiliiton jäsenmaksu (1,5 % bruttopalkasta)'
        },
        {
            name: 'ALV palkoista',
            value: salary.breakdown.employerVAT.employerVATonWages,
            description: 'ALV, joka on 25,5 % palkkakustannuksista'
        }
    ];

    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{
                    background: 'rgba(0, 0, 0, 0.95)',
                    padding: '16px',
                    border: `2px solid ${data.isNetSalary ? theme.colors.primary : theme.colors.secondary}`,
                    borderRadius: '8px',
                    color: theme.colors.text,
                    boxShadow: data.isNetSalary ? `0 0 30px ${theme.colors.primary}40` : 'none',
                    backdropFilter: 'blur(10px)',
                    zIndex: 1000
                }}>
                    <p style={{
                        margin: '0 0 8px 0',
                        color: data.isNetSalary ? theme.colors.primary : theme.colors.secondary,
                        fontWeight: 'bold',
                        fontSize: data.isNetSalary ? '1.3em' : '1em'
                    }}>
                        {data.name}
                    </p>
                    <p style={{
                        margin: '0 0 4px 0',
                        fontSize: data.isNetSalary ? '1.5em' : '1.1em',
                        fontWeight: data.isNetSalary ? 'bold' : 'normal'
                    }}>
                        {data.value.toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </p>
                    <p style={{ margin: '0', fontSize: '0.9em', color: theme.colors.textSecondary }}>
                        {data.description}
                    </p>
                    <p style={{
                        margin: '4px 0 0 0',
                        fontSize: data.isNetSalary ? '1.2em' : '0.9em',
                        color: data.isNetSalary ? theme.colors.primary : theme.colors.secondary,
                        fontWeight: data.isNetSalary ? 'bold' : 'normal'
                    }}>
                        {((data.value / salary.employerTotalCostWithVAT) * 100).toFixed(1)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    labelLine={false}
                    animationDuration={500}
                    startAngle={90}
                    endAngle={450}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.isNetSalary ? theme.colors.primary : theme.colors.graphColors[index % theme.colors.graphColors.length]}
                            style={{
                                filter: entry.isNetSalary
                                    ? 'drop-shadow(0px 0px 25px rgba(0, 255, 148, 0.9))'
                                    : 'drop-shadow(0px 0px 3px rgba(255, 255, 255, 0.2))',
                                cursor: 'pointer',
                                stroke: entry.isNetSalary ? '#fff' : 'none',
                                strokeWidth: entry.isNetSalary ? 4 : 0,
                                opacity: entry.isNetSalary ? 1 : 0.7
                            }}
                        />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
        </ResponsiveContainer>
    );
};