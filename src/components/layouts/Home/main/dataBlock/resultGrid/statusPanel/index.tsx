import React from 'react';

const StatusPanel = (props: any) => {
  // Деструктуризация пропсов
  const { sensorData } = props;

  return (
    <div className='status-panel'>
      {sensorData.length > 0 ? (
        <React.Fragment>
          <div className='status-panel__item'>
            <span>Код ошибки: {sensorData[0].error_code}</span>
          </div>
          <div className='status-panel__item'>
            <span>
              Напряжение на аккумуляторе: {sensorData[0].battery_voltage}
            </span>
          </div>
          <div className='status-panel__item'>
            <span>Заряд аккумулятора: {sensorData[0].battery_charge}%</span>
          </div>
        </React.Fragment>
      ) : (
        <div className='status-panel__item'>
          <span>Данный датчик не имеет ни одного показания</span>
        </div>
      )}
    </div>
  );
};

export default StatusPanel;
