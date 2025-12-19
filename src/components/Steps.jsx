import React, { useState, useEffect } from 'react';

function Steps() {

  const [trainings, setTrainings] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    distance: ''
  });

  useEffect(() => {
    const initialData = [
      { id: 1, date: '2019-07-20', dateDisplay: '20.07.2019', distance: 5.7 },
      { id: 2, date: '2019-07-19', dateDisplay: '19.07.2019', distance: 14.2 },
      { id: 3, date: '2019-07-18', dateDisplay: '18.07.2019', distance: 3.4 },
    ];
    setTrainings(initialData);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Валидация даты
  const isValidDate = (dateString) => {
    const regex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!regex.test(dateString)) return false;
    
    const parts = dateString.split('.');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    
    const date = new Date(year, month, day);
    return date.getDate() === day && 
           date.getMonth() === month && 
           date.getFullYear() === year;
  };

  // Преобразование даты в ISO формат для сортировки
  const parseDateToISO = (dateString) => {
    const parts = dateString.split('.');
    return new Date(parts[2], parts[1] - 1, parts[0]).toISOString().split('T')[0];
  };

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isValidDate(formData.date)) {
      alert('Введите дату в формате ДД.ММ.ГГГГ');
      return;
    }
    
    const distance = parseFloat(formData.distance);
    if (isNaN(distance) || distance <= 0) {
      alert('Введите корректное расстояние');
      return;
    }
    
    const dateISO = parseDateToISO(formData.date);
    
    // Проверяем, есть ли уже тренировка с такой датой
    const existingIndex = trainings.findIndex(t => t.date === dateISO);
    
    if (existingIndex !== -1) {
      // Обновляем существующую запись - суммируем расстояния
      const updatedTrainings = [...trainings];
      updatedTrainings[existingIndex] = {
        ...updatedTrainings[existingIndex],
        distance: updatedTrainings[existingIndex].distance + distance,
        dateDisplay: formData.date
      };
      
      // Сортируем по дате (от новых к старым)
      updatedTrainings.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTrainings(updatedTrainings);
    } else {
      // Добавляем новую запись
      const newTraining = {
        id: Date.now(),
        date: dateISO,
        dateDisplay: formData.date,
        distance: distance
      };
      
      const updatedTrainings = [...trainings, newTraining];
      // Сортируем по дате (от новых к старым)
      updatedTrainings.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTrainings(updatedTrainings);
    }
    
    // Очищаем форму
    setFormData({ date: '', distance: '' });
  };

  // Удаление тренировки
  const handleDelete = (id) => {
    setTrainings(prev => prev.filter(training => training.id !== id));
  };


  return (
    <div className="container">
      <div className="form-container">
        <form 
        id="trainingForm" 
        onSubmit={handleSubmit}
        >
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Дата (ДД.ММ.ГГ)</label>
              <input
                type="text"
                id="date"
                name="date"
                placeholder="20.07.2019"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="distance">Пройдено км</label>
              <input
                type="number"
                id="distance"
                name="distance"
                placeholder="5.7"
                step="0.1"
                min="0"
                value={formData.distance}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">OK</button>
          </div>
        </form>
      </div>

      <div className="data-table">
        <div className="table-header">
          <div className="col-date">Дата (ДД.ММ.ГГ)</div>
          <div className="col-distance">Пройдено км</div>
          <div className="col-actions">Действия</div>
        </div>

        <div className="table-body">
          {trainings.length === 0 ? (
            <div className="empty-state">Нет данных о тренировках</div>
          ) : (
            trainings.map(training => (
              <div className="table-row" key={training.id} data-date={training.date}>
                <div className="col-date">{training.dateDisplay}</div>
                <div className="col-distance">{training.distance.toFixed(1)}</div>
                <div className="col-actions">
                  <button 
                    className="action-btn delete-btn" 
                    title="Удалить"
                    onClick={() => handleDelete(training.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

}

export default Steps;