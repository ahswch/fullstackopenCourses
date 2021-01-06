import axios from "axios";
import React, { useState, useEffect } from "react";

const Filter = ({ filterCountries, handleFilterCountriesChange }) => (
    <div>
        find countries{" "}
        <input value={filterCountries} onChange={handleFilterCountriesChange} />
    </div>
);

const Countries = ({ countriesToShow, handleShowClick }) =>
    countriesToShow.map((country) => {
        return (
            <div key={country.name}>
                {country.name}
                <button onClick={() => handleShowClick(country)}>show</button>
            </div>
        );
    });

const Languages = ({ languages }) => {
    return (
        <>
            <h3>languages</h3>
            <ul>
                {languages.map((language) => (
                    <li key={language.name}>{language.name}</li>
                ))}
            </ul>
        </>
    );
};

const CountryDetail = ({ currentCountry }) => {
    if (Object.keys(currentCountry).length > 0) {
        return (
            <div>
                <h2>{currentCountry.name}</h2>
                <p>capital {currentCountry.capital}</p>
                <p>population: {currentCountry.population}</p>
                <Languages languages={currentCountry.languages}></Languages>
                <img
                    src={currentCountry.flag}
                    width="100"
                    alt={"flag of " + currentCountry.name}
                />
            </div>
        );
    } else {
        return <div></div>;
    }
};

const CountryWeather = ({ countryWeather }) => {
    if (Object.keys(countryWeather).length > 0) {
        return (
            <>
                <h3>Weather in {countryWeather.location.name}</h3>
                <p>
                    <strong>temperature: </strong>
                    {countryWeather.current.temperature} Celcius
                </p>
                <img
                    src={countryWeather.current.weather_icons[0]}
                    alt={countryWeather.current.weather_descriptions[0]}
                />
                <p>
                    <strong>wind: </strong>
                    {countryWeather.current.wind_speed} mph direction{" "}
                    {countryWeather.current.wind_dir}
                </p>
            </>
        );
    } else {
        return <></>;
    }
};

const App = (props) => {
    let ApiKey = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
            setCountries(response.data);
        });
    }, []);

    const [countries, setCountries] = useState([]);
    const [filterCountries, setFilterCountries] = useState("");
    const [inputTips, setInputTips] = useState("");
    const [countriesToShow, setCountriesToShow] = useState([]);
    const [currentCountry, setCurrentCountry] = useState({});
    const [currentCountryWeather, setCurrentCountryWeather] = useState({});

    const handleFilterCountriesChange = (event) => {
        let filterCountries = event.target.value;
        setFilterCountries(filterCountries);

        if (filterCountries.trim().length > 0) {
            let arr = countries.filter(
                (country) =>
                    country.name
                        .toLowerCase()
                        .indexOf(filterCountries.toLowerCase()) > -1
            );
            inputTips && setInputTips("");
            setCountriesToShow([]);
            setCurrentCountry({});
            setCurrentCountryWeather({});
            if (arr.length > 10) {
                setInputTips("Too many matches, specify another filter");
            } else if (arr.length > 1 && arr.length <= 10) {
                setCountriesToShow(arr);
            } else if (arr.length === 1) {
                setCountriesToShow([]);
                setCurrentCountry(arr[0]);
                getCountryWeather(arr[0].capital);
            }
        } else {
            setInputTips("");
        }
    };

    const handleShowClick = (country) => {
        setCurrentCountry(country);
        getCountryWeather(country.capital);
        inputTips && setInputTips("");
        setCountriesToShow([]);
    };

    const getCountryWeather = (capital) => {
        let url =
            "http://api.weatherstack.com/current?access_key=" +
            ApiKey +
            "&query=" +
            capital;
        console.log(url);
        axios.get(url).then((response) => {
            setCurrentCountryWeather(response.data);
        });
    };

    return (
        <div>
            <Filter
                filterName={filterCountries}
                handleFilterCountriesChange={handleFilterCountriesChange}
            />
            <p>{inputTips}</p>
            <Countries
                countriesToShow={countriesToShow}
                handleShowClick={handleShowClick}
            />
            <CountryDetail currentCountry={currentCountry}></CountryDetail>
            <CountryWeather
                countryWeather={currentCountryWeather}
            ></CountryWeather>
        </div>
    );
};

export default App;
