/**
 * This file is a wrapper around react-select and is a modified version
 * of material-ui's searchable select example: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/components/autocomplete/IntegrationReactSelect.js
 */
import clsx from 'clsx';
import React from 'react';

import Select, { createFilter } from 'react-select';
import { SelectComponents } from 'react-select/lib/components';
import { Config as FilterConfig } from 'react-select/lib/filters';
import { Styles as SelectStyles } from 'react-select/lib/styles';

import {
  Chip,
  createStyles,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
  withStyles
} from '@material-ui/core';
import { emphasize } from '@material-ui/core/styles';
import { ArrowDropDown, Cancel, Clear } from '@material-ui/icons';

import { ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) =>
  createStyles({
    input: {
      display: 'flex',
      padding: theme.spacing(1),
      height: 'auto',
      overflow: 'hidden'
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      overflow: 'hidden'
    },
    chip: {
      margin: theme.spacing(1, 1, 1, 0)
    },
    chipLabel: {
      maxWidth: '350px'
    },
    chipFocused: {
      backgroundColor: emphasize(theme.palette.grey[700], 0.08)
    },
    noOptionsMessage: {
      padding: theme.spacing(1, 2)
    },
    placeholder: {
      fontSize: 16
    },
    paper: {
      position: 'absolute',
      zIndex: 24,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0
    },
    clearIcon: {
      marginRight: theme.spacing(0.5)
    },
    dropDownIcon: {
      marginLeft: theme.spacing(0.5)
    }
  });

function NoOptionsMessage({ children, selectProps, innerProps }) {
  return (
    <Typography
      color="textSecondary"
      className={selectProps.classes.noOptionsMessage}
      {...innerProps}
    >
      {children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control({ children, innerRef, innerProps, selectProps, hasValue }) {
  const { classes, TextFieldProps } = selectProps;

  return (
    <TextField
      fullWidth
      variant="outlined"
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps
        }
      }}
      {...TextFieldProps}
      label={TextFieldProps.label}
      value={hasValue || ''}
    />
  );
}

function Option({ children, innerRef, innerProps, isFocused, isSelected }) {
  return (
    <MenuItem
      ref={innerRef}
      selected={isFocused}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
      {...innerProps}
    >
      {children}
    </MenuItem>
  );
}

function Placeholder({ children, innerProps, selectProps }) {
  return (
    <Typography
      color="textSecondary"
      className={selectProps.classes.placeholder}
      {...innerProps}
    >
      {children}
    </Typography>
  );
}

function ValueContainer({ children, selectProps }) {
  return <div className={selectProps.classes.valueContainer}>{children}</div>;
}

function MultiValue({ children, isFocused, removeProps, selectProps }) {
  const chipClasses = clsx(selectProps.classes.chip, {
    [selectProps.classes.chipFocused]: isFocused
  });

  const chipLabel = (
    <Typography noWrap className={selectProps.classes.chipLabel}>
      {children}
    </Typography>
  );
  return (
    <Chip
      variant="outlined"
      color="secondary"
      tabIndex={-1}
      label={chipLabel}
      className={chipClasses}
      onDelete={removeProps.onClick}
      deleteIcon={<Cancel {...removeProps} />}
    />
  );
}

function Menu({ children, innerProps, selectProps }) {
  return (
    <Paper square className={selectProps.classes.paper} {...innerProps}>
      {children}
    </Paper>
  );
}

function ClearIndicator({ children, innerProps, selectProps }) {
  return (
    <IconButton className={selectProps.classes.clearIcon} {...innerProps}>
      {children}
      <Clear />
    </IconButton>
  );
}

function DropdownIndicator({ children, innerProps, selectProps }) {
  return (
    <IconButton className={selectProps.classes.dropDownIcon} {...innerProps}>
      {children}
      <ArrowDropDown />
    </IconButton>
  );
}

const materialComponents: Partial<SelectComponents<any>> = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  ValueContainer,
  ClearIndicator,
  DropdownIndicator
};

const filterConfig: FilterConfig = {
  ignoreCase: true,
  ignoreAccents: true,
  trim: true
};

export type SearchableOption = {
  label: string;
  value: string;
};

function SearchableSelect({
  classes,
  theme,
  label,
  options,
  selectedOptions,
  onSelectedOptionsChange
}) {
  const selectStyles: Partial<SelectStyles> = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit'
      }
    })
  };

  return (
    <Select
      isMulti
      menuPosition="fixed"
      classes={classes}
      styles={selectStyles}
      inputId="react-select-multiple"
      TextFieldProps={{
        label,
        InputLabelProps: {
          htmlFor: 'react-select-multiple'
          // shrink: true
        }
      }}
      maxMenuHeight={220}
      options={options}
      components={materialComponents}
      placeholder=""
      value={selectedOptions}
      onChange={onSelectedOptionsChange}
      filterOption={createFilter(filterConfig)}
    />
  );
}

export default withStyles(styles, { withTheme: true })(SearchableSelect);
