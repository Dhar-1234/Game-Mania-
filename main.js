const credit = localStorage.getItem('gameManiaCredit') || '0';
document.getElementById('credit-amount').innerText = parseFloat(credit).toFixed(2);

document.getElementById('tic-tac-toe').addEventListener('click', () => {
    const betAmt = prompt('Enter your bet amount (GameMania Credits):');

    if (betAmt === null) {
        alert('Please enter a valid positive number for the bet amount.');
        return;
    }

    const bet = parseFloat(betAmt);
    if (isNaN(bet) || bet <= 0) {
        alert('Please enter a valid positive number for the bet amount.');
        return;
    }

    if (bet > parseFloat(credit)) {
        alert('Insufficient GameMania Credits for this bet.');
        return;
    }

    localStorage.setItem('gameManiaCredit', (parseFloat(credit) - bet.toFixed(2)).toFixed(2));
    localStorage.setItem('ticTacToeBet', bet.toFixed(2));

    window.location.href = '/Tic-Tac-Toe.html';
});
