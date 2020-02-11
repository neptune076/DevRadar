import React, {useEffect, useState} from 'react';
import api from './services/api'

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

// Componente: Bloco isolado de HTML, CSS e JS, o qual não interfere no restante da aplicação
// Propriedade: Informações que um componente PAI passa para o componente FILHO
// Estado: Informações mantidas pelo componente (Lembrar: imutabilidade)

function App()
{
    const [devs, setDevs] = useState([]);
    
    async function loadDevs()
    {
        const response = await api.get('/devs');

        setDevs(response.data);
    }

    useEffect(() => { loadDevs() },[])
    

    async function handleAddDev(data)
    {
        const {message} = await (await api.post('/devs', data)).data;
        
        if (message)
        {
            alert(`O usuário ${data.github_username} já foi adicionado`);
        }

        loadDevs();
    }

    async function handleDelDev(github_username)
    {
        await api.delete(`/devs/delete/${github_username}`);

        loadDevs();
    }
    


    return (
        <div id="app">
            <aside>
                <strong>Cadastrar</strong>

                <DevForm onSubmit={handleAddDev} />
            </aside>
            <main>
                <ul>
                    {devs.map(dev => (
                        <DevItem key={dev._id} dev={dev} onClick={handleDelDev} />
                    ))}
                    
                </ul>
            </main>
        </div>
    );
}

export default App;
