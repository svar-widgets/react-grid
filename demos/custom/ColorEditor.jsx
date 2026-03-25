import { useEffect, useRef, useState } from 'react';
import { ColorBoard, Dropdown } from '@svar-ui/react-core';
import { clickOutside } from '@svar-ui/lib-dom';
import './ColorEditor.css';

export default function ColorEditor(props) {
  const { editor } = props;
  const onSave = props.onSave ?? props.onsave;
  const onApply = props.onApply ?? props.onapply;
  const onCancel = props.onCancel ?? props.oncancel;

  const [value] = useState(editor.value);

  function updateValue({ value, input }) {
    if (input) onApply(value);
    else onSave();
  }

  const node = useRef(null);
  useEffect(() => {
    if (node.current) {
      node.current.focus();
    }
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  }, []);

  const [colorContainer, setColorContainer] = useState(null);
  useEffect(() => {
    if (!colorContainer) return;
    const cleanup = clickOutside(colorContainer, () => onSave(true));
    return () => cleanup.destroy();
  }, [colorContainer, onSave]);

  return (
    <>
      <div
        className="value wx-S0xvhpVL"
        ref={node}
        tabIndex={0}
        onClick={onCancel}
      >
        {value}
      </div>
      <Dropdown inline width={'auto'}>
        <div ref={setColorContainer}>
          <ColorBoard value={value} onChange={updateValue} button={true} />
        </div>
      </Dropdown>
    </>
  );
}
