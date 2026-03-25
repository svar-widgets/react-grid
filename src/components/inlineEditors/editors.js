import Text from './Text.jsx';
import Combo from './Combo.jsx';
import Datepicker from './Datepicker.jsx';
import Richselect from './Richselect.jsx';
import Multiselect from './MultiSelect.jsx';

export const editors = {
  text: Text,
  combo: Combo,
  datepicker: Datepicker,
  richselect: Richselect,
  multiselect: Multiselect,
};

export function registerInlineEditor(type, component) {
  editors[type] = component;
}
