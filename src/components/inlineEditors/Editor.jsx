import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import storeContext from '../../context';
import { useStore } from '@svar-ui/lib-react';
import { getStyle } from '../../helpers/columnWidth';
import { editors } from './editors';
import './Editor.css';

export default function Editor({ column, row }) {
  const api = useContext(storeContext);
  const editor = useStore(api, 'editor');

  const closeEditor = useCallback(
    (ignore, cell) => {
      api.exec('close-editor', { ignore });
      if (cell) {
        setTimeout(() => {
          api.exec('focus-cell', {
            ...cell,
            eventSource: 'click',
          });
        });
      }
    },
    [api],
  );

  const save = useCallback(
    (ignoreFocus) => {
      const cell = ignoreFocus
        ? null
        : { row: editor?.id, column: editor?.column };
      closeEditor(false, cell);
    },
    [editor, closeEditor],
  );

  const cancel = useCallback(() => {
    closeEditor(true, { row: editor?.id, column: editor?.column });
  }, [editor, closeEditor]);

  const updateValue = useCallback(
    (value) => {
      api.exec('editor', { value });
    },
    [api],
  );

  const keyHandler = useCallback(
    (ev) => {
      if (ev.key === 'Enter' && editor) {
        if (column.editor.type === 'multiselect') {
          updateValue(editor.value);
        } else {
          cancel();
        }
      }
    },
    [editor, column.editor, cancel, updateValue],
  );

  const computedStyle = useMemo(
    () =>
      getStyle(
        column.width,
        column.flexgrow,
        column.fixed,
        column.left,
        column.right,
      ),
    [column.width, column.flexgrow, column.fixed, column.left, column.right],
  );

  const Component = useMemo(() => {
    let ed = column.editor;
    if (typeof ed === 'function') ed = ed(row, column);
    if (!ed) return null;
    let type = typeof ed === 'string' ? ed : ed.type;
    return editors[type];
  }, [column, row]);

  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;
    if (typeof computedStyle === 'string') {
      rootRef.current.setAttribute('style', computedStyle);
    }
  }, [computedStyle]);

  const role = typeof row.$parent !== 'undefined' ? 'gridcell' : 'cell';
  const ariaReadonly =
    typeof row.$parent !== 'undefined'
      ? column.editor
        ? false
        : true
      : undefined;

  return (
    <div
      className="wx-8l724t2g wx-cell wx-editor"
      ref={rootRef}
      style={
        typeof computedStyle === 'object' && computedStyle !== null
          ? computedStyle
          : undefined
      }
      role={role}
      aria-readonly={ariaReadonly}
      tabIndex={-1}
      onClick={(ev) => ev.stopPropagation()}
      onDoubleClick={(ev) => ev.stopPropagation()}
      onKeyDown={keyHandler}
    >
      {Component ? (
        <Component
          editor={editor}
          onSave={save}
          onApply={updateValue}
          onCancel={cancel}
          onAction={({ action, data }) => api.exec(action, data)}
        />
      ) : null}
    </div>
  );
}
