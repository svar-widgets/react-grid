import { useEffect, useRef, useState } from 'react';
import { clickOutside } from '@svar-ui/lib-dom';
import './Text.css';

function Text(props) {
  const { editor, onSave, onApply } = props;

  const [value, setValue] = useState(editor?.value || '');

  const node = useRef(null);
  useEffect(() => {
    if (node.current) node.current.focus();
  }, []);

  useEffect(() => {
    if (!node.current) return;
    const cleanup = clickOutside(node.current, () => onSave(true));
    return () => cleanup.destroy();
  }, [onSave]);

  function updateValue() {
    if (!node.current) return;
    setValue(node.current.value);
    onApply(node.current.value);
  }

  function closeAndSave({ key }) {
    if (key === 'Enter') onSave();
  }

  return (
    <input
      className="wx-e7Ao5ejY wx-text"
      onInput={updateValue}
      onKeyDown={closeAndSave}
      ref={node}
      type="text"
      value={value}
    />
  );
}

export default Text;
