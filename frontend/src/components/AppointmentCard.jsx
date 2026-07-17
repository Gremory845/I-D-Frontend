function AppointmentCard({
  appointment,
  canApprove,
  onApprove,
  onReject
}) {


  const statusStyle = {
    pending:
"bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",

approved:
"bg-green-500/10 text-green-400 border border-green-500/20",

rejected:
"bg-red-500/10 text-red-400 border border-red-500/20"
  }

  return (

    <div className="card p-6">

      <div className="flex justify-between items-start mb-5">

        <div>

          <h2 className="font-bold text-xl">

            {appointment.visitor}

          </h2>

          <p>

            Visita a:
            <b className="ml-1">
              {appointment.resident}
            </b>

          </p>

        </div>

        <span className={`px-3 py-1 rounded-full text-sm font-medium
${statusStyle[appointment.status]} `}>

          {appointment.status}

        </span>
      </div>
      <div className="space-y-2 text-sm">

  <p>
    {appointment.date}
  </p>

  <p>
    {appointment.time}
  </p>


  {
    appointment.status === "rejected" &&
    appointment.rejection_notes && (

      <div
        className="
        mt-4
        p-4
        rounded-xl
        bg-red-500/10
        border
        border-red-500/20
        "
      >

        <p
          className="
          text-red-400
          font-semibold
          mb-1
          "
        >
          Motivo del rechazo
        </p>


        <p>
          {appointment.rejection_notes}
        </p>


      </div>

    )
  }


</div>

      {
        canApprove &&
        appointment.status === "pending" &&

        <div className="flex gap-3 mt-6">

          <button
            onClick={onApprove}
            className="primary-btn flex-1">
            Aprobar
          </button>

          <button
            onClick={onReject}
            className="secondary-btn flex-1">
            Rechazar
          </button>

        </div>
      }
    </div>
  )

}


export default AppointmentCard;