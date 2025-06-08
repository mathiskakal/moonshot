import React from 'react';
import './Ribbon.css';

export interface RibbonButton {
  id: string;
  label: string;
  icon?: string | React.ReactNode;
  action: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  tooltip?: string;
}

export interface RibbonProps {
  buttons: RibbonButton[];
  className?: string;
}

const Ribbon: React.FC<RibbonProps> = ({ buttons, className }) => {
  return (
    <div className={`top-ribbon ${className || ''}`}>
      {buttons.map(button => (
        <button 
          key={button.id}
          onClick={button.action}
          disabled={button.disabled}
          className={`ribbon-button ${button.variant || 'primary'}`}
          title={button.tooltip}
        >
          {button.icon && <span className="button-icon">{button.icon}</span>}
          <span className="button-label">{button.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Ribbon;
