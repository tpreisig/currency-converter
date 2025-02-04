
const App = () => {
  return (
    <div className="currency-converter">
      <h2 className="converter-title">Currency Converter</h2>
      <form className="converter-form">
        <div className="form-group">
          <label htmlFor="from-label">Enter Amount</label>
          <input type="number" className="form-input" required />
        </div>
        <div className="form-group">
          <div className="form-section">
            <label className="form-label">From</label>
          </div>
        </div>
      </form>
    </div>
  )
}

export default App

