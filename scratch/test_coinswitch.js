async function testCoinSwitch() {
  try {
    const response = await fetch('https://api.coinswitch.co/v2/rates');
    const data = await response.json();
    console.log('CoinSwitch Data:', JSON.stringify(data).substring(0, 500));
  } catch (error) {
    console.error('Error fetching CoinSwitch:', error);
  }
}

testCoinSwitch();
