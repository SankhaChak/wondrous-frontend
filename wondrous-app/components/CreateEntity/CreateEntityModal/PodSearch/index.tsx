import { useState } from 'react';
import {
  PodSearchAutocomplete,
  PodSearchAutocompletePopper,
  PodSearchButton,
  PodSearchButtonArrowIcon,
  PodSearchButtonDeleteIcon,
  PodSearchClickAway,
  PodSearchDefaultImage,
  PodSearchImageLabelWrapper,
  PodSearchInput,
  PodSearchInputAdornment,
  PodSearchInputIcon,
  PodSearchLabel,
  PodSearchList,
  PodSearchListItem,
  PodSearchPaper,
  PodSearchPopper,
  PodSearchWrapper,
} from './styles';

const PodSearch = (props) => {
  const { options, onChange, value, disabled } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(anchorEl ? null : event.currentTarget);
  const handleClickAway = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const selectedValue = options.find((option) => option.value === value);
  return (
    <PodSearchClickAway onClickAway={handleClickAway}>
      <PodSearchWrapper>
        <PodSearchButton open={open} disabled={!options || disabled} onClick={handleClick}>
          <PodSearchImageLabelWrapper>
            <PodSearchDefaultImage color={selectedValue?.color ?? `#474747`} />
            <PodSearchLabel>{selectedValue?.label ?? `Select a Pod`}</PodSearchLabel>
          </PodSearchImageLabelWrapper>
          {selectedValue && !disabled ? (
            <PodSearchButtonDeleteIcon
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(null);
              }}
            />
          ) : (
            <PodSearchButtonArrowIcon />
          )}
        </PodSearchButton>
        <PodSearchPopper open={open} anchorEl={anchorEl} placement="bottom-start" disablePortal={true}>
          <PodSearchAutocomplete
            value={selectedValue}
            renderInput={(params) => {
              return (
                <PodSearchInput
                  {...params}
                  ref={params.InputProps.ref}
                  disableUnderline={true}
                  fullWidth={true}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <PodSearchInputAdornment position="end">
                        <PodSearchInputIcon />
                      </PodSearchInputAdornment>
                    ),
                  }}
                />
              );
            }}
            disableClearable={true}
            isOptionEqualToValue={(option, value) => {
              return option.value === value?.value;
            }}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => {
              return (
                <PodSearchListItem {...props}>
                  <PodSearchDefaultImage color={option?.color ?? '#474747'} />
                  <PodSearchLabel>{option?.label}</PodSearchLabel>
                </PodSearchListItem>
              );
            }}
            PaperComponent={PodSearchPaper}
            ListboxComponent={PodSearchList}
            PopperComponent={(params) => <PodSearchAutocompletePopper {...params} />}
            open={open}
            options={options}
            disablePortal={true}
            onChange={(event, value, reason) => {
              if (reason === 'selectOption') {
                onChange(value.value);
                handleClickAway();
              }
            }}
            blurOnSelect={true}
          />
        </PodSearchPopper>
      </PodSearchWrapper>
    </PodSearchClickAway>
  );
};

export default PodSearch;
