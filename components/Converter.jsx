import { GoArrowSwitch } from "react-icons/go";
import SetCurrency from "./SetCurrency";
import { useEffect, useState } from "react";


const Converter = () => {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] =   useState("USD");
  const [toCurrency, setToCurrency] = useState("CHF");
  const [result, setResult] = useState("")


  const switchIt = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }


  const getExchangeRate = async () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URI = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}`;
    // const API_URI = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/CHF`;

    try {
        const response = await fetch(API_URI);
        if(!response.ok) throw new Error("Failed to fetch exchange rate");
        const data = await response.json();
        const rate = (data.conversion_rate * amount).toFixed(2);
        setResult(`${amount} ${fromCurrency} = ${rate} ${toCurrency}`);
        console.log(data);
        console.log(rate);

    } catch(error) {
      console.error(error);
    }
  }

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    getExchangeRate();
  }

  useEffect(() => getExchangeRate, [])

  return (
    <form className="converter-form" onSubmit={handleFormSubmit}>
    
        <div className="form-group">
          <label className="form-label">Enter Amount</label>
          <input type="number" className="form-input" value={amount} onChange={e => setAmount(e.target.value)} required />
        </div>
        
        <div className="form-group form-currency-group">
          <div className="form-section">
            <label className="form-label">From</label>
            <SetCurrency
              selectedCurrency={fromCurrency}
              handleCurrency={e => setFromCurrency(e.target.value)}
            />
          </div>

          <div className="exchange-icon" onClick={switchIt}>
            <GoArrowSwitch />
          </div>

          <div className="form-section">
            <label className="form-label">To</label>
            <SetCurrency
              selectedCurrency={toCurrency}
              handleCurrency={e => setToCurrency(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="submit-button">Get Exchange Rate</button>
        <p className="exchange-result-rate">{result}</p>
    </form>
  )
}

export default Converter