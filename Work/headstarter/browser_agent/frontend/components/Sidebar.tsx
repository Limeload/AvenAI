'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface Tab {
  id: string
  label: string
  icon: LucideIcon
}

interface SidebarProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function Sidebar({ tabs, activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-tech-gray border-r border-tech-accent/30 p-4">
      <div className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <motion.button
              key={tab.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-tech-accent/20 text-tech-accent border border-tech-accent/30 glow-green'
                  : 'text-gray-300 hover:text-white hover:bg-tech-light-gray/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
              
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute right-2 w-2 h-2 bg-tech-accent rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* System Status */}
      <div className="mt-8 p-4 bg-tech-dark/50 rounded-lg border border-tech-accent/20">
        <h3 className="text-sm font-semibold text-tech-accent mb-3 font-mono">SYSTEM STATUS</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">Voice Service</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-tech-accent rounded-full animate-pulse" />
              <span className="text-tech-accent font-mono">ONLINE</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">Browser Engine</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-tech-accent rounded-full animate-pulse" />
              <span className="text-tech-accent font-mono">READY</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">AI Parser</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-tech-accent rounded-full animate-pulse" />
              <span className="text-tech-accent font-mono">ACTIVE</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">Monitoring</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-tech-accent rounded-full animate-pulse" />
              <span className="text-tech-accent font-mono">RECORDING</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 p-4 bg-tech-dark/50 rounded-lg border border-tech-accent/20">
        <h3 className="text-sm font-semibold text-tech-accent mb-3 font-mono">QUICK ACTIONS</h3>
        
        <div className="space-y-2">
          <button className="w-full text-left text-xs text-gray-300 hover:text-tech-accent transition-colors">
            • Take Screenshot
          </button>
          <button className="w-full text-left text-xs text-gray-300 hover:text-tech-accent transition-colors">
            • Clear Browser Cache
          </button>
          <button className="w-full text-left text-xs text-gray-300 hover:text-tech-accent transition-colors">
            • Reset Session
          </button>
          <button className="w-full text-left text-xs text-gray-300 hover:text-tech-accent transition-colors">
            • View Logs
          </button>
        </div>
      </div>
    </aside>
  )
}
