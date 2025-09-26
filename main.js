const credit = localStorage.getItem('gameManiaCredit') || '0';
document.getElementById('credit-amount').innerText = parseFloat(credit).toFixed(2);