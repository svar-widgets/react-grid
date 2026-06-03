import { useEffect, useMemo, useRef, useState } from 'react';
import { SuggestDropdown } from '@svar-ui/react-core';
import { useWritableProp } from '@svar-ui/lib-react';
import './MultiSelect.css';

export default function MultiSelect(props) {
  const {
    value: valueProp,
    options = [],
    placeholder = '',
    clear = false,
    text = null,
    template = null,
    cell = null,
    dropdown = {},
    autoOpen = false,
    onChange,
    onAction,
  } = props;

  const [value, setValue] = useWritableProp(valueProp || []);

  const selected = useMemo(
    () =>
      (value || [])
        .map((id) => options.find((o) => o.id === id))
        .filter(Boolean),
    [value, options],
  );

  const node = useRef(null);
  const navigateRef = useRef(null);
  const [keydown, setKeydown] = useState(null);

  const index = () => {
    const v = value || [];
    if (!v.length) return 0;
    const firstSelected = options.find((o) => v.includes(o.id));
    return firstSelected ? options.indexOf(firstSelected) : 0;
  };

  function ready(ev) {
    navigateRef.current = ev.navigate;
    setKeydown(() => ev.keydown);
    if (autoOpen) ev.navigate(index());
  }

  useEffect(() => {
    if (autoOpen) {
      node.current?.focus();
      if (typeof window !== 'undefined' && window.getSelection) {
        window.getSelection().removeAllRanges();
      }
    }
  }, []);

  function select({ id }) {
    setValue(id);
    onChange && onChange({ value: id });
  }

  function unselect(ev) {
    ev.stopPropagation();
    setValue([]);
    onChange && onChange({ value: [] });
  }

  function handleClick() {
    navigateRef.current?.(index());
  }

  function handleCancel() {
    navigateRef.current?.(null);
  }

  function handleKeyDown(ev) {
    keydown?.(ev, index());
  }

  return (
    <div
      ref={node}
      className="wx-multiselect wx-aadNNOwy"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="wx-label wx-aadNNOwy">
        {template ? (
          template(selected)
        ) : cell ? (
          (() => {
            const CellComponent = cell;
            return <CellComponent data={selected} onAction={onAction} />;
          })()
        ) : text ? (
          <span className="wx-text wx-aadNNOwy">{text}</span>
        ) : selected.length ? (
          <span className="wx-text wx-aadNNOwy">
            {selected.map((s) => s.label).join(', ')}
          </span>
        ) : placeholder ? (
          <span className="wx-placeholder wx-aadNNOwy">{placeholder}</span>
        ) : (
          ' '
        )}
      </div>

      {clear && value?.length ? (
        <i
          className="wx-icon wxi-close wx-aadNNOwy"
          onClick={unselect}
        ></i>
      ) : (
        <i className="wx-icon wxi-angle-down wx-aadNNOwy"></i>
      )}

      <SuggestDropdown
        items={options}
        onReady={ready}
        onSelect={select}
        multiselect={true}
        checkboxes={true}
        value={value || []}
        onCancel={handleCancel}
        {...dropdown}
      >
        {({ option }) => (
          <div className="wx-option wx-aadNNOwy">
            {template ? (
              template(option)
            ) : cell ? (
              (() => {
                const CellComponent = cell;
                return <CellComponent data={option} onAction={onAction} />;
              })()
            ) : (
              option.label
            )}
          </div>
        )}
      </SuggestDropdown>
    </div>
  );
}
