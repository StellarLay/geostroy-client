export interface IObjectsProps {
  id: number;
  name: string;
}

export interface IPiezometersProps {
  id: number;
  name: string;
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
    width: 195,
    border: 0,
    boxShadow: 'none',
    cursor: 'pointer',
  }),
};
