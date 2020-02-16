import React, {useEffect} from 'react';

export default function ScrollUp() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return null;
}
