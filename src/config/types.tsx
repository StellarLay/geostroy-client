export interface IObjectsProps {
  id: number;
  name: string;
}

export interface IPiezometersProps {
  id: number;
  name: string;
}

export interface ICreatePiezometersProps {
  name: string;
  user_id: number;
}

export interface ISensorsProps {
  id: number;
  name: string;
}

export interface IPiezoDataProps {
  id: number;
  piezometer_id: number;
  sensor_id: number;
  sensor_name: string;
}

export interface IUsersProps {
  id: number;
  FIO: string;
  email: string;
  access_lvl: number;
  access_name: string;
}

export interface IPermissionsProps {
  id: number;
  email: string;
  object_id: number;
  object_name: string;
  piezo_id: number;
  piezo_name: string;
}

export interface IOpsProps {
  id: number;
  object_id: number;
  piezometer_id: number;
  sensor_id: number;
  name: string;
}

export interface IChangeUserProps {
  user_id: number;
  FIO: string;
  email: string;
  access_lvl: number;
  access_name: string;
  password: string;
}

export interface IObjectsDataProps {
  user_id: number;
  items: number[];
}

export interface ITableData {
  id: number;
  sensor_id: number;
  piezometer_id: number;
  error_code: number;
  battery_voltage: number;
  battery_charge: number;
  sensor_name: string;
  lvl_m: number;
  lvl_m_corr: number;
  device_time: string;
  message_arr_time: Date;
}

export interface ISelectOptionsProps {
  id: number;
  value: string;
  label: string;
}

export interface IDataAddModal {
  piezo_id: number;
  sensor_id: number;
  is_open: boolean;
}

export interface ISensorsData {
  sensor_id: number;
  piezometer_id: number;
  adc_lvl: number | null;
  lvl_m: number | null;
  lvl_m_corr: number | null;
  battery_voltage: number | null;
  battery_charge: number | null;
  error_code: number | null;
  device_time: string;
  message_arr_time: string;
  working_mode: number | null;
  sleep_time: string;
}

// Стили для React-Select
export const customStylesSelect = {
  option: (provided: any, state: any) => ({
    ...provided,
    padding: 12,
    width: '100%',
    color: state.isFocused ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)',
    backgroundColor: state.isFocused ? '#3f5888' : null,
  }),
  control: (base: any) => ({
    ...base,
    width: '100%',
    border: '2px solid #3f58882d;',
    boxShadow: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    minHeight: '48px',
    height: '45px',
  }),
  valueContainer: (provided: any, state: any) => ({
    ...provided,
    height: '40px',
    padding: '0 8px',
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    margin: '0',
    padding: '0',
  }),
  indicatorsContainer: (provided: any, state: any) => ({
    ...provided,
    height: '40px',
  }),
};

// React filter select styles
export const customStylesSelectFilter = {
  option: (provided: any, state: any) => ({
    ...provided,
    padding: 12,
    width: '100%',
    color: state.isFocused ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)',
    backgroundColor: state.isFocused ? '#3f5888' : null,
  }),
  control: (base: any) => ({
    ...base,
    width: 150,
    border: '2px solid #3f58882d;',
    borderRadius: '8px',
    minHeight: '44px',
    height: '40px',
    boxShadow: 'none',
    cursor: 'pointer',
  }),
  valueContainer: (provided: any, state: any) => ({
    ...provided,
    height: '40px',
    padding: '0 8px',
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    margin: '0',
    padding: '0',
  }),
  indicatorsContainer: (provided: any, state: any) => ({
    ...provided,
    height: '40px',
  }),
};

// Стили для react multi select

export const customStylesMultiSelect = {
  option: (provided: any, state: any) => ({
    ...provided,
    padding: 12,
    width: '100%',
    color: state.isFocused ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)',
    backgroundColor: state.isFocused ? '#3f5888' : null,
  }),
  control: (base: any) => ({
    ...base,
    width: '100%',
    border: '2px solid #3f58882d;',
    boxShadow: 'none',
    cursor: 'pointer',
    minHeight: '45px',
    padding: '5px 0',
  }),
  valueContainer: (provided: any, state: any) => ({
    ...provided,
    minHeight: '45px',
    padding: '0 8px',
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    margin: '0',
    padding: '0',
  }),
  indicatorsContainer: (provided: any, state: any) => ({
    ...provided,
    minHeight: '45px',
  }),
  multiValue: (provided: any, state: any) => ({
    ...provided,
    margin: '0 3px',
    backgroundColor: '#35538e',
    borderRadius: '3px',
  }),
  multiValueLabel: (provided: any, state: any) => ({
    ...provided,
    width: '100%',
    padding: '8px',
    color: '#fffffff0',
  }),
  multiValueRemove: (provided: any, state: any) => ({
    ...provided,
    fill: '#fffffff0',
    transition: '.1s linear',
    ':hover': { background: '#c73d3d' },
  }),
};

// Стили для select на странице /settings/
export const customStylSelectSettingsUser = {
  option: (provided: any, state: any) => ({
    ...provided,
    padding: 12,
    width: '260px',
    color: state.isFocused ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)',
    backgroundColor: state.isFocused ? '#3f5888' : null,
  }),
  control: (base: any) => ({
    ...base,
    width: '260px',
    border: '2px solid #3f58882d;',
    boxShadow: 'none',
    cursor: 'pointer',
    minHeight: '40px',
    padding: '0',
  }),
  valueContainer: (provided: any, state: any) => ({
    ...provided,
    minHeight: '40px',
    padding: '0 8px',
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    margin: '0',
    padding: '0',
  }),
  indicatorsContainer: (provided: any, state: any) => ({
    ...provided,
    minHeight: '40px',
  }),
};
