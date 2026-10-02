import React, { useState, useEffect } from 'react';
import { movList } from '../data/moviesData';

// головна меню тп
export default function Home() {
  const [mList] = useState(movList);
  const [srch, setSrch] = useState('');
  const [gnr, setGnr] = useState('All');
  const [srt, setSrt] = useState('none');

  const [selMv, setSelMv] = useState(null);
  const [selTm, setSelTm] = useState('');
  const [selSts, setSelSts] = useState([]);
  const [tkTp, setTkTp] = useState('normal');

  const [usr, setUsr] = useState({ fn: '', ln: '', em: '' });
  const [errs, setErrs] = useState({});
  const [sum, setSum] = useState(null);


  const occSts = ['1-3', '3-1', '3-5', '4-4', '4-7', '6-2', '6-6'];

  const rows = 6;
  const cols = 8;


  useEffect(() => {
    setSelSts([]);
  }, [selMv, selTm]);

  // Sortuje typu
  const fltMovs = mList
    .filter((m) => {
      const matchT = m.title.toLowerCase().includes(srch.toLowerCase());
      const matchG = gnr === 'All' || m.genre === gnr;
      return matchT && matchG;
    })
    .sort((a, b) => {
      if (srt === 'title') return a.title.localeCompare(b.title);
      if (srt === 'duration') return a.duration - b.duration;
      return 0;
    });

 
  const handleStClick = (r, c) => {
    const stId = `${r}-${c}`;
    if (occSts.includes(stId)) return;

    if (selSts.includes(stId)) {
      setSelSts(selSts.filter((s) => s !== stId));
    } else {
      setSelSts([...selSts, stId]);
    }
  };

 
  const prcPerTkt = tkTp === 'normal' ? 25 : 18;
  const totPrc = selSts.length * prcPerTkt;

  
  const validate = () => {
    const e = {};
    if (!usr.fn.trim()) e.fn = 'Imię jest wymagane';
    if (!usr.ln.trim()) e.ln = 'Nazwisko jest wymagane';
    if (!usr.em.trim()) {
      e.em = 'E-mail jest wymagany';
    } else if (!/\S+@\S+\.\S+/.test(usr.em)) {
      e.em = 'Nieprawidłowy format e-mail';
    }
    if (selSts.length === 0) e.sts = 'Wybierz co najmniej jedno miejsce';
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  // то далі туда піде localStorage
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const resObj = {
      id: Date.now(),
      movieTitle: selMv.title,
      showtime: selTm,
      seats: selSts,
      ticketType: tkTp === 'normal' ? 'Normalny (25 zł)' : 'Ulgowy (18 zł)',
      totalPrice: totPrc,
      user: usr,
      date: new Date().toLocaleString('pl-PL')
    };

    const exRes = JSON.parse(localStorage.getItem('cinema_res') || '[]');
    localStorage.setItem('cinema_res', JSON.stringify([...exRes, resObj]));

    setSum(resObj);
  };

 
  const resetForm = () => {
    setSum(null);
    setSelMv(null);
    setSelTm('');
    setSelSts([]);
    setUsr({ fn: '', ln: '', em: '' });
    setErrs({});
  };

  return (
    <div className="home-cnt">
      <h2>Repertuar Kina</h2>


      <div className="flt-box">
        <input
          type="text"
          placeholder="Szukaj po tytule..."
          value={srch}
          onChange={(e) => setSrch(e.target.value)}
        />

        <select value={gnr} onChange={(e) => setGnr(e.target.value)}>
          <option value="All">Wszystkie gatunki</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Dramat">Dramat</option>
          <option value="Komedia">Komedia</option>
        </select>

        <select value={srt} onChange={(e) => setSrt(e.target.value)}>
          <option value="none">Brak sortowania</option>
          <option value="title">Tytuł (A-Z)</option>
          <option value="duration">Czas trwania (najkrótsze)</option>
        </select>
      </div>

      {/* список */}
      <div className="mv-grid">
        {fltMovs.map((m) => (
          <div key={m.id} className={`mv-card ${selMv?.id === m.id ? 'active' : ''}`}>
            <img src={m.poster} alt={m.title} className="mv-img" />
            <div className="mv-info">
              <h3>{m.title}</h3>
              <p><strong>Gatunek:</strong> {m.genre}</p>
              <p><strong>Czas trwania:</strong> {m.duration} min</p>
              <p className="mv-desc">{m.description}</p>
              <div className="tm-box">
                <span>Wybierz godzinę:</span>
                <div className="tm-btns">
                  {m.showtimes.map((t) => (
                    <button
                      key={t}
                      className={selMv?.id === m.id && selTm === t ? 'btn-tm active' : 'btn-tm'}
                      onClick={() => {
                        setSelMv(m);
                        setSelTm(t);
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selMv && selTm && !sum && (
        <div className="res-sec">
          <h3>Wybrany film: {selMv.title} ({selTm})</h3>

          {/*Міні карта да жестко */}
          <div className="hall-box">
            <div className="screen">EKRAN</div>
            <div className="seats-grid">
              {Array.from({ length: rows }).map((_, rIdx) => {
                const rNum = rIdx + 1;
                return (
                  <div key={rNum} className="seat-row">
                    <span className="row-num">{rNum}</span>
                    {Array.from({ length: cols }).map((_, cIdx) => {
                      const cNum = cIdx + 1;
                      const sId = `${rNum}-${cNum}`;
                      const isOcc = occSts.includes(sId);
                      const isSel = selSts.includes(sId);

                      let cls = 'seat free';
                      if (isOcc) cls = 'seat occ';
                      if (isSel) cls = 'seat sel';

                      return (
                        <button
                          key={sId}
                          className={cls}
                          onClick={() => handleStClick(rNum, cNum)}
                          disabled={isOcc}
                          title={`Rząd ${rNum}, Miejsce ${cNum}`}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="lgd">
              <div><span className="dot free"></span> Wolne</div>
              <div><span className="dot occ"></span> Zajęte</div>
              <div><span className="dot sel"></span> Wybrane</div>
            </div>
          </div>


          <div className="form-box">
            <h4>Bilety i Dane</h4>
            <p>Wybrane miejsca ({selSts.length}): {selSts.join(', ') || 'brak'}</p>
            {errs.sts && <p className="err">{errs.sts}</p>}

            <div className="tkt-type">
              <label>Rodzaj biletu: </label>
              <select value={tkTp} onChange={(e) => setTkTp(e.target.value)}>
                <option value="normal">Normalny (25 zł)</option>
                <option value="discount">Ulgowy (18 zł)</option>
              </select>
            </div>

            <h4>Łączna cena: {totPrc} zł</h4>

            <form onSubmit={handleSubmit} className="usr-frm">
              <div className="f-grp">
                <label>Imię:</label>
                <input
                  type="text"
                  value={usr.fn}
                  onChange={(e) => setUsr({ ...usr, fn: e.target.value })}
                />
                {errs.fn && <span className="err">{errs.fn}</span>}
              </div>

              <div className="f-grp">
                <label>Nazwisko:</label>
                <input
                  type="text"
                  value={usr.ln}
                  onChange={(e) => setUsr({ ...usr, ln: e.target.value })}
                />
                {errs.ln && <span className="err">{errs.ln}</span>}
              </div>

              <div className="f-grp">
                <label>E-mail:</label>
                <input
                  type="text"
                  value={usr.em}
                  onChange={(e) => setUsr({ ...usr, em: e.target.value })}
                />
                {errs.em && <span className="err">{errs.em}</span>}
              </div>

              <button type="submit" className="btn-sub">Zatwierdź rezerwację</button>
            </form>
          </div>
        </div>
      )}


      {sum && (
        <div className="sum-box">
          <h3> Rezerwacja została zatwierdzona!</h3>
          <p><strong>Film:</strong> {sum.movieTitle}</p>
          <p><strong>Godzina:</strong> {sum.showtime}</p>
          <p><strong>Miejsca:</strong> {sum.seats.join(', ')}</p>
          <p><strong>Bilet:</strong> {sum.ticketType}</p>
          <p><strong>Do zapłaty:</strong> {sum.totalPrice} zł</p>
          <p><strong>Dane rezerwującego:</strong> {sum.user.fn} {sum.user.ln} ({sum.user.em})</p>
          <button onClick={resetForm} className="btn-sub">Nowa rezerwacja</button>
        </div>
      )}
    </div>
  );
}