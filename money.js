const messages = [
    {
        from: 'Son',
        content: 'Hey Dad, where are you? You promised to attend my graduation...'
    },
    {
        from: 'Wife',
        content: 'I need some money for groceries.'
    },
    {
        from: 'Wife',
        content: 'Can you pay the electricity bill? The landlord is threatening to cut it off.'
    },
    {
        from: 'Wife',
        content: 'Where are you? Please respond. We haven\'t heard from you in days.'
    },
    {
        from: 'Son',
        content: 'I need money for school supplies.'
    },
    {
        from: 'Son',
        content: 'Can you help me with my homework? I\'m struggling with math. And I miss when we hung out...'
    },
    {
        from: 'Son',
        content: 'Dad, why don\'t you ever come to my soccer games? It would mean a lot to me.'
    },
    {
        from: 'Wife',
        content: 'I\'m really worried about you. Please call me when you get this message.'
    }
];

function randMessage() {
    return messages[Math.floor(Math.random() * messages.length)];
}

function displayMessage() {
    const messagesElement = document.getElementById('messages');
    if (!messagesElement) return;

    const message = randMessage();
    messagesElement.innerHTML = `
        <div class="message">
            <strong>${message.from}:</strong> ${message.content}
        </div>
    ` + messagesElement.innerHTML;

    if (messagesElement.children.length > 5)
        messagesElement.removeChild(messagesElement.children[5]);
}

setInterval(displayMessage, Math.random() * 5000 + 3000); // Random interval between 3 to 8 seconds

const balance = localStorage.getItem('balance') || '500.00';
document.getElementById('balance').value = parseFloat(balance).toFixed(2);

document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    
    const moneyTransfer = +document.getElementById('amount').value;
    if (moneyTransfer > balance) {
        alert('Insufficient funds!');
        return;
    }

    const prevCredit = parseFloat(localStorage.getItem('gameManiaCredit') || '0');
    localStorage.setItem('balance', (balance - moneyTransfer).toFixed(2));
    localStorage.setItem('gameManiaCredit', (prevCredit + moneyTransfer).toFixed(2));

    alert(`Successfully sent $${moneyTransfer.toFixed(2)} to Game Mania!`);
    window.location.href = 'index.html';
});
