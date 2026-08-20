import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineChevronDown,
  HiOutlineX,
  HiOutlineAcademicCap,
} from 'react-icons/hi';
import { SIDEBAR_MENU } from '../constants/sidebarMenu';
import { APP_NAME } from '../constants';

export default function Sidebar({ collapsed, mobileOpen, closeMobile }) {
  const [expandedItems, setExpandedItems] = useState(['students']);

  const toggleExpand = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const sidebarWidth = collapsed ? 'w-18' : 'w-68';

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-60 lg:hidden"
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 272 }}
        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
        className={`fixed top-0 left-0 h-screen z-70 flex flex-col bg-white dark:bg-erp-dark-card border-r border-erp-border dark:border-erp-dark-border shadow-sidebar
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 lg:transition-none
        `}
        style={{ width: collapsed ? 72 : 272 }}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-erp-border dark:border-erp-dark-border min-h-[64px] flex-shrink-0`}>
          <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-btn">
            <HiOutlineAcademicCap className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="font-heading font-bold text-erp-heading dark:text-erp-dark-heading text-base leading-tight whitespace-nowrap">
                  {APP_NAME}
                </p>
                <p className="text-caption text-erp-muted dark:text-erp-dark-text whitespace-nowrap">
                  School Management
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Mobile close */}
          {mobileOpen && (
            <button
              onClick={closeMobile}
              className="ml-auto lg:hidden w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <HiOutlineX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-0.5">
          {SIDEBAR_MENU.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              collapsed={collapsed}
              expanded={expandedItems.includes(item.id)}
              onToggle={() => toggleExpand(item.id)}
              closeMobile={closeMobile}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 px-3 py-4 border-t border-erp-border dark:border-erp-dark-border">
          <div className={`flex items-center gap-3 px-3 py-2.5 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm font-semibold text-erp-heading dark:text-erp-dark-heading whitespace-nowrap leading-tight">
                    Admin User
                  </p>
                  <p className="text-caption text-erp-muted dark:text-erp-dark-text whitespace-nowrap">
                    Administrator
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

function SidebarItem({ item, collapsed, expanded, onToggle, closeMobile }) {
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  if (hasChildren && !collapsed) {
    return (
      <div>
        <button
          onClick={onToggle}
          className="sidebar-item sidebar-item-inactive w-full"
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <HiOutlineChevronDown className="w-4 h-4 opacity-60" />
          </motion.span>
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-4 mt-0.5 pl-4 border-l-2 border-gray-100 dark:border-gray-700 space-y-0.5 py-0.5">
                {item.children.map((child) => (
                  <NavLink
                    key={child.id}
                    to={child.path}
                    end={child.path === item.path}
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `sidebar-item text-xs ${isActive ? 'text-primary font-semibold' : 'sidebar-item-inactive'}`
                    }
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 flex-shrink-0" />
                    {child.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (collapsed) {
    return (
      <NavLink
        to={item.path}
        end
        onClick={closeMobile}
        title={item.label}
        className={({ isActive }) =>
          `flex items-center justify-center w-full p-2.5 rounded-xl transition-all duration-200 ${
            isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
          }`
        }
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
      </NavLink>
    );
  }

  return (
    <NavLink
      to={item.path}
      end
      onClick={closeMobile}
      className={({ isActive }) =>
        `sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`
      }
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1">{item.label}</span>
    </NavLink>
  );
}
