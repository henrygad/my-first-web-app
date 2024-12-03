import axios from 'axios';
import { useState } from 'react'
import { endPiont } from './utilities';

const useDeleteData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const deleteData = async <T,>(url: string) => {
        try {
            setLoading(true);
            setError('');

            const response = await axios.delete(endPiont + url,
                {
                    baseURL: endPiont,
                     withCredentials: true
                 }
            );
            const data: T | null = await response.data;

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

    return { deleteData, loading, error };
};

export default useDeleteData;
