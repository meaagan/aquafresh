import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

function EditableElement({ 
  tag: Tag = 'div', 
  contentKey, 
  content, 
  editMode, 
  onUpdate, 
  className = '', 
  placeholder = 'Click to edit...',
  ...props 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(content[contentKey] || '');
  const elementRef = useRef(null);

  useEffect(() => {
    setLocalContent(content[contentKey] || '');
  }, [content, contentKey]);

  const handleClick = () => {
    if (editMode && !isEditing) {
      setIsEditing(true);
      // Set the innerHTML after making it editable
      setTimeout(() => {
        if (elementRef.current) {
          elementRef.current.innerHTML = localContent;
          elementRef.current.focus();
        }
      }, 0);
      toast.success(`Editing: ${contentKey.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      setIsEditing(false);
      const newContent = elementRef.current.innerHTML;
      if (newContent !== localContent) {
        setLocalContent(newContent);
        onUpdate(contentKey, newContent);
      }
    }
  };

  const handleInput = () => {
    if (isEditing && elementRef.current) {
      const newContent = elementRef.current.innerHTML;
      setLocalContent(newContent);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      elementRef.current.blur();
    }
    if (e.key === 'Escape') {
      // Restore original content
      elementRef.current.innerHTML = localContent;
      elementRef.current.blur();
    }
  };

  const editableProps = editMode ? {
    contentEditable: isEditing,
    suppressContentEditableWarning: true,
    onBlur: handleBlur,
    onInput: handleInput,
    onKeyDown: handleKeyDown,
    ref: elementRef,
    title: isEditing ? 'Press Enter to save, Escape to cancel' : 'Click to edit this content'
  } : {};

  const combinedClassName = `
    ${className} 
    ${editMode ? 'editable-element' : ''} 
    ${editMode && isEditing ? 'edit-mode' : ''}
  `.trim();

  return (
    <Tag
      className={combinedClassName}
      onClick={handleClick}
      {...editableProps}
      {...props}
      {...(!isEditing ? { dangerouslySetInnerHTML: { __html: localContent } } : {})}
    >
      {isEditing ? '' : null}
    </Tag>
  );
}

export default EditableElement; 