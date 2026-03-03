import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

function EditableElement({
  tag: Tag = 'div',
  contentKey,
  content,
  editMode,
  onUpdate,
  className = '',
  placeholder: _placeholder = 'Click to edit...',
  ...props
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(content[contentKey] || '');
  const [originalContent, setOriginalContent] = useState(''); // Store original content for comparison
  const elementRef = useRef(null);

  useEffect(() => {
    setLocalContent(content[contentKey] || '');
  }, [content, contentKey]);

  const handleClick = () => {
    if (editMode && !isEditing) {
      setOriginalContent(localContent); // Store the original content when editing starts
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
      if (newContent !== originalContent) {
        setLocalContent(newContent);
        onUpdate(contentKey, newContent);
      }
    }
  };

  const handleInput = () => {
    // Input events are handled but we don't need to do anything here
    // Content is captured on blur
  };

  const handleKeyDown = e => {
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

  const editableProps = editMode
    ? {
        contentEditable: isEditing,
        suppressContentEditableWarning: true,
        onBlur: handleBlur,
        onInput: handleInput,
        onKeyDown: handleKeyDown,
        ref: elementRef,
        title: isEditing ? 'Press Enter to save, Escape to cancel' : 'Click to edit this content'
      }
    : {};

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
