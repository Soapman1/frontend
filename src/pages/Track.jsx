import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://car-status-backend.onrender.com';

// Нормализация номера
const normalizePlate = (plate) => {
  if (!plate) return '';
  return plate.toString()
    .toUpperCase()
    .replace(/\s/g, '')
    .replace(/-/g, '')
    .replace(/[^A-Z0-9А-Я]/g, '');
};

function Track() {
  const [searchPlate, setSearchPlate] = useState('');
  const [trackingCars, setTrackingCars] = useState([]);

  const findCar = async () => {
    if (!searchPlate.trim()) return;

    try {
      const normalized = normalizePlate(searchPlate);
      const res = await axios.get(
        `${API_URL}/api/public/car-status?plate=${normalized}`
      );

      // ✅ Проверка ответа
      if (!res.data || !res.data.plate_number) {
        return alert('Некорректный ответ сервера');
      }

      const exists = trackingCars.some(
        car => car.plate_number === res.data.plate_number
      );

      if (!exists) {
        setTrackingCars(prev => [...prev, res.data]);
      } else {
        alert('Это авто уже в списке');
      }

      setSearchPlate('');
    } catch {
      alert('Авто не найдено');
    }
  };

  // 🔁 автообновление статуса с защитой от ошибок
  useEffect(() => {
    if (trackingCars.length === 0) return;

    const interval = setInterval(async () => {
      console.log('Обновление статусов...', trackingCars);
      
      try {
        const updated = await Promise.all(
          trackingCars.map(async car => {
            // ✅ Проверка если plate_number null/undefined
            if (!car || !car.plate_number) {
              console.warn('Пропуск авто без номера:', car);
              return null; // пропускаем битые записи
            }

            try {
              const res = await axios.get(
                `${API_URL}/api/public/car-status?plate=${car.plate_number}`
              );
              return res.data; // новые данные
            } catch (err) {
              // Если авто не найдено (404), оставляем как есть или удаляем
              if (err.response?.status === 404) {
                console.log(`Авто ${car.plate_number} не найдено, удаляем из списка`);
                return null; // помечаем для удаления
              }
              console.error(`Ошибка обновления ${car.plate_number}:`, err);
              return car; // при других ошибках оставляем старые данные
            }
          })
        );

        // ✅ Фильтруем null (удалённые) и обновляем состояние
        setTrackingCars(updated.filter(car => car !== null));
      } catch (e) {
        console.error('Ошибка обновления списка:', e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [trackingCars]);

  return (
    <div className="page">
      <h2>Отследить авто</h2>

      <div className="search-block">
        <input
          placeholder="Введите номер авто"
          value={searchPlate}
          onChange={e => setSearchPlate(e.target.value)}
        />
        <button onClick={findCar}>Найти авто</button>
      </div>

      <ul className="tracking-list">
        {trackingCars.map(car => (
          <li key={car.plate_number} className="tracking-item">
            <b>{car.plate_number}</b> — {car.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Track;