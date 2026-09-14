import { useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function TestConnection() {
	useEffect(() => {
		const testConnection = async () => {
			try {
				const response = await fetch(API_URL);

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`);
				}

				console.log(`Conexión con el backend establecida: ${API_URL}`);
			} catch (error) {
				console.error('No se pudo conectar con el backend:', error.message);
			}
		};

		testConnection();
	}, []);

	return null;
}
