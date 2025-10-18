'use client';

import { motion } from 'framer-motion';

interface ToolbarProps {
  tools: Array<{
    id: string;
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
  }>;
}

export default function Toolbar({ tools }: ToolbarProps) {
  return (
    <div className="flex flex-col gap-2 p-2 bg-spooky-card border-r border-orange-500/20">
      {tools.map((tool) => (
        <motion.button
          key={tool.id}
          onClick={tool.onClick}
          disabled={tool.disabled}
          whileHover={!tool.disabled ? { scale: 1.05 } : {}}
          whileTap={!tool.disabled ? { scale: 0.95 } : {}}
          className={`
            w-14 h-14 rounded-lg flex items-center justify-center
            transition-all duration-200
            ${tool.active
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
              : 'bg-spooky-bg text-gray-400 hover:bg-orange-500/20 hover:text-orange-500'
            }
            ${tool.disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title={tool.label}
        >
          {tool.icon}
        </motion.button>
      ))}
    </div>
  );
}
