import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AccordionHeader, AccordionContent } from '../styles/StyledComponents';

export const AssumptionsAccordion: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const assumptions = [
        {
            title: 'Lomaraha',
            description: 'Vuosipalkan laskennassa käytetään kerrointa 12,5 kuukautta lomarahan huomioimiseksi.'
        },
        {
            title: 'Työnantajan sivukulut',
            description: [
                'TyEL (työeläke): 17,70 %',
                'Työttömyysvakuutus: 0,61 %',
                'Sairausvakuutus: 1,87 %',
                'Tapaturmavakuutus: 0,70 %',
                'Ryhmähenkivakuutus: 0,06 %'
            ].join('\n')
        },
        {
            title: 'Työterveyshuolto',
            description: 'Oletettu kustannus on 1 % bruttopalkasta.'
        },
        {
            title: 'Työntekijän lakisääteiset maksut',
            description: [
                'TyEL (työntekijä): 7,15 %',
                'Työttömyysvakuutus: 0,59 %',
                'Sairausvakuutus: 1,90 %'
            ].join('\n')
        },
        {
            title: 'Kunnallisvero',
            description: 'Käytetään keskimääräistä 8,92 % kunnallis- ja kirkollisveroa.'
        },
        {
            title: 'Ammattiliiton jäsenmaksu',
            description: 'Oletettu jäsenmaksu on 1,5 % bruttopalkasta.'
        },
        {
            title: 'ALV palkoista',
            description: 'Oletuksena on, että työnantaja myy tuotteita 25,5 %:n ALV-kannalla, mutta palkkakustannuksia ei voi vähentää arvonlisäverotuksessa. Jokaisesta palkkoihin käytetystä eurosta syntyy näin 25,5 %:n lisäkustannus.'
        }
    ];

    return (
        <div>
            <AccordionHeader
                onClick={() => setIsOpen(!isOpen)}
                isOpen={isOpen}
            >
                Laskelman oletukset
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </AccordionHeader>

            <AnimatePresence>
                {isOpen && (
                    <AccordionContent
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {assumptions.map((assumption, index) => (
                            <div key={index} style={{ marginBottom: index < assumptions.length - 1 ? '1.5rem' : 0 }}>
                                <h4 style={{
                                    color: '#fff',
                                    marginBottom: '0.5rem',
                                    fontWeight: 600,
                                    fontSize: '1.1rem'
                                }}>
                                    {assumption.title}
                                </h4>
                                <p style={{
                                    whiteSpace: 'pre-line',
                                    lineHeight: 1.6,
                                    margin: 0,
                                    paddingLeft: assumption.description.includes('\n') ? '1rem' : 0
                                }}>
                                    {assumption.description}
                                </p>
                            </div>
                        ))}
                    </AccordionContent>
                )}
            </AnimatePresence>
        </div>
    );
};