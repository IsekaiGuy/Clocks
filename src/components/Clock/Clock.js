import { useEffect, useState, useRef } from "react";
import getTimezones from "../../services/TimezoneService";
import { useSelector, useDispatch } from "react-redux";
import clockAction from "../../actions/clockActions";

import "./Clock.css";

const Clock = () => {
  const [timezoneList, setTimezoneList] = useState(null);
  const [currentTimezone, setCurrentTimezone] = useState("");
  const [tickState, setTickState] = useState(true);

  const dispatch = useDispatch();
  const currentTime = useSelector((state) => state);

  const secondHand = useRef(null);
  const minsHand = useRef(null);
  const hourHand = useRef(null);

  const secondsContainer = useRef(null);
  const minutesContainer = useRef(null);
  const hoursContainer = useRef(null);

  useEffect(() => {
    const timer = setInterval(getTime, 1000);
    const tick = setInterval(ticker, 1000);
    return () => {
      clearInterval(timer);
      clearInterval(tick);
    };
    /* eslint-disable */
  }, []);

  useEffect(() => {
    onRequest();
  }, []);

  useEffect(() => {
    if (currentTimezone && currentTime) setCurrentTime(currentTime);
  }, [currentTimezone, currentTime]);

  const ticker = () => {
    setTickState((prev) => !prev);
  };

  const getTime = () => {
    const time = new Date();

    dispatch(clockAction(time));
  };

  const setCurrentTime = (time) => {
    const timezoneOffset = timezoneList.find(
      (zone) => zone.name === currentTimezone
    );

    //SETTING SECONDS
    const seconds =
      (time.getUTCSeconds() +
        +timezoneOffset.timezone.replace(/\+/, "") * 360) %
      60;

    if (seconds > 9) secondsContainer.current.textContent = seconds;
    else secondsContainer.current.textContent = "0" + seconds;

    const secondsDegrees = (seconds / 60) * 360 + 90;
    secondHand.current.style = `transform: rotate(${secondsDegrees}deg);`;

    // SETTING MINUTES
    const minutes =
      time.getUTCMinutes() +
      ((+timezoneOffset.timezone.replace(/\+/, "") * 60) % 60);

    if (minutes > 9) minutesContainer.current.textContent = minutes;
    else minutesContainer.current.textContent = "0" + minutes;

    const minsDegrees = (minutes / 60) * 360 + (seconds / 60) * 6 + 89;
    minsHand.current.style.cssText = `transform: rotate(${minsDegrees}deg); transition: all 1s`;

    // SETTING HOURS
    const hours =
      time.getUTCHours() + (+timezoneOffset.timezone.replace(/\+/, "") % 60);

    if (hours < 10) hoursContainer.current.textContent = "0" + hours;
    if (hours >= 24 && hours - 24 < 10)
      hoursContainer.current.textContent = "0" + (hours - 24);
    else hoursContainer.current.textContent = hours;

    const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30 + 90;
    hourHand.current.style.cssText = `transform: rotate(${hourDegrees}deg); transition: all 1s`;
  };

  const onRequest = () => {
    getTimezones().then(onTimezonesLoaded);
  };

  const onTimezonesLoaded = (timezones) => {
    setTimezoneList(timezones);
    setCurrentTimezone(timezones[0].name);
  };

  const Tick = () => (
    <div className={tickState ? "tick" : "tick tick-hidden"}>:</div>
  );

  return (
    <div className="container">
      <div className="clock">
        <ul className="hour-positions">
          <li className="position" />
          <li className="position" />
          <li className="position" />
          <li className="position" />
          <div className="inner-circle" />
        </ul>

        <div className="hands">
          <div className="hand hour-hand" ref={hourHand} />
          <div className="hand min-hand" ref={minsHand} />
          <div className="hand second-hand" ref={secondHand} />
        </div>
      </div>

      <div className="digital-clock">
        <div className="hours" ref={hoursContainer}>
          <div className="first">
            <div className="number">0</div>
          </div>
          <div className="second">
            <div className="number">0</div>
          </div>
        </div>
        <Tick />
        <div className="minutes" ref={minutesContainer}>
          <div className="first">
            <div className="number">0</div>
          </div>
          <div className="second">
            <div className="number">0</div>
          </div>
        </div>
        <Tick />
        <div className="seconds" ref={secondsContainer}>
          <div className="first">
            <div className="number">0</div>
          </div>
          <div className="second infinite">
            <div className="number">0</div>
          </div>
        </div>
      </div>

      <form>
        <label htmlFor="timezones" />
        <select
          id="timezones"
          name="timezones"
          onChange={(e) => setCurrentTimezone(e.target.value)}
          value={currentTimezone}
        >
          {timezoneList ? (
            timezoneList.map((zone, i) => {
              return (
                <option key={i} value={zone.name}>
                  {zone.name}
                </option>
              );
            })
          ) : (
            <option>Загрузка данных...</option>
          )}
        </select>
      </form>
    </div>
  );
};

export default Clock;
