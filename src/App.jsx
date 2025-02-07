import { GoArrowSwitch } from "react-icons/go";



const App = () => {


  const whatDidThey = async() => {
    try{
      const response = await fetch("https://api.npoint.io/a94c2763293b3ac6b0be");
      if(!response.ok) throw new Error("Failed to fetch data from api");
      const data = await response.json();
      console.log(data);

    } catch(error){
      console.log(error);
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    whatDidThey();
  }


  return (
    <div className="currency-converter">
      <h2 className="converter-title">Currency Converter</h2>

      <form className="converter-form" onSubmit={handleFormSubmit}>

        <div className="form-group">
          <label htmlFor="from-label">Enter Amount</label>
          <input type="number" className="form-input" required />
        </div>

        <div className="form-group form-currency-group">
          <div className="form-section">
            <label className="form-label">From</label>
            <div className="currency-select">
              <select className="currency-dropdown">
                  <option value="CHF">CHF</option>
                  <option value="EUR">EUR</option>
                  <option value="USD" selected="USD" >USD</option>
                  <option value="YEN">YEN</option>
                </select>
            </div>
          </div>
          <div className="exchange-icon">
            <GoArrowSwitch />
          </div>
          <div className="form-section">
            <label className="form-label">To</label>
            <div className="currency-select">
              <select className="currency-dropdown">
                <option value="CHF">CHF</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="YEN">YEN</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button">Get Exchange Rate</button>
        <p className="exchange-result-rate">Crancran</p>
      </form>

    </div>
  )
}

export default App

