/* eslint-disable react/prop-types */
import currencyCodes from '../data/currencyCodes.json'


const SetCurrency = ({ selectedCurrency, handleCurrency }) => {
    const countryCode = selectedCurrency.substring(0, 2).toLowerCase();
    console.log(countryCode);

    return (
        <div className="currency-select">
            <img src={`https://flagcdn.com/${countryCode}.svg`} />

            <select 
                className="currency-dropdown" 
                value={selectedCurrency}
                onChange={handleCurrency}
            >
                {currencyCodes.map(currency => (
                    <option key={currency} value={currency}>
                        {currency}
                    </option>
                ))}
            </select>
        </div>
  )
}

export default SetCurrency
