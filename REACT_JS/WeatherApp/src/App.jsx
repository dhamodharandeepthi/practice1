
import { useState, useEffect } from 'react'
import './App.css'
//images
import clearIcon from "./assets/Clear.jpg"
import cloudIcon from "./assets/cloud.jpg"
import drizzleIcon from "./assets/drizzle.jpg"
import humidityIcon from "./assets/humidity.jpg"
import rainIcon from "./assets/rain.jpg"
import searchIcon from "./assets/search.jpg"
import snowIcon from "./assets/snow.jpg"
import windIcon from "./assets/wind.jpg"
//end images

const WeatherDetails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="clearIcon" />
      </div>
      <div className="temp">
        {temp}°C
      </div>
      <div className="location">{city}</div>
      <div className="country">
        {country}
      </div>
      <div className="cord">
        <div>
          <span className="lat">latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className='icon' />
          <div className="data">
            <div className="humidity-percentage">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className='icon' />
          <div className="data">
            <div className="wind-percentage">{wind}km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>

    </>
  )
}




function App() {
  let api_key = '8f3c648b1dd38559dd0a9fb9274663bf';
  const [icon, setIcon] = useState(cloudIcon)
  const [temp, setTemp] = useState(0)
  const [city, setCity] = useState(" ")
  const [country, setCountry] = useState("")
  const [lat, setLat] = useState(0)
  const [log, setLog] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [wind, setWind] = useState(0)
  const [text, setText] = useState("tirupur")
  const [cityNotFound, setCityNotFound] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  let weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04n": drizzleIcon,
    "04d": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon
  }

  const search = async () => {
    setLoading(true)

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric `

    try {
      let res = await fetch(url)
      let data = await res.json();
      // console.log(data);
      if (data.cod == 404) {
        console.error("CityNotfound");
        setCityNotFound(true)// it will give no data if not found city
        setLoading(false);
        return;//hereafter no run
      }

      setHumidity(data.main.humidity)
      setWind(data.wind.speed)
      setTemp(Math.floor(data.main.temp))
      setCity(data.name)
      setCountry(data.sys.country)
      setLat(data.coord.lat)
      setLog(data.coord.lon)
      const weatherIconCode = data.weather[0].icon
      setIcon(weatherIconMap[weatherIconCode] || clearIcon)//if icon code not match with our custom icon default clear icon will show
      setCityNotFound(false)

    } catch (err) {
      console.error("An error occured ", err.message);
      setError("An error occured while fetching data")
    } finally {
      setLoading(false)
    }
  }

  const handleCity = (e) => {
    setText(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      search();
    }
  }
  useEffect(() => {
    search()//one time search function call
  }, [])


  return (
    <>
      <div className="container">
        <div className="input-container">
          <input type="text" className='cityInput' placeholder='Search city' onChange={handleCity} value={text} onKeyDown={handleKeyDown} />
          <div className="search-icon">
            <img src={searchIcon} alt="search-icon" onClick={() => search()} />
          </div>
        </div>


        {loading && <div className="loading-message">
          Loading...
        </div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City Not Found</div>}


        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind} />}

        <p className="copyright">
          Designed by <span>Dhamodharan</span>
        </p>

      </div>

    </>
  )
}

export default App


// note:https://home.openweathermap.org/api_keys
// https://openweathermap.org/weather-conditions