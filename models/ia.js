const axios = require('axios');

const requestData = {
    model: "gpt-4",
    messages: [{
        role: "user",
        content: "How are you doing?",
        temperature: 0.1
    }]
};

axios.post('http://8.tcp.ngrok.io:12573/v1/chat/completions', requestData, {
    headers: {
        'Content-Type': 'application/json'
    }
}).then(response => {
    console.log(response.data);
}).catch(error => {
    console.error('Erro:', error);
});
