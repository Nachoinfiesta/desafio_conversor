const apiUrl = 'https://mindicador.cl/api';
const historicalApiUrl = 'https://mindicador.cl/api/historico/';

async function convertCurrency() {
  try {
    const amount = parseFloat(document.getElementById('amount').value);
    const currency = document.getElementById('currency').value;

    const response = await fetch(`${apiUrl}/${currency}`);
    const data = await response.json();

    if (!data.serie || data.serie.length === 0) {
      throw new Error('La solicitud no fue exitosa o los datos son incorrectos');
    }

    const conversionRate = data.serie[0].valor;
    const convertedAmount = amount / conversionRate;

    alert(`Monto convertido: ${convertedAmount.toFixed(2)} ${currency.toUpperCase()}`);

    createChart(currency);
  } catch (error) {
    console.error('Error al convertir la moneda:', error);
    alert('Hubo un error al convertir la moneda. Por favor, inténtelo de nuevo.');
  }
}

function createChart(currency) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 10);
  const endDate = new Date();

  fetch(`${historicalApiUrl}${currency}/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}`)
    .then(response => response.json())
    .then(data => {
      const historicalData = data.serie.map(entry => {
        return { x: new Date(entry.fecha), y: entry.valor };
      });

      const chartCanvas = document.getElementById('chart');
      const ctx = chartCanvas.getContext('2d');
      ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: historicalData.map(entry => entry.x.toLocaleDateString()),
          datasets: [{
            label: `Valor de ${currency.toUpperCase()}`,
            data: historicalData.map(entry => entry.y),
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
          }],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
              },
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    })
    .catch(error => console.error('Error al obtener datos históricos:', error));
}





