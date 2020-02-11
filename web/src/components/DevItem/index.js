import React from 'react';

import './styles.css';

function DevItem({dev, onClick})
{
    async function handleDelete()
    {
        await onClick(dev.github_username)
    }

    return (
        <li className="dev-item">
            <button onClick={handleDelete}>x</button>
            <header>
                <img src={dev.avatar_url} alt={dev.name} />
                <div className="user-info">
                    <strong>{dev.name}</strong>
                    <span>{dev.techs.join(', ')}</span>
                </div>
            </header>
            <p>{dev.bio}</p>
            <a id="git" href={`https://github.com/${dev.github_username}`}>Acessar perfil no Github</a>
        </li>
    );
}

export default DevItem;