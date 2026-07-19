function AppointmentModal({ close, reason, setReason, submit }) {
  return (
    <div
      className="
      fixed
      inset-0
      bg-black/60
      flex
      items-center
      justify-center
      z-50
      "
    >

      <div
        className="
        bg-[var(--code-bg)]
        border
        border-[var(--border)]
        rounded-xl
        p-6
        w-96
        shadow-lg
        "
      >

        <h2
          className="
          font-bold
          text-xl
          mb-4
          text-[var(--text-h)]
          "
        >
          Motivo del rechazo
        </h2>


        <textarea

          className="
          border
          border-[var(--border)]
          bg-[var(--bg)]
          text-[var(--text)]
          placeholder:text-gray-400
          w-full
          p-3
          rounded-lg
          outline-none
          focus:border-[var(--accent)]
          "

          placeholder="Escriba el motivo del rechazo..."

          value={reason}

          onChange={(e) => setReason(e.target.value)}

        />



        <div
          className="
          flex
          justify-end
          gap-3
          mt-4
          "
        >

          <button

            onClick={close}

            className="
            secondary-btn
            "
          >
            Cancelar
          </button>



          <button

            disabled={reason.length < 10}

            onClick={submit}

            className="
            bg-red-500/20
            text-red-400
            border
            border-red-500/40
            px-4
            py-2
            rounded-xl
            font-semibold
            disabled:opacity-50
            hover:bg-red-500/30
            "

          >
            Enviar
          </button>


        </div>

      </div>

    </div>
  );
}


export default AppointmentModal;