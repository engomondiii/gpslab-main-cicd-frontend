/**
 * GPS Lab Platform - Pagination Component
 * 
 * Page navigation for lists and tables.
 * 
 * @module components/common/Pagination/Pagination
 * @version 1.0.0
 */

import React from 'react';
import './Pagination.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const PAGINATION_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg'
};

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Generate page numbers to display
 */
const getPageNumbers = (currentPage, totalPages, siblingCount = 1) => {
  const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
  const totalBlocks = totalNumbers + 2; // + 2 for ellipsis slots
  
  if (totalPages <= totalBlocks) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
  
  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;
  
  const pages = [];
  
  // Always show first page
  pages.push(1);
  
  // Left ellipsis
  if (showLeftEllipsis) {
    pages.push('ellipsis-left');
  } else if (leftSiblingIndex > 1) {
    for (let i = 2; i < leftSiblingIndex; i++) {
      pages.push(i);
    }
  }
  
  // Sibling pages and current
  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    if (i !== 1 && i !== totalPages) {
      pages.push(i);
    }
  }
  
  // Right ellipsis
  if (showRightEllipsis) {
    pages.push('ellipsis-right');
  } else if (rightSiblingIndex < totalPages) {
    for (let i = rightSiblingIndex + 1; i < totalPages; i++) {
      pages.push(i);
    }
  }
  
  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  
  return pages;
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Pagination component
 * 
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current page (1-indexed)
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Page change handler
 * @param {number} [props.siblingCount=1] - Pages to show on each side
 * @param {string} [props.size='md'] - Pagination size
 * @param {boolean} [props.showFirstLast=true] - Show first/last buttons
 * @param {boolean} [props.showPrevNext=true] - Show prev/next buttons
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.className] - Additional CSS classes
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  size = PAGINATION_SIZES.MD,
  showFirstLast = true,
  showPrevNext = true,
  disabled = false,
  className = '',
  ...props
}) => {
  
  if (totalPages <= 1) return null;
  
  const pages = getPageNumbers(currentPage, totalPages, siblingCount);
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !disabled) {
      onPageChange(page);
    }
  };
  
  const classNames = [
    'pagination',
    `pagination--${size}`,
    disabled && 'pagination--disabled',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <nav className={classNames} aria-label="Pagination" {...props}>
      <ul className="pagination__list">
        {/* First page button */}
        {showFirstLast && (
          <li>
            <button
              type="button"
              className="pagination__btn pagination__btn--nav"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1 || disabled}
              aria-label="Go to first page"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        )}
        
        {/* Previous button */}
        {showPrevNext && (
          <li>
            <button
              type="button"
              className="pagination__btn pagination__btn--nav"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || disabled}
              aria-label="Go to previous page"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        )}
        
        {/* Page numbers */}
        {pages.map((page, index) => {
          if (typeof page === 'string') {
            return (
              <li key={page}>
                <span className="pagination__ellipsis">…</span>
              </li>
            );
          }
          
          return (
            <li key={page}>
              <button
                type="button"
                className={`pagination__btn ${
                  page === currentPage ? 'pagination__btn--active' : ''
                }`}
                onClick={() => goToPage(page)}
                disabled={disabled}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            </li>
          );
        })}
        
        {/* Next button */}
        {showPrevNext && (
          <li>
            <button
              type="button"
              className="pagination__btn pagination__btn--nav"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || disabled}
              aria-label="Go to next page"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        )}
        
        {/* Last page button */}
        {showFirstLast && (
          <li>
            <button
              type="button"
              className="pagination__btn pagination__btn--nav"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages || disabled}
              aria-label="Go to last page"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default Pagination;