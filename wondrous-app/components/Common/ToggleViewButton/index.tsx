import React, { useEffect, useState } from 'react';
import { ToggleViewWrapper, ToggleViewOption } from './styles';
import Tooltip from 'components/Tooltip';

interface IToggleViewButtonProps {
  options: {
    name: string;
    icon?: JSX.Element;
    active: boolean;
    action: () => void;
    disabled?: boolean;
  }[];
  style?: React.CSSProperties;
}

// Toggler between views (i.e. grid vs list)
export const ToggleViewButton = (props: IToggleViewButtonProps) => {
  const { options } = props;

  return (
    <ToggleViewWrapper {...props}>
      {options.map((opt, key) => {
        let className = opt.active && !opt?.disabled ? 'active' : '';
        if (opt?.disabled) className = `${className} disabled`;
        return (
          <Tooltip key={'toggle-option-' + opt.name} title={opt.name + ' view'} placement="top">
            <ToggleViewOption
              key={'toggle-option-' + opt.name}
              className={className}
              onClick={() => {
                opt.action();
              }}
            >
              {opt?.icon ?? opt.name}
            </ToggleViewOption>
          </Tooltip>
        );
      })}
    </ToggleViewWrapper>
  );
};
