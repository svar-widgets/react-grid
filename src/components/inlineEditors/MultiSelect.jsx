import { useEffect, useRef, useState } from 'react';
import { SuggestDropdown } from '@svar-ui/react-core';
import { clickOutside } from '@svar-ui/lib-dom';
import './MultiSelect.css';

export default function MultiSelect(props) {
  const { editor, onAction, onApply, onCancel, onSave } = props;

  const config = editor?.config || {};

  const [options] = useState(editor?.options ?? []);
  const [value, setValue] = useState(editor?.value || []);
  const [renderedValue, setRenderedValue] = useState(editor?.renderedValue);

  const firstSelected = options.find(opt => value.includes(opt.id));
  const index = firstSelected ? options.indexOf(firstSelected) : -1;

  const node = useRef(null);

  function updateValue({ id }) {
    //[FIXME] temp change until editor mutation is fixed in store
    setValue(id);
    setRenderedValue(
      id.map(v => options.find(opt => opt.id === v)?.label).join(','),
    );
    onApply(id);
    if (node.current) node.current.focus();
  }

  let navigate;
  const [keydown, setKeydown] = useState();

  function ready(ev) {
    navigate = ev.navigate;
    setKeydown(() => ev.keydown);
    navigate(index);
  }
  useEffect(() => {
    if (node.current) {
      node.current.focus();
    }
    if (typeof window !== 'undefined' && window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  }, []);

  useEffect(() => {
    if (!node.current) return;
    const cleanup = clickOutside(node.current, () => onSave(true));
    return () => cleanup.destroy();
  }, [onSave]);

  return (
    <>
      <div
        ref={node}
        className="wx-value wx-aacZ4gNU"
        tabIndex={0}
        onClick={onCancel}
        onKeyDown={(ev) => {
          keydown(ev, index);
          ev.preventDefault();
        }}
      >
        {config.template ? (
          config.template(value?.map(id => options.find(opt => opt.id === id)))
        ) : config.cell ? (
          (() => {
            const Component = config.cell;
            return (
              <Component
                data={value.map(id => options.find(opt => opt.id === id))}
              />
            );
          })()
        ) : (
          <span className="wx-text wx-aacZ4gNU">{renderedValue}</span>
        )}
      </div>
      <SuggestDropdown
        items={options}
        onReady={ready}
        onSelect={updateValue}
        checkboxes={true}
        multiselect={true}
        value={value}
      >
        {({ option }) => (
          <div className="wx-option wx-aacZ4gNU">
            {config.template ? (
              config.template(option)
            ) : config.cell ? (
              (() => {
                const Component = config.cell;
                return <Component data={option} onAction={onAction} />;
              })()
            ) : (
              option.label
            )}
          </div>
        )}
      </SuggestDropdown>
    </>
  );
}
