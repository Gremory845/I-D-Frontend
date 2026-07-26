import Calendar from "react-calendar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function formatLocalDate(date) {

  const y = date.getFullYear();

  const m = String(date.getMonth() + 1).padStart(2, "0");

  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;

}

function VisitCalendar({ date, setDate, appointments = [] }) {


  function disableDates({ date }) {

    const today = new Date();

    today.setHours(0,0,0,0);


    return (
      date < today ||
      date.getDay() === 0 ||
      date.getDay() === 6
    );

  }



  function getAppointmentsByDate(date){

    const formatted = formatLocalDate(date);

    const pending =
      appointments.filter(
        item =>
          item.date === formatted &&
          item.status === "pending"
      ).length;

    const approved =
      appointments.filter(
        item =>
          item.date === formatted &&
          item.status === "approved"
      ).length;

      const rejected =
      appointments.filter(
        item =>
          item.date === formatted &&
          item.status === "rejected"
      ).length;

    return {
      pending,
      approved,
      rejected
    };

  }



  return (

    <Calendar

      value={date}

      onChange={setDate}

      minDate={new Date()}

      tileDisabled={disableDates}


      tileContent={({date})=>{


        const {
          pending,
          approved,
          rejected
        } = getAppointmentsByDate(date);



        return (

          <div
            className="
            flex
            justify-center
            gap-1
            mt-1
            "
          >


            {
              pending > 0 && (

                <span

                  className="
                  w-5
                  h-5
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-xs
                  font-bold
                  bg-yellow-500
                  text-black
                  "

                >

                  {pending}

                </span>

              )
            }

            {
              approved > 0 && (

                <span

                  className="
                  w-5
                  h-5
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-xs
                  font-bold
                  bg-green-500
                  text-black
                  "

                >

                  {approved}

                </span>
              
              )
            }

            {
              rejected > 0 && (

                <span

                  className="
                  w-5
                  h-5
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-xs
                  font-bold
                  bg-red-500
                  text-black
                  "

                >

                  {rejected}

                </span>

              )
            }

          </div>

        )

      }}



      prevLabel={<FaChevronLeft />}

      nextLabel={<FaChevronRight />}

      prev2Label={null}

      next2Label={null}

    />

  );

}


export default VisitCalendar;