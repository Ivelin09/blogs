import { useState, useEffect } from 'react';
import Success from '../components/Success'
import Error from '../components/Error';

const useInfo = () => {
    const [message, setMessage] = useState("");
    const pushMessage = (props) => {
        if (props?.status === 200) {
            setMessage(<Success {...props} />);
        } else {
            setMessage(<Error {...props} />);
        }

        return { message, setMessage };
    }

    useEffect(() => {
        setTimeout(() => {
            setMessage("");
        }, 8000);
    }, [message]);

    return { message, setMessage, pushMessage };
}

export default useInfo;