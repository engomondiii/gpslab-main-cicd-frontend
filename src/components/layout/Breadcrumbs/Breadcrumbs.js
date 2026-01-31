/**
 * GPS Lab Platform - Breadcrumbs Component
 * 
 * @module components/layout/Breadcrumbs/Breadcrumbs
 * @version 1.1.0
 * 
 * FIXED: Converted all <a href> to React Router <Link> components
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs = ({
  items = [],
  separator = 'chevron',
  showHome = true,
  maxItems = 4,
  className = '',
  ...props
}) => {
  
  // Add home if needed
  const allItems = showHome 
    ? [{ label: 'Home', href: '/', icon: 'home' }, ...items]
    : items;
  
  // Truncate if too many items
  const displayItems = allItems.length > maxItems
    ? [
        allItems[0],
        { label: '...', isEllipsis: true },
        ...allItems.slice(-2)
      ]
    : allItems;
  
  const renderSeparator = () => {
    if (separator === 'chevron') {
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="breadcrumbs__separator">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
        </svg>
      );
    }
    if (separator === 'slash') {
      return <span className="breadcrumbs__separator">/</span>;
    }
    return <span className="breadcrumbs__separator">{separator}</span>;
  };
  
  const renderIcon = (icon) => {
    if (icon === 'home') {
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="breadcrumbs__icon">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
        </svg>
      );
    }
    return null;
  };
  
  const classNames = ['breadcrumbs', className].filter(Boolean).join(' ');
  
  return (
    <nav className={classNames} aria-label="Breadcrumb" {...props}>
      <ol className="breadcrumbs__list">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.isEllipsis;
          
          return (
            <li key={item.href || index} className="breadcrumbs__item">
              {index > 0 && renderSeparator()}
              
              {isEllipsis ? (
                <span className="breadcrumbs__ellipsis">...</span>
              ) : isLast ? (
                <span className="breadcrumbs__current" aria-current="page">
                  {item.icon && renderIcon(item.icon)}
                  <span>{item.label}</span>
                </span>
              ) : (
                /* FIXED: Using Link instead of <a> */
                <Link to={item.href} className="breadcrumbs__link">
                  {item.icon && renderIcon(item.icon)}
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;