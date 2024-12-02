import axios from 'axios';
import { useState } from 'react';

const usePatchData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const patchData = async <T,>(url: string, body: {} | [] | string | null | undefined) => {

        try {
            setLoading(true);
            setError('');

            const response = await axios.patch('https://blogsupserver.onrender.com' + url, body,
                {
                    baseURL: 'https://blogsupserver.onrender.com',
                     withCredentials: true
                 }
            );
            const data: T = await response.data;

            if (data) {

                setError('');
                setLoading(false);

                return { data: data, ok: true };

            } else throw new Error('this is new error');

        } catch (_error) {
            const error = _error as {
                response: {
                    data: {
                        message: string
                    }
                }
            };

            console.error(error);
            setError(error.response.data.message);
            setLoading(false);

            return { data: null, ok: false };
        };
    };

    return { patchData, loading, error };
};

export default usePatchData;
