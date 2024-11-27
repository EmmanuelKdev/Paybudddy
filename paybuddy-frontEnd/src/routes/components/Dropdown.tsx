import React, { useEffect, useRef } from 'react';
import './ComponentCss.css';

interface DropdownProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ title, isOpen, onClose, children }) => {
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ul className='dropdown' ref={dropdownRef}>
      <div className='top'>
        <h4>{title}</h4>
        <p onClick={onClose}>X</p>
      </div>
      <div className='dropdown-content'>
        {children}
      </div>
    </ul>
  );
};

export default Dropdown;