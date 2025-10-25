import { Theme } from '@/contexts/ThemeContext';

export interface ThemeConfig {
  name: string;
  emoji: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    borderHover: string;
    buttonBg: string;
    buttonHover: string;
    success: string;
    error: string;
    warning: string;
  };
  gradient: {
    from: string;
    via: string;
    to: string;
  };
  backgroundGradient: string;
  font: {
    family: string;
    headingFamily: string;
  };
  shadows: {
    glow: string;
    card: string;
    button: string;
  };
  emojis: string[];
  title: string;
  subtitle: string;
  buttonText: string;
  canvasTheme: {
    brushColor: string;
    backgroundColor: string;
    borderColor: string;
  };
}

export const themes: Record<Theme, ThemeConfig> = {
  halloween: {
    name: 'Halloween',
    emoji: '🎃',
    colors: {
      primary: '#FF6B35',
      secondary: '#7B2CBF',
      accent: '#00F5D4',
      background: 'radial-gradient(circle at center, #0D0D0F 0%, #000000 100%)',
      cardBg: 'rgba(18, 18, 24, 0.9)',
      text: '#F8F9FA',
      textSecondary: '#ADB5BD',
      border: 'rgba(255, 107, 53, 0.3)',
      borderHover: 'rgba(123, 44, 191, 0.6)',
      buttonBg: 'linear-gradient(135deg, #FF6B35 0%, #7B2CBF 100%)',
      buttonHover: 'linear-gradient(135deg, #FF8555 0%, #9C4FD9 100%)',
      success: '#00F5D4',
      error: '#EF233C',
      warning: '#FFB703',
    },
    gradient: {
      from: 'from-orange-500',
      via: 'via-purple-700',
      to: 'to-orange-500',
    },
    backgroundGradient: 'radial-gradient(ellipse at top left, rgba(255, 107, 53, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(123, 44, 191, 0.08) 0%, transparent 50%), #000000',
    font: {
      family: "'Inter', sans-serif",
      headingFamily: "'Creepster', cursive",
    },
    shadows: {
      glow: '0 0 40px rgba(255, 107, 53, 0.3), 0 0 80px rgba(123, 44, 191, 0.2)',
      card: '0 4px 24px rgba(255, 107, 53, 0.12), 0 2px 12px rgba(123, 44, 191, 0.08)',
      button: '0 4px 16px rgba(255, 107, 53, 0.3), 0 2px 8px rgba(123, 44, 191, 0.2)',
    },
    emojis: ['🎃', '👻', '🕷️', '🦇', '💀', '🕸️', '🍬', '🧙'],
    title: 'SpookySketch',
    subtitle: 'Unleash your creativity with our Halloween-themed drawing app. Create, collaborate, and share spooky masterpieces! 🎃👻',
    buttonText: 'Start Drawing',
    canvasTheme: {
      brushColor: '#FF6B35',
      backgroundColor: '#0D0D0F',
      borderColor: 'rgba(123, 44, 191, 0.4)',
    },
  },
  christmas: {
    name: 'Christmas',
    emoji: '🎄',
    colors: {
      primary: '#C41E3A',
      secondary: '#165B33',
      accent: '#F4C430',
      background: 'radial-gradient(circle at center, #0F1419 0%, #000509 100%)',
      cardBg: 'rgba(20, 30, 25, 0.92)',
      text: '#FFFFFF',
      textSecondary: '#D1FAE5',
      border: 'rgba(196, 30, 58, 0.35)',
      borderHover: 'rgba(22, 91, 51, 0.6)',
      buttonBg: 'linear-gradient(135deg, #C41E3A 0%, #165B33 100%)',
      buttonHover: 'linear-gradient(135deg, #E02B50 0%, #1E7A45 100%)',
      success: '#10B981',
      error: '#C41E3A',
      warning: '#F4C430',
    },
    gradient: {
      from: 'from-red-700',
      via: 'via-green-800',
      to: 'to-red-700',
    },
    backgroundGradient: 'radial-gradient(ellipse at top right, rgba(196, 30, 58, 0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(22, 91, 51, 0.1) 0%, transparent 50%), #000509',
    font: {
      family: "'Inter', sans-serif",
      headingFamily: "'Mountains of Christmas', cursive",
    },
    shadows: {
      glow: '0 0 30px rgba(196, 30, 58, 0.4), 0 0 60px rgba(22, 91, 51, 0.25)',
      card: '0 4px 24px rgba(196, 30, 58, 0.15), 0 2px 12px rgba(22, 91, 51, 0.12)',
      button: '0 4px 16px rgba(196, 30, 58, 0.35), 0 2px 8px rgba(22, 91, 51, 0.25)',
    },
    emojis: ['🎄', '🎅', '⛄', '🎁', '❄️', '🔔', '⭐', '🦌'],
    title: 'FestiveSketch',
    subtitle: 'Spread holiday cheer with our Christmas-themed drawing app. Create magical winter art and share the joy! 🎄🎅',
    buttonText: 'Start Creating',
    canvasTheme: {
      brushColor: '#C41E3A',
      backgroundColor: '#0A0F0D',
      borderColor: 'rgba(22, 91, 51, 0.5)',
    },
  },
  newyear: {
    name: 'New Year',
    emoji: '🎆',
    colors: {
      primary: '#F4C430',
      secondary: '#9333EA',
      accent: '#EC4899',
      background: 'radial-gradient(circle at center, #0A0A12 0%, #000000 100%)',
      cardBg: 'rgba(25, 18, 38, 0.9)',
      text: '#FEFEFE',
      textSecondary: '#E9D5FF',
      border: 'rgba(244, 196, 48, 0.35)',
      borderHover: 'rgba(147, 51, 234, 0.6)',
      buttonBg: 'linear-gradient(135deg, #F4C430 0%, #9333EA 100%)',
      buttonHover: 'linear-gradient(135deg, #FFD954 0%, #A855F7 100%)',
      success: '#10B981',
      error: '#EC4899',
      warning: '#F4C430',
    },
    gradient: {
      from: 'from-amber-400',
      via: 'via-purple-600',
      to: 'to-pink-500',
    },
    backgroundGradient: 'radial-gradient(ellipse at top left, rgba(244, 196, 48, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(147, 51, 234, 0.08) 0%, transparent 50%), #000000',
    font: {
      family: "'Inter', sans-serif",
      headingFamily: "'Pacifico', cursive",
    },
    shadows: {
      glow: '0 0 40px rgba(244, 196, 48, 0.35), 0 0 80px rgba(147, 51, 234, 0.25)',
      card: '0 4px 24px rgba(244, 196, 48, 0.15), 0 2px 12px rgba(147, 51, 234, 0.12)',
      button: '0 4px 16px rgba(244, 196, 48, 0.35), 0 2px 8px rgba(147, 51, 234, 0.25)',
    },
    emojis: ['🎆', '🎊', '🎉', '🥳', '🍾', '🎈', '✨', '🌟'],
    title: 'CelebrationSketch',
    subtitle: 'Ring in the new year with our celebration-themed drawing app. Create stunning art for fresh beginnings! 🎆🎉',
    buttonText: 'Begin Creating',
    canvasTheme: {
      brushColor: '#F4C430',
      backgroundColor: '#0A0614',
      borderColor: 'rgba(147, 51, 234, 0.4)',
    },
  },
};

export function getThemeConfig(theme: Theme): ThemeConfig {
  return themes[theme];
}

export function getThemeColors(theme: Theme) {
  return themes[theme].colors;
}
