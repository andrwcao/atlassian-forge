import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';
import Button from '@atlaskit/button';
function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        invoke('getText', { example: 'my-invoke-variable' }).then(setData);
    }, []);

    return (
        <div>
            <Button appearance='primary'>Button</Button>
            <img src="./dog.jpeg"/>
            {data ? data : 'Loading...'}
        </div>
    );
}

export default App;
