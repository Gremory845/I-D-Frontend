import Calendar from "react-calendar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function VisitCalendar({ date, setDate }) {


  function disableDates({date}){

    const today = new Date();

    return (
      date < today ||
      date.getDay() === 0 ||
      date.getDay() === 6
    );

  }


  return (

    <Calendar

value={date}

onChange={setDate}

minDate={new Date()}

tileDisabled={disableDates}


prevLabel={<FaChevronLeft/>}

nextLabel={<FaChevronRight/>}

prev2Label={null}

next2Label={null}

/>

  );

}


export default VisitCalendar;