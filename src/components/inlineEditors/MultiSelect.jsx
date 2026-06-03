import { useEffect, useMemo, useRef } from 'react';
import { clickOutside } from '@svar-ui/lib-dom';
import MultiSelect from '../MultiSelect.jsx';
import './MultiSelect.css';

export default function MultiSelectEditor(props) {
  const { editor, onAction, onSave, onApply } = props;

  const config = editor?.config || {};
  const options = editor?.options ?? [];
  const value = editor?.value || [];
  const text = editor?.renderedValue;

  const dropdownOptions = useMemo(
    () => ({
      trackScroll: true,
      ...(config.dropdown || {}),
    }),
    [config],
  );

  function updateValue({ value }) {
    onApply(value);
  }

  const node = useRef(null);

  useEffect(() => {
    if (!node.current) return;
    const cleanup = clickOutside(node.current, () => onSave(true));
    return () => cleanup.destroy();
  }, [onSave]);

  return (
    <div
      ref={node}
      className="wx-value wx-aacZ4gNU"
      onClick={() => onSave(true)}
    >
      <MultiSelect
        value={value}
        options={options}
        text={text}
        template={config.template}
        cell={config.cell}
        clear={config.clear}
        dropdown={dropdownOptions}
        autoOpen
        onChange={updateValue}
        onAction={onAction}
      />
    </div>
  );
}
