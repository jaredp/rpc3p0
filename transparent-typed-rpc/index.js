
async function rpc(route, args) {
    const result = await fetch(`http://localhost:9001/api/v1/${route}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(args)  
    });
    return await result.json();
}

function rpcFactory(route) {
    return async (args) => {
        return await rpc(route, args);
    };
}

const proxy = new Proxy({}, {
    get: function(oTarget, key) {
        // FIXME "key" could be a symbol, maybe, and we should handle that 
        return rpcFactory(key);
    }
});

module.exports = proxy;

