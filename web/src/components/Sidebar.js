import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="bg-gray-800 h-screen w-64 p-4 shadow">
            <nav className="space-y-4">
                <NavLink
                    to="/home"
                    activeClassName="bg-blue-600 text-white"
                    className="block py-2 px-4 rounded hover:bg-blue-900"
                >
                    Projetos de Extensão
                </NavLink>
                <NavLink
                    to="/perfil"
                    activeClassName="bg-blue-600 text-white"
                    className="block py-2 px-4 rounded hover:bg-blue-900"
                >
                    Perfil
                </NavLink>
                <NavLink
                    to=""
                    className="block py-2 px-4 rounded hover:bg-blue-900"
                >
                    Sair
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;