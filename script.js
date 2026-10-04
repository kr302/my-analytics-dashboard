let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let chartInstance = null;

const form = document.getElementById('expenseForm');
const list = document.getElementById('expenseList');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const desc = document.getElementById('desc').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    expenses.push({ id: Date.now(), desc, amount, category });
    updateUI();
    form.reset();
});

function deleteItem(id) {
    expenses = expenses.filter(e => e.id !== id);
    updateUI();
}

function updateUI() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderTable();
    renderChart();
}

function renderTable() {
    list.innerHTML = '';
    let total = 0;
    expenses.forEach(e => {
        total += e.amount;
        list.innerHTML += `
            <tr>
                <td>${e.desc}</td>
                <td><span class="badge bg-secondary">${e.category}</span></td>
                <td class="fw-bold">$${e.amount.toFixed(2)}</td>
                <td><button class="btn btn-sm btn-outline-danger" onclick="deleteItem(${e.id})">Delete</button></td>
            </tr>`;
    });
    document.getElementById('totalDisplay').innerText = `$${total.toFixed(2)}`;
    document.getElementById('countDisplay').innerText = expenses.length;
}

function renderChart() {
    const categories = {};
    expenses.forEach(e => {
        categories[e.category] = (categories[e.category] || 0) + e.amount;
    });

    const ctx = document.getElementById('expenseChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Expenses ($)',
                data: Object.values(categories),
                backgroundColor: '#6366f1'
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });
}

function exportToCSV() {
    let csv = 'Description,Category,Amount\n';
    expenses.forEach(e => { csv += `"${e.desc}","${e.category}",${e.amount}\n`; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = 'expenses.csv';
    a.click();
}

updateUI();