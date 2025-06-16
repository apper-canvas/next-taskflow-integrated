import React, { forwardRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
const TaskCard = forwardRef(({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  categories = [],
  className = '',
  isDragging = false,
  ...props
}, ref) => {
  // State for notes functionality
  const [notesExpanded, setNotesExpanded] = useState(false)
  const [notesContent, setNotesContent] = useState('')
  const [activeTab, setActiveTab] = useState('write')
  
  const category = categories.find(cat => cat.id === task.category)
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF6B6B'
      case 'medium': return '#FFD93D'
      case 'low': return '#51CF66'
      default: return '#94a3b8'
    }
  }

  const getDueDateDisplay = (dueDate) => {
    if (!dueDate) return null
    
    const date = new Date(dueDate)
    const now = new Date()
    
    if (isToday(date)) {
      return { text: 'Today', color: 'text-warning', urgent: true }
    } else if (isTomorrow(date)) {
      return { text: 'Tomorrow', color: 'text-info', urgent: false }
    } else if (isPast(date)) {
      return { text: 'Overdue', color: 'text-error', urgent: true }
    } else {
      return { text: format(date, 'MMM d'), color: 'text-surface-500', urgent: false }
    }
}

  const dueDateInfo = getDueDateDisplay(task.dueDate)

  // Markdown formatting functions
  const toggleBold = () => {
    const selection = window.getSelection().toString()
    if (selection) {
      setNotesContent(prev => prev.replace(selection, `**${selection}**`))
    } else {
      insertAtCursor('**bold text**')
    }
  }

  const toggleItalic = () => {
    const selection = window.getSelection().toString()
    if (selection) {
      setNotesContent(prev => prev.replace(selection, `*${selection}*`))
    } else {
      insertAtCursor('*italic text*')
    }
  }

  const toggleStrikethrough = () => {
    const selection = window.getSelection().toString()
    if (selection) {
      setNotesContent(prev => prev.replace(selection, `~~${selection}~~`))
    } else {
      insertAtCursor('~~strikethrough text~~')
    }
  }

  const toggleCode = () => {
    const selection = window.getSelection().toString()
    if (selection) {
      setNotesContent(prev => prev.replace(selection, `\`${selection}\``))
    } else {
      insertAtCursor('`code`')
    }
  }

  const addLink = () => {
    insertAtCursor('[link text](https://example.com)')
  }

  const addImage = () => {
    insertAtCursor('![alt text](image-url)')
  }

  const addList = () => {
    insertAtCursor('\n- List item\n- List item\n- List item')
  }

  const addOrderedList = () => {
    insertAtCursor('\n1. First item\n2. Second item\n3. Third item')
  }

  const addQuote = () => {
    insertAtCursor('\n> This is a quote')
  }

  const addHeading = () => {
    insertAtCursor('\n## Heading')
  }

  const insertAtCursor = (text) => {
    const textarea = document.querySelector(`#notes-textarea-${task.id}`)
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = notesContent.substring(0, start) + text + notesContent.substring(end)
      setNotesContent(newContent)
      
      // Restore cursor position after text insertion
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + text.length, start + text.length)
      }, 0)
    }
  }

