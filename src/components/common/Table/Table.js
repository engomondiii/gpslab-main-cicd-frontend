/**
 * GPS Lab Platform - Table Component
 * 
 * Data table with sorting, selection, and responsive features.
 * 
 * @module components/common/Table/Table
 * @version 1.0.0
 */

import React, { createContext, useContext, useState } from 'react';
import './Table.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const TABLE_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg'
};

export const TABLE_VARIANTS = {
  DEFAULT: 'default',
  STRIPED: 'striped',
  BORDERED: 'bordered'
};

// =============================================================================
// CONTEXT
// =============================================================================

const TableContext = createContext(null);

const useTableContext = () => useContext(TableContext);

// =============================================================================
// TABLE COMPONENT
// =============================================================================

/**
 * Table component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size='md'] - Table size
 * @param {string} [props.variant='default'] - Table variant
 * @param {boolean} [props.hoverable=false] - Row hover effect
 * @param {boolean} [props.stickyHeader=false] - Sticky header
 * @param {boolean} [props.selectable=false] - Selectable rows
 * @param {Array} [props.selectedRows=[]] - Selected row ids
 * @param {Function} [props.onSelectionChange] - Selection change handler
 * @param {string} [props.className] - Additional CSS classes
 */
const Table = ({
  size = TABLE_SIZES.MD,
  variant = TABLE_VARIANTS.DEFAULT,
  hoverable = false,
  stickyHeader = false,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  className = '',
  children,
  ...props
}) => {
  
  const contextValue = {
    size,
    variant,
    hoverable,
    selectable,
    selectedRows,
    onSelectionChange
  };
  
  const classNames = [
    'table-wrapper',
    stickyHeader && 'table-wrapper--sticky-header',
    className
  ].filter(Boolean).join(' ');
  
  const tableClassNames = [
    'table',
    `table--${size}`,
    `table--${variant}`,
    hoverable && 'table--hoverable'
  ].filter(Boolean).join(' ');
  
  return (
    <TableContext.Provider value={contextValue}>
      <div className={classNames}>
        <table className={tableClassNames} {...props}>
          {children}
        </table>
      </div>
    </TableContext.Provider>
  );
};

// =============================================================================
// TABLE HEAD
// =============================================================================

/**
 * TableHead component
 */
export const TableHead = ({ className = '', children, ...props }) => (
  <thead className={`table__head ${className}`} {...props}>
    {children}
  </thead>
);

// =============================================================================
// TABLE BODY
// =============================================================================

/**
 * TableBody component
 */
export const TableBody = ({ className = '', children, ...props }) => (
  <tbody className={`table__body ${className}`} {...props}>
    {children}
  </tbody>
);

// =============================================================================
// TABLE ROW
// =============================================================================

/**
 * TableRow component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.id] - Row id for selection
 * @param {boolean} [props.selected] - Selected state (override)
 * @param {Function} [props.onClick] - Click handler
 */
export const TableRow = ({ 
  id,
  selected: selectedOverride,
  onClick,
  className = '', 
  children, 
  ...props 
}) => {
  const context = useTableContext();
  
  const isSelected = selectedOverride !== undefined 
    ? selectedOverride 
    : (context?.selectedRows?.includes(id) || false);
  
  const handleClick = (e) => {
    onClick?.(e);
    
    if (context?.selectable && id && context?.onSelectionChange) {
      const newSelection = isSelected
        ? context.selectedRows.filter(rowId => rowId !== id)
        : [...context.selectedRows, id];
      context.onSelectionChange(newSelection);
    }
  };
  
  const classNames = [
    'table__row',
    isSelected && 'table__row--selected',
    context?.selectable && 'table__row--selectable',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <tr 
      className={classNames} 
      onClick={context?.selectable ? handleClick : onClick}
      aria-selected={context?.selectable ? isSelected : undefined}
      {...props}
    >
      {children}
    </tr>
  );
};

// =============================================================================
// TABLE HEADER CELL
// =============================================================================

/**
 * TableHeader component - header cell (th)
 * 
 * @param {Object} props - Component props
 * @param {boolean} [props.sortable=false] - Sortable column
 * @param {string} [props.sortDirection] - Current sort direction
 * @param {Function} [props.onSort] - Sort handler
 * @param {string} [props.align='left'] - Text alignment
 */
export const TableHeader = ({
  sortable = false,
  sortDirection,
  onSort,
  align = 'left',
  className = '',
  children,
  ...props
}) => {
  
  const handleClick = () => {
    if (sortable && onSort) {
      const nextDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(nextDirection);
    }
  };
  
  const classNames = [
    'table__header',
    `table__header--${align}`,
    sortable && 'table__header--sortable',
    sortDirection && `table__header--sorted-${sortDirection}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <th 
      className={classNames}
      onClick={sortable ? handleClick : undefined}
      aria-sort={sortDirection ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
      {...props}
    >
      <div className="table__header-content">
        <span>{children}</span>
        {sortable && (
          <span className="table__sort-icon">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </span>
        )}
      </div>
    </th>
  );
};

// =============================================================================
// TABLE CELL
// =============================================================================

/**
 * TableCell component - data cell (td)
 * 
 * @param {Object} props - Component props
 * @param {string} [props.align='left'] - Text alignment
 * @param {boolean} [props.truncate=false] - Truncate overflow
 */
export const TableCell = ({
  align = 'left',
  truncate = false,
  className = '',
  children,
  ...props
}) => {
  
  const classNames = [
    'table__cell',
    `table__cell--${align}`,
    truncate && 'table__cell--truncate',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <td className={classNames} {...props}>
      {children}
    </td>
  );
};

// =============================================================================
// TABLE FOOTER
// =============================================================================

/**
 * TableFooter component
 */
export const TableFooter = ({ className = '', children, ...props }) => (
  <tfoot className={`table__footer ${className}`} {...props}>
    {children}
  </tfoot>
);

// =============================================================================
// EXPORTS
// =============================================================================

export default Table;