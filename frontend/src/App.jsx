import { useState } from "react";

function CornerFlourish({ position }) {
  return (
    <svg
      className={`corner-flourish corner-flourish--${position}`}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 90 C 36 88, 58 80, 72 66 C 84 54, 89 40, 90 24"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M20 92 C 42 90, 62 82, 74 70 C 83 60, 87 49, 88 36"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <path
        d="M90 24 c 6 -2 9 -7 7 -12 c -2 -4 -7 -4 -9 -1 c -2 3 1 7 5 6"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M50 82 q 8 -4 10 -13 q -9 1 -12 9 q -1 5 2 4 Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M64 62 q 7 -1 9 -8 q -8 0 -9 7 q 0 2 0 1 Z"
        fill="currentColor"
        opacity="0.4"
      />
      <circle cx="14" cy="70" r="1.6" fill="var(--wine-red)" />
    </svg>
  );
}

function Vine({ side }) {
  return (
    <svg
      className={`vine vine--${side}`}
      viewBox="0 0 24 140"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 6 C 4 30, 20 48, 12 72 C 4 96, 20 112, 12 134"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M12 62 c -8 -1 -12 -7 -10 -13 c 2 -5 8 -6 11 -1"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M12 92 c 8 -1 12 -8 9 -14 c -3 -5 -9 -4 -11 1"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="12" cy="28" r="2" fill="var(--wine-red)" />
      <circle cx="12" cy="118" r="2" fill="var(--wine-red)" />
    </svg>
  );
}

function App() {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState(null); // "yes" | "no" | null
  const [nameError, setNameError] = useState(false);
  const [attendanceError, setAttendanceError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState(null);

  const getCsrfToken = async () => {
    const response = await fetch("http://localhost:8000/api/csrf/", {
      credentials: "include",
    });

    const data = await response.json();

    return data.csrfToken;
  };

  const sendData = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const missingName = trimmedName === "";
    const missingAttendance = attendance === null;

    setNameError(missingName);
    setAttendanceError(missingAttendance);

    if (missingName || missingAttendance) {
      return;
    }

    setSubmitting(true);
    setSendError(null);

    try {
      const csrfToken = await getCsrfToken();

      const response = await fetch("http://localhost:8000/api/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          name: trimmedName,
          attendance,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.log(data);
        setSendError(
          data.error || "No se pudo enviar tu confirmación. Inténtalo de nuevo."
        );
        return;
      }

      console.log(data);

      setSent(true);
    } catch (error) {
      console.error(error);
      setSendError("No se pudo enviar tu confirmación. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNameChange = (value) => {
    setName(value);
    if (value.trim() !== "") {
      setNameError(false);
    }
  };

  const selectAttendance = (value) => {
    setAttendance(value);
    setAttendanceError(false);
  };

  return (
    <main className="invitation-page">
      <section
        className="invitation-card"
        aria-label="Invitación de cumpleaños de Kateryn"
      >
        <CornerFlourish position="tl" />
        <CornerFlourish position="tr" />
        <CornerFlourish position="bl" />
        <CornerFlourish position="br" />
        <Vine side="left" />
        <Vine side="right" />

        <div className="card-content">
          <p className="intro-line">Te invitamos a celebrar</p>

          <div className="age-wrap">
            <span className="age-glow" aria-hidden="true"></span>
            <p className="age-number" aria-label="17 años">
              17
            </p>
          </div>

          <p className="script-title">Cumpleaños</p>

          <p className="caps-title">Celebración</p>

          <div className="divider-ornament" aria-hidden="true">
            <span />
            <i />
            <span />
          </div>

          <p className="guest-name">Kateryn Hernandez Sosa</p>

          <div
            className="divider-ornament divider-ornament--date"
            aria-hidden="true"
          >
            <span />
            <i />
            <span />
          </div>

          <p className="date-line">1 de noviembre</p>

          <div className="future-details-space" aria-hidden="true"></div>
        </div>
      </section>

      <section className="rsvp" aria-label="Confirmación de asistencia">
        <div className="divider-ornament" aria-hidden="true">
          <span />
          <i />
          <span />
        </div>

        <h2 className="rsvp-title">Confirma tu asistencia</h2>

        {sent ? (
          <div className="rsvp-success" role="status">
            <p className="success-script">¡Gracias, {name.trim()}!</p>
            <p className="success-note">Tu asistencia fue registrada con éxito</p>
          </div>
        ) : (
          <form className="rsvp-form" onSubmit={sendData} noValidate>
            <label className="field">
              <input
                className={`field-input${nameError ? " invalid" : ""}`}
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Escribe tu nombre"
                autoComplete="name"
                maxLength={200}
                aria-invalid={nameError || undefined}
              />
              {nameError && (
                <span className="field-error" role="alert">
                  Escribe tu nombre para confirmar tu asistencia.
                </span>
              )}
            </label>

            <div
              className="chip-group"
              role="radiogroup"
              aria-label="¿Asistirás a la celebración?"
            >
              <button
                type="button"
                role="radio"
                aria-checked={attendance === "yes"}
                className={`chip${attendance === "yes" ? " selected" : ""}`}
                onClick={() => selectAttendance("yes")}
              >
                Sí, voy a ir
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={attendance === "no"}
                className={`chip${attendance === "no" ? " selected" : ""}`}
                onClick={() => selectAttendance("no")}
              >
                No iré
              </button>
            </div>

            {attendanceError && (
              <p className="field-error chip-error" role="alert">
                Selecciona una opción para confirmar tu asistencia.
              </p>
            )}

            {sendError && (
              <p className="field-error send-error" role="alert">
                {sendError}
              </p>
            )}

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Enviando…" : "Enviar"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

export default App;