return (
    <motion.div
    ref={ref}
    layout
    initial={{
        opacity: 0,
        y: 20
    }}
    animate={{
        opacity: 1,
        y: 0
    }}
    exit={{
        opacity: 0,
        x: -100
    }}
    whileHover={!isDragging ? {
        scale: 1.01,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
    } : {}}
    className={`
        bg-white rounded-lg border border-surface-200 p-4 
        transition-all duration-200 hover:border-surface-300
        ${task.completed ? "opacity-75" : ""}
        ${isDragging ? "opacity-50 rotate-3 shadow-lg z-50" : ""}
        ${className}
      `}
    {...props}>
    <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
            <Checkbox
                checked={task.completed}
                onChange={() => onToggleComplete(task.id, !task.completed)} />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <h3
                        className={`
                text-base font-medium break-words
                ${task.completed ? "line-through text-surface-500" : "text-surface-900"}
              `}>
                        {task.title}
                    </h3>
                    <div className="flex items-center space-x-3 mt-2">
                        {category && <Badge color={category.color} size="small">
                            {category.name}
                        </Badge>}
                        <div className="flex items-center space-x-1">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: getPriorityColor(task.priority)
                                }} />
                            <span className="text-xs text-surface-500 capitalize">
                                {task.priority}
                            </span>
                        </div>
                        {dueDateInfo && <div className={`flex items-center space-x-1 ${dueDateInfo.color}`}>
                            <ApperIcon
                                name={dueDateInfo.urgent ? "AlertCircle" : "Calendar"}
                                className="w-3 h-3" />
                            <span className="text-xs font-medium">
                                {dueDateInfo.text}
                            </span>
                        </div>}
                    </div>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                    <Button
                        variant="ghost"
                        size="small"
                        icon="GripVertical"
                        className="p-1.5 text-surface-400 hover:text-surface-600 cursor-grab active:cursor-grabbing"
                        title="Drag to reorder" />
                    <Button
                        variant="ghost"
                        size="small"
                        icon="Edit2"
                        onClick={() => onEdit(task)}
                        className="p-1.5" />
                    <Button
                        variant="ghost"
                        size="small"
                        icon="Trash2"
                        onClick={() => onDelete(task.id)}
                        className="p-1.5 text-error hover:text-error hover:bg-error/10" />
                </div>
            </div>
        </div>
    </div>
    {/* Notes Section */}
    <div className="mt-3 border-t border-surface-100">
        <div className="flex items-center justify-between pt-3">
            <Button
                variant="ghost"
                size="small"
                icon={notesExpanded ? "ChevronUp" : "ChevronDown"}
                onClick={() => setNotesExpanded(!notesExpanded)}
                className="text-surface-500 hover:text-surface-700 text-sm">Notes
                          </Button>
            {notesContent && <div className="text-xs text-surface-400">
                {notesContent.length}characters
                            </div>}
        </div>
        <AnimatePresence>
            {notesExpanded && <motion.div
                initial={{
                    opacity: 0,
                    height: 0
                }}
                animate={{
                    opacity: 1,
                    height: "auto"
                }}
                exit={{
                    opacity: 0,
                    height: 0
                }}
                transition={{
                    duration: 0.2
                }}
                className="mt-3 overflow-hidden">
                {/* Tab Navigation */}
                <div className="flex border-b border-surface-200 mb-3">
                    <button
                        onClick={() => setActiveTab("write")}
                        className={`px-3 py-1.5 text-sm font-medium border-b-2 ${activeTab === "write" ? "border-primary text-primary" : "border-transparent text-surface-500 hover:text-surface-700"}`}>Write
                                        </button>
                    <button
                        onClick={() => setActiveTab("preview")}
                        className={`px-3 py-1.5 text-sm font-medium border-b-2 ${activeTab === "preview" ? "border-primary text-primary" : "border-transparent text-surface-500 hover:text-surface-700"}`}>Preview
                                        </button>
                </div>
                {activeTab === "write" ? <div>
                    {/* Markdown Toolbar */}
                    <div className="flex flex-wrap gap-1 mb-2 p-2 bg-surface-50 rounded border">
                        <Button
                            variant="ghost"
                            size="small"
                            icon="Bold"
                            onClick={toggleBold}
                            className="p-1.5"
                            title="Bold" />
                        <Button
                            variant="ghost"
                            size="small"
                            icon="Italic"
                            onClick={toggleItalic}
                            className="p-1.5"
                            title="Italic" />
                        <Button
                            variant="ghost"
                            size="small"
                            icon="Strikethrough"
                            onClick={toggleStrikethrough}
                            className="p-1.5"
                            title="Strikethrough" />
                        <Button
                            variant="ghost"
                            size="small"
                            icon="Code"
                            onClick={toggleCode}
                            className="p-1.5"
                            title="Inline Code" />
                        <div className="w-px bg-surface-200 mx-1"></div>
                        <Button
                            variant="ghost"
                            size="small"
                            icon="Link"
                            onClick={addLink}
                            className="p-1.5"
                            title="Add Link" />
                        <Button
                            variant="ghost"
                            size="small"
                            icon="Image"
                            onClick={addImage}
                            className="p-1.5"
                            title="Add Image" />
                        <div className="w-px bg-surface-200 mx-1"></div>
                        <Button
                            variant="ghost"
                            size="small"
                            icon="List"
                            onClick={addList}
                            className="p-1.5"
                            title="Bullet List" />
                        <Button
                            variant="ghost"
                            size="small"
                            icon="ListOrdered"
                            onClick={addOrderedList}
                            className="p-1.5"
                            title="Numbered List" />
                        <Button
                            variant="ghost"
                            size="small"
                            icon="Quote"
                            onClick={addQuote}
                            className="p-1.5"
                            title="Quote" />
                        <Button
                            variant="ghost"
                            size="small"
                            icon="Heading"
                            onClick={addHeading}
                            className="p-1.5"
                            title="Heading" />
                    </div>
                    {/* Textarea */}
                    <textarea
                        id={`notes-textarea-${task.id}`}
                        value={notesContent}
                        onChange={e => setNotesContent(e.target.value)}
                        placeholder="Add notes or description using markdown formatting..."
                        className="w-full h-32 p-3 border border-surface-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" />
                </div> : <div
                    className="min-h-32 p-3 border border-surface-200 rounded-md bg-surface-50">
                    {notesContent ? <div className="prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {notesContent}
                        </ReactMarkdown>
                    </div> : <div
                        className="flex items-center justify-center h-24 text-surface-400 text-sm">No content to preview. Switch to Write tab to add notes.
                                            </div>}
                </div>}
            </motion.div>}
        </AnimatePresence>
    </div>
</motion.div>
  )
})

TaskCard.displayName = 'TaskCard'

export default TaskCard