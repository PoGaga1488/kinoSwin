import React, { useState, useEffect } from 'react';

// istoria seansiv
export default function History() {
  const [resList, setResList] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('cinema_res') || '[]');
    setResList(data);
  }, []);

  const handleCancel = (id) => {
    const updated = resList.filter((item) => item.id !== id);
    setResList(updated);
    localStorage.setItem('cinema_res', JSON.stringify(updated));
  };

  return (
    <div className="page-cnt">
      <h2>Moje Rezerwacje</h2>
      {resList.length === 0 ? (
        <p>Brak historii rezerwacji.</p>
      ) : (
        <div className="his-list">
          {resList.map((r) => (
            <div key={r.id} className="his-card">
              <h4>{r.movieTitle} ({r.showtime})</h4>
              <p><strong>Miejsca:</strong> {r.seats.join(', ')}</p>
              <p><strong>Bilet:</strong> {r.ticketType}</p>
              <p><strong>Cena:</strong> {r.totalPrice} zł</p>
              <p><strong>Dane:</strong> {r.user.fn} {r.user.ln} ({r.user.em})</p>
              <p><small>Data złożenia: {r.date}</small></p>
              <button onClick={() => handleCancel(r.id)} className="btn-cncl">
                Anuluj rezerwację
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
