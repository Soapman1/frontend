import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

function Track() {
  const [searchPlate, setSearchPlate] = useState('');
  const [trackingCars, setTrackingCars] = useState([]);

  const findCar = async () => {
    if (!searchPlate) return;

    try {
      const res = await axios.get(
        `${API_URL}/api/public/car-status?plate=${searchPlate.toUpperCase()}`
      );

      const exists = trackingCars.some(
        car => car.plate_number === res.data.plate_number
      );

      if (!exists) {
        setTrackingCars([...trackingCars, res.data]);
      }

      setSearchPlate('');
    } catch {
      alert('Авто не найдено');
    }
  };

  // 🔁 автообновление статуса (polling)
  useEffect(() => {
    if (trackingCars.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const updated = await Promise.all(
          trackingCars.map(async car => {
            const res = await axios.get(
              `${API_URL}/api/public/car-status?plate=${car.plate_number}`
            );
            return res.data;
          })
        );
        setTrackingCars(updated);
      } catch (e) {
        console.error('Ошибка обновления статуса', e);
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
