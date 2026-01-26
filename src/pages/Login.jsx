import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginAPI, setToken } from '../api';


function Login() {
const [login, setLoginInput] = useState('');
const [password, setPassword] = useState('');
const navigate = useNavigate();


const handleLogin = async () => {
try {
const data = await loginAPI(login, password);
setToken(data.token);
navigate('/operator');
} catch (err) {
alert(err.response?.data?.error || 'Ошибка входа');
}
};


return (
<div className="form-page">
<h2>Вход</h2>
<input placeholder="Логин" value={login} onChange={e => setLoginInput(e.target.value)} />
<input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />
<button onClick={handleLogin}>Войти</button>
</div>
);
}


export default Login;