import { useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AccordionHeader, AccordionContent } from '../styles/StyledComponents';

interface Source {
    n: number;
    label: string;
    url: string;
}

const Sup = ({ n }: { n: number }) => (
    <sup style={{ fontSize: '0.72em', marginLeft: '1px' }}>{n}</sup>
);

const sources: Source[] = [
    { n: 1, label: 'Eläketurvakeskus (ETK): Yksityisten alojen eläkemaksut TyEL ja MEL 2026', url: 'https://www.etk.fi/suomen-elakejarjestelma/rahoitus-ja-sijoitustoiminta/tyoelakemaksut/yksityisten-alojen-elakemaksut-tyel-ja-mel/' },
    { n: 2, label: 'Työllisyysrahasto: Vuoden 2026 työttömyysvakuutusmaksut on vahvistettu', url: 'https://www.tyollisyysrahasto.fi/uutiset/vuoden-2026-tyottomyysvakuutusmaksut-on-vahvistettu/' },
    { n: 3, label: 'EK / Rotio: Taloushallinnon tärkeät luvut 2026 (sosiaalivakuutusmaksut)', url: 'https://rotio.fi/kirjanpito/taloushallinnon-tarkeat-luvut-2026/' },
    { n: 4, label: 'Kuntaliitto: Kuntien verot 2026 (painotettu keskimääräinen tuloveroprosentti 7,57)', url: 'https://www.kuntaliitto.fi/' },
    { n: 5, label: 'Veronmaksajain Keskusliitto: Kunnallis- ja kirkollisverot', url: 'https://www.veronmaksajat.fi/' },
    { n: 6, label: 'Finlex 1140/2025: Laki vuoden 2026 tuloveroasteikosta', url: 'https://www.finlex.fi/fi/lainsaadanto/saadoskokoelma/2025/1140' },
    { n: 7, label: 'Rotio: Arvonlisäverokannat 2026 (yleinen 25,5 %)', url: 'https://rotio.fi/kirjanpito/taloushallinnon-tarkeat-luvut-2026/' },
    { n: 8, label: 'Verohallinto: Muutokset veroperusteisiin 2026', url: 'https://www.vero.fi/tietoa-verohallinnosta/tilastot/verotulojen-kehitys/muutokset-veroperusteisiin-verovuosittain/2026/' }
];

interface Assumption {
    title: string;
    lines: ReactNode[];
}

const assumptions: Assumption[] = [
    {
        title: 'Työnantajan sivukulut (2026)',
        lines: [
            <>TyEL (työeläke): 17,10 %<Sup n={1} /></>,
            <>Työttömyysvakuutus: 0,92 % (keskimäärin 0,31–1,23 %)<Sup n={2} /></>,
            <>Sairausvakuutus: 1,91 %<Sup n={3} /></>,
            <>Tapaturmavakuutus: noin 0,51 % (vaihtelee 0,05–5 %)<Sup n={3} /></>,
            <>Ryhmähenkivakuutus: 0,06 % (ennallaan)<Sup n={3} /></>
        ]
    },
    {
        title: 'Työterveyshuolto',
        lines: [
            <>Oletettu kustannus 1 % bruttopalkasta (ei lakisääteinen, työnantajakohtainen oletus).</>
        ]
    },
    {
        title: 'Työntekijän lakisääteiset maksut (2026)',
        lines: [
            <>TyEL (työntekijä): 7,30 %<Sup n={1} /></>,
            <>Työttömyysvakuutus: 0,89 %<Sup n={2} /></>,
            <>Sairausvakuutus: 1,98 % (sairaanhoitomaksu 1,10 % + päivärahamaksu 0,88 %)<Sup n={3} /></>
        ]
    },
    {
        title: 'Kunnallis- ja kirkollisvero',
        lines: [
            <>Kunnallisvero: keskimäärin 7,57 %<Sup n={4} /></>,
            <>Kirkollisvero: keskimäärin noin 1,06 %<Sup n={5} /></>
        ]
    },
    {
        title: 'Valtion tulovero (2026)',
        lines: [
            <>Progressiivinen tuloveroasteikko (Laki 1140/2025)<Sup n={6} />:</>,
            <>0–22 000 €: 12,64 % · 22 000–32 600 €: 19 % · 32 600–40 100 €: 30,25 % · 40 100–52 100 €: 33,25 % · yli 52 100 €: 37,5 %</>
        ]
    },
    {
        title: 'Vähennykset (2026)',
        lines: [
            <>Tulonhankkimisvähennys: 750 €<Sup n={8} /></>,
            <>Työtulovähennys: enintään 3 430 €<Sup n={8} /></>,
            <>Perusvähennys: enintään 4 265 €<Sup n={8} /></>
        ]
    },
    {
        title: 'Ammattiliiton jäsenmaksu',
        lines: [
            <>Oletettu jäsenmaksu 1,5 % bruttopalkasta (jäsenyys vapaaehtoinen).</>
        ]
    },
    {
        title: 'ALV palkoista',
        lines: [
            <>Yleinen ALV-kanta 25,5 % (voimassa 1.9.2024 alkaen)<Sup n={7} />. Oletuksena työnantaja myy tuotteita tällä kannalla, mutta palkkakustannuksia ei voi vähentää arvonlisäverotuksessa.</>
        ]
    }
];

export const AssumptionsAccordion: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

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
                            <div key={index} style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{
                                    color: '#fff',
                                    marginBottom: '0.5rem',
                                    fontWeight: 600,
                                    fontSize: '1.1rem'
                                }}>
                                    {assumption.title}
                                </h4>
                                <div style={{ paddingLeft: '1rem', lineHeight: 1.6 }}>
                                    {assumption.lines.map((line, i) => (
                                        <div key={i} style={{ marginBottom: '0.25rem' }}>{line}</div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div style={{
                            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                            paddingTop: '1rem'
                        }}>
                            <h4 style={{
                                color: '#fff',
                                marginBottom: '0.75rem',
                                fontWeight: 600,
                                fontSize: '1.1rem'
                            }}>
                                Lähteet
                            </h4>
                            <ol style={{
                                margin: 0,
                                paddingLeft: '1.25rem',
                                fontSize: '0.85rem',
                                lineHeight: 1.6
                            }}>
                                {sources.map(s => (
                                    <li key={s.n} style={{ marginBottom: '0.5rem', wordBreak: 'break-word' }}>
                                        {s.label}{' — '}
                                        <a
                                            href={s.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#00FF94', textDecoration: 'underline' }}
                                        >
                                            {s.url}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </AccordionContent>
                )}
            </AnimatePresence>
        </div>
    );
};
