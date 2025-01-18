import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Theme } from './theme';

export const Container = styled.div`
  min-height: 100vh;
  padding: ${({ theme }: { theme: Theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  background: radial-gradient(
    circle at center,
    #111 0%,
    ${({ theme }) => theme.colors.background} 100%
  );

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

export const Header = styled.h1`
  font-size: clamp(3rem, 8vw, 4.5rem);
  font-weight: 800;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: ${({ theme }) => theme.shadows.glow};
  letter-spacing: -0.02em;
  filter: drop-shadow(0 0 30px rgba(0, 255, 148, 0.3));
`;

export const Subheader = styled.h2`
  font-size: clamp(1.2rem, 4vw, 1.8rem);
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  font-weight: 500;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

export const InputContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
`;

export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  transition: all ${({ theme }) => theme.transitions.normal};
  box-shadow: ${({ theme }) => theme.shadows.glow};
  text-align: center;
  font-weight: 600;
  backdrop-filter: blur(10px);

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: ${({ theme }) => theme.shadows.glowSecondary};
    background: rgba(255, 255, 255, 0.08);
    transform: scale(1.02);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: normal;
    text-align: center;
  }
`;

export const ResultContainer = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

export const MainResult = styled(motion.div)`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  h3 {
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    font-weight: 500;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  }
  
  p {
    font-size: clamp(3rem, 10vw, 5rem);
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primary};
    text-shadow: ${({ theme }) => theme.shadows.glow};
    filter: drop-shadow(0 0 30px rgba(0, 255, 148, 0.2));
  }
`;

export const GraphContainer = styled.div`
  margin: ${({ theme }) => theme.spacing.xl} 0;
  height: 400px;
  position: relative;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: ${({ theme }) => theme.spacing.md};
`;

export const AccordionContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

export const AccordionHeader = styled.button<{ isOpen: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.2rem;
  text-align: left;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }

  svg {
    transform: rotate(${({ isOpen }) => (isOpen ? '180deg' : '0deg')});
    transition: transform ${({ theme }) => theme.transitions.normal};
  }
`;

export const AccordionContent = styled(motion.div)`
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
  line-height: 1.6;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  margin-top: ${({ theme }) => theme.spacing.md};

  h4 {
    margin-top: 0;
  }

  p {
    margin-top: ${({ theme }) => theme.spacing.xs};
  }
`;

export const EmployerCostContainer = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  h3 {
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    font-weight: 500;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  }
  
  p {
    font-size: clamp(2rem, 6vw, 2.5rem);
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
    text-shadow: ${({ theme }) => theme.shadows.glow};
    filter: drop-shadow(0 0 20px rgba(0, 255, 148, 0.2));
  }
`;