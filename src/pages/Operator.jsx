import { useState, useEffect } from 'react';
import { getCars, addCar, updateCarStatus } from '../api';


function Operator() {
const [cars, setCars] = useState([]);
const [showModal, setShowModal] = useState(false);


const [brand, setBrand] = useState('');
const [plate, setPlate] = useState('');
const [waitTime, setWaitTime] = useState('');


const fetchCars = async () => {
const data = await getCars();
setCars(data);
};


useEffect(() => {
fetchCars();
}, []);


const handleAddCar = async () => {
if (!brand || !plate || !waitTime) return alert('Заполни все поля');


await addCar({ brand, plate_number: plate, wait_time: waitTime });
setBrand('');
setPlate('');
setWaitTime('');
setShowModal(false);
fetchCars();
};


const handleStatusChange = async (id, status) => {
await updateCarStatus(id, status);
fetchCars();
};


return (
<div className="page">
<h2>Панель оператора</h2>
<button onClick={() => setShowModal(true)}>Добавить авто</button>


<ul className="car-list">
{cars.map(car => (
<li key={car.id} className="car-item">
<div><b>{car.brand}</b> — {car.plate_number}</div>
<div>Ожидание: {car.wait_time} мин</div>
<div>
Статус:
<select value={car.status} onChange={e => handleStatusChange(car.id, e.target.value)}>
<option>В очереди</option>
<option>В работе</option>
<option>Готово</option>
</select>
</div>
</li>
))}
</ul>


{showModal && (
<div className="modal">
<div className="modal-content">
<h3>Добавить авто</h3>
<input placeholder="Марка авто" value={brand} onChange={e => setBrand(e.target.value)} />
<input placeholder="Номер авто" value={plate} onChange={e => setPlate(e.target.value)} />
<input placeholder="Время ожидания" value={waitTime} onChange={e => setWaitTime(e.target.value)} />
<button onClick={handleAddCar}>Сохранить</button>
<button onClick={() => setShowModal(false)}>Отмена</button>
</div>
</div>
)}
</div>
);
}


export default Operator;