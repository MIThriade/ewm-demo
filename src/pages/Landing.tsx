import React from "react";

export default function Landing() {
  return (
    <div>
      {/* OVERRIDES PENTRU MOBILE – PATCH RAPID */}
      <style>{`
        @media (max-width: 980px){
          .hero{min-height:72vh;padding:40px 0}
          .headline{font-size: clamp(24px, 6vw, 34px)}
          .sub{font-size:14px;line-height:1.5}
          .cta .btn{width:100%}
          .container{padding:0 16px}
          .grid.products{grid-template-columns:1fr !important}
          .grid.benefits{grid-template-columns:1fr !important}
          .showroom{grid-template-columns:repeat(6,1fr) !important}
          .tile{grid-column:span 6 !important;height:220px}
          .p-card .thumb{height:200px}
        }
      `}</style>

      {/* HTML-UL LANDING-ULUI */}
      <div
        dangerouslySetInnerHTML={{
          __html: `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>EWM Home · Transformă-ți spațiul – Demo Landing</title>
  <meta name="description" content="Panouri acustice, riflaje PVC/MDF și corpuri de iluminat LED. Transformă-ți spațiul în 3 pași simpli. Demo landing page – concept." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Poppins:wght@400;600;800&display=swap" rel="stylesheet" />
  <style>
    :root{
      --bg:#0b0e12; --ink:#e8ecf1; --muted:#9fb1c5;
      --brand:#00d4ff; --brand2:#8a5cff; --accent:#27e1a8; --danger:#ff6b6b;
      --card:#0f141b; --shadow: 0 20px 60px rgba(0,0,0,.35); --radius: 18px;
    }
    *{box-sizing:border-box} html,body{margin:0}
    body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:radial-gradient(1200px 600px at 10% -10%, rgba(138,92,255,.15), rgba(0,0,0,0)), linear-gradient(180deg,#0b0e12 0%, #0b0e12 60%, #0b0e12 100%); color:var(--ink);}
    a{color:inherit;text-decoration:none}
    .container{max-width:1200px;margin:0 auto;padding:0 20px}
    .nav{position:sticky;top:0;z-index:80;background:rgba(11,14,18,.6);backdrop-filter: blur(10px);border-bottom:1px solid rgba(255,255,255,.06)}
    .nav-inner{display:flex;align-items:center;justify-content:space-between;height:72px}
    .logo{display:flex;gap:12px;align-items:center;font-weight:800;letter-spacing:.3px}
    .logo-badge{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--brand),var(--brand2));box-shadow:var(--shadow)}
    .nav a{opacity:.9;margin:0 10px}
    .btn{display:inline-flex;align-items:center;gap:10px;padding:14px 18px;border-radius:14px;background:linear-gradient(135deg,var(--brand),var(--brand2));color:#061018;font-weight:800;text-transform:uppercase;letter-spacing:.5px;border:none;cursor:pointer;box-shadow:0 10px 30px rgba(0,212,255,.35);transition:transform .2s ease}
    .btn:hover{transform:translateY(-2px)}
    .btn-ghost{background:rgba(255,255,255,.06);color:var(--ink);box-shadow:none;border:1px solid rgba(255,255,255,.08)}

    /* HERO */
    .hero{position:relative;min-height:84vh;display:grid;place-items:center;overflow:hidden}
    .hero media{position:absolute;inset:0}
    .hero video,.hero .poster{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(1.05) contrast(1.05) brightness(.8)}
    .hero .gradient{position:absolute;inset:0;background:radial-gradient(60% 60% at 20% 10%, rgba(138,92,255,.35), rgba(0,0,0,.0)), linear-gradient(180deg, rgba(0,0,0,.3) 0%, rgba(11,14,18,.85) 60%, rgba(11,14,18,1) 100%)}
    .hero-inner{position:relative;z-index:2;display:grid;gap:24px;padding:80px 0;text-align:center}
    .kicker{display:inline-flex;gap:10px;align-items:center;justify-content:center;padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.08);color:var(--muted);font-size:14px}
    .headline{font-family:Poppins,Inter,sans-serif;font-size: clamp(32px, 5vw, 56px);line-height:1.05;margin:0}
    .headline strong{background:linear-gradient(135deg,var(--brand),var(--brand2));-webkit-background-clip:text;background-clip:text;color:transparent}
    .sub{max-width:800px;margin:0 auto;color:#c9d4e1;opacity:.95}
    .cta{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:6px}

    /* SECTIONS */
    .section{padding:80px 0}
    .grid{display:grid;gap:18px}
    .benefits{grid-template-columns:repeat(3,minmax(0,1fr))}
    .card{background:linear-gradient(180deg,#0f141b, #0c1118);border:1px solid rgba(255,255,255,.06);border-radius:var(--radius);padding:24px;box-shadow:var(--shadow)}
    .benefit{display:flex;gap:16px;align-items:flex-start}
    .icon{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg, rgba(0,212,255,.12), rgba(138,92,255,.12));border:1px solid rgba(255,255,255,.08)}
    .benefit h4{margin:2px 0 6px 0}

    /* SHOWROOM */
    .showroom{grid-template-columns:repeat(12,1fr)}
    .tile{grid-column: span 4; height: 280px; border-radius: var(--radius); overflow:hidden; position:relative; background:#0a0f15;border:1px solid rgba(255,255,255,.06)}
    .tile.large{grid-column: span 8}
    .tile img{width:100%;height:100%;object-fit:cover;transition:transform .5s ease}
    .tile:hover img{transform:scale(1.04)}
    .tile .tag{position:absolute;top:12px;left:12px;padding:6px 10px;border-radius:999px;background:rgba(0,0,0,.45);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.14);font-size:12px}

    /* PRODUCT HIGHLIGHTS */
    .products{grid-template-columns: repeat(3, minmax(0,1fr))}
    .p-card{display:flex;flex-direction:column;gap:12px}
    .price{display:flex;align-items:center;gap:12px}
    .price .now{font-weight:800;font-size:22px}
    .badge{padding:6px 10px;border-radius:999px;font-size:12px;border:1px solid rgba(255,255,255,.12)}
    .badge.best{background:linear-gradient(135deg, rgba(39,225,168,.15), rgba(0,212,255,.08));border-color:rgba(39,225,168,.3)}
    .badge.sale{background:linear-gradient(135deg, rgba(255,107,107,.18), rgba(138,92,255,.12));border-color:rgba(255,107,107,.35)}
    .p-card .thumb{height:220px;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.08);background:#0a0f15}
    .p-card .thumb img{width:100%;height:100%;object-fit:cover}
    .p-card button{margin-top:auto}

    /* SOCIAL PROOF */
    .reviews{grid-template-columns:repeat(3,minmax(0,1fr))}
    .review small{color:var(--muted)} .stars{color:#f7c948}

    /* FAQ */
    details{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:14px}
    summary{cursor:pointer;font-weight:600}

    /* FOOTER */
    .footer{padding:70px 0;color:#c0cddd;opacity:.9}
    .columns{display:grid;gap:18px;grid-template-columns:2fr 1fr 1fr}

    /* RESPONSIVE */
    @media (max-width: 980px){
      .benefits{grid-template-columns:1fr}
      .products{grid-template-columns:1fr}
      .reviews{grid-template-columns:1fr}
      .showroom{grid-template-columns:repeat(6,1fr)}
      .tile{grid-column:span 6}
      .tile.large{grid-column:span 6}
      .columns{grid-template-columns:1fr}
    }

    /* Tiny entrance animation */
    [data-reveal]{opacity:0;transform:translateY(14px);animation:reveal .8s ease forwards;}
    [data-reveal="2"]{animation-delay:.15s}
    [data-reveal="3"]{animation-delay:.3s}
    @keyframes reveal{to{opacity:1;transform:none}}
  </style>
</head>
<body>
  <!-- NAV -->
  <header class="nav">
    <div class="container nav-inner">
      <a class="logo" href="/">
        <span class="logo-badge"></span>
        <span>EWM <span style="opacity:.7">Home</span></span>
      </a>
      <nav>
        <a href="#beneficii">Beneficii</a>
        <a href="#showroom">Showroom</a>
        <a href="#produse">Produse</a>
        <a href="#recenzii">Recenzii</a>
        <a href="#faq">FAQ</a>
      </nav>
      <a class="btn" href="#produse">Cumpără acum</a>
    </div>
  </header>

  <!-- HERO -->
  <section class="hero">
    <video autoplay muted playsinline loop poster="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop" aria-label="Ambient modern cu riflaje și lumină LED">
      <source src="" type="video/mp4" />
    </video>
    <div class="gradient"></div>
    <div class="container hero-inner">
      <span class="kicker" data-reveal>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L20.6603 8V16L12 21L3.33974 16V8L12 3Z" stroke="currentColor" stroke-width="1.2"/></svg>
        Transformă-ți spațiul în 3 pași simpli
      </span>
      <h1 class="headline" data-reveal="2">Panouri acustice & riflaje + <strong>lumină LED inteligentă</strong><br/> pentru un look premium, fără efort.</h1>
      <p class="sub" data-reveal="3">Creează liniște, adaugă textură și pune în scenă lumina potrivită. Pachete gândite pentru living, birou sau studio – instalare rapidă, rezultate vizibile.</p>
      <div class="cta" data-reveal="3">
        <a class="btn" href="#produse">Vezi pachetele</a>
        <a class="btn btn-ghost" href="#showroom">Vezi înainte/după</a>
      </div>
    </div>
  </section>

  <!-- BENEFITS -->
  <section id="beneficii" class="section">
    <div class="container">
      <div class="grid benefits">
        <div class="card benefit" data-reveal>
          <div class="icon">💡</div>
          <div>
            <h4>Lumină care flatează spațiul</h4>
            <p>LED-uri cu flux mare și CCT reglabil. Creezi ambianța potrivită pentru lucru, relaxare sau conținut video.</p>
          </div>
        </div>
        <div class="card benefit" data-reveal="2">
          <div class="icon">🔊</div>
          <div>
            <h4>Acustică mai bună, instant</h4>
            <p>Panourile MDF/PVC reduc ecoul și îmbunătățesc claritatea. Perfect pentru conferințe, streaming sau muzică.</p>
          </div>
        </div>
        <div class="card benefit" data-reveal="3">
          <div class="icon">🛠️</div>
          <div>
            <h4>Montaj rapid & curat</h4>
            <p>Seturi pregătite cu accesorii – ghid vizual pas-cu-pas, timp scurt de instalare și rezultate “wow”.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SHOWROOM GRID -->
  <section id="showroom" class="section">
    <div class="container">
      <h2 style="margin:0 0 18px 0">Showroom vizual</h2>
      <p class="sub" style="margin:0 0 24px 0">Inspirație reală pentru living, birou și studio. Atinge imaginile pentru detalii.</p>
      <div class="grid showroom">
        <div class="tile large" data-reveal>
          <img alt="Living modern cu riflaje" src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1600&auto=format&fit=crop"/>
          <span class="tag">Riflaje PVC · ton cald</span>
        </div>
        <div class="tile" data-reveal="2">
          <img alt="Birou cu panouri acustice" src="https://images.unsplash.com/photo-1538688423619-a81d3f23454b?q=80&w=1200&auto=format&fit=crop"/>
          <span class="tag">Panouri acustice MDF</span>
        </div>
        <div class="tile" data-reveal="3">
          <img alt="Lumina LED in dining" src="https://images.unsplash.com/photo-1559333084-3d90f66c2d95?q=80&w=1200&auto=format&fit=crop"/>
          <span class="tag">Lustre LED moderne</span>
        </div>
      </div>
    </div>
  </section>

  <!-- PRODUCT HIGHLIGHTS -->
  <section id="produse" class="section">
    <div class="container">
      <h2 style="margin:0 0 18px 0">Pachete recomandate</h2>
      <p class="sub" style="margin:0 0 24px 0">Combinații gândite să rezolve design + acustică + lumină dintr-un foc.</p>
      <div class="grid products">
        <div class="card p-card" data-reveal>
          <div class="thumb"><img alt="Pachet Studio Calm" src="https://images.unsplash.com/photo-1582587781635-0849f1f9f6f6?q=80&w=1200&auto=format&fit=crop" /></div>
          <div class="badge best">Best Seller</div>
          <h3>Studio Calm</h3>
          <p>Riflaje PVC + 6 panouri acustice + bandă LED CCT + ghid montaj.</p>
          <div class="price"><span class="now">899 Lei</span> <del style="opacity:.6">1.099 Lei</del> <span class="badge sale">-18%</span></div>
          <button class="btn">Adaugă în coș</button>
        </div>
        <div class="card p-card" data-reveal="2">
          <div class="thumb"><img alt="Pachet Living Glow" src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop" /></div>
          <div class="badge">Nou</div>
          <h3>Living Glow</h3>
          <p>Riflaje ton nuc + lustră LED dimabilă + bandă perimetrală.</p>
          <div class="price"><span class="now">1.290 Lei</span></div>
          <button class="btn">Adaugă în coș</button>
        </div>
        <div class="card p-card" data-reveal="3">
          <div class="thumb"><img alt="Pachet Office Focus" src="https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop" /></div>
          <div class="badge">Recomandat</div>
          <h3>Office Focus</h3>
          <p>Panouri acustice MDF + plafonieră LED cu CRI 90+ + accesorii montaj.</p>
          <div class="price"><span class="now">1.590 Lei</span> <del style="opacity:.6">1.790 Lei</del></div>
          <button class="btn">Adaugă în coș</button>
        </div>
      </div>
    </div>
  </section>

  <!-- SOCIAL PROOF -->
  <section id="recenzii" class="section">
    <div class="container">
      <h2 style="margin:0 0 18px 0">Ce spun clienții</h2>
      <div class="grid reviews">
        <div class="card review" data-reveal>
          <div class="stars">★★★★★</div>
          <p>“Ecoul în biroul meu a dispărut. Arată premium, montajul a fost chiar simplu.”</p>
          <small>Andrei – Timișoara</small>
        </div>
        <div class="card review" data-reveal="2">
          <div class="stars">★★★★★</div>
          <p>“Lumina reglabilă schimbă atmosfera seara. Pachetul a venit cu tot ce trebuie.”</p>
          <small>Ioana – Cluj</small>
        </div>
        <div class="card review" data-reveal="3">
          <div class="stars">★★★★☆</div>
          <p>“Livrare rapidă, suport prompt. Riflajele chiar fac diferența pe peretele TV.”</p>
          <small>Vlad – București</small>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section id="faq" class="section">
    <div class="container">
      <h2 style="margin:0 0 18px 0">Întrebări frecvente</h2>
      <div class="grid" style="grid-template-columns:1fr 1fr; gap:18px">
        <details class="card"><summary>Cât durează montajul?</summary><p>În medie 1–2 ore pentru un perete de 2–3m, cu ghidul inclus în pachet.</p></details>
        <details class="card"><summary>Pot returna dacă nu se potrivește?</summary><p>Da, retur în 14 zile. Produsele trebuie să fie în stare bună și ambalate corespunzător.</p></details>
        <details class="card"><summary>LED-urile sunt dimabile?</summary><p>Da, pachetele includ soluții cu CCT reglabil și opțiuni de dimare.</p></details>
        <details class="card"><summary>Asigurați consultanță de design?</summary><p>Da, oferim recomandări rapide pentru alegerea pachetului potrivit spațiului tău.</p></details>
      </div>
    </div>
  </section>

  <!-- CTA FINAL -->
  <section class="section" style="padding:60px 0 90px 0">
    <div class="container card" style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">
      <div>
        <h3 style="margin:0 0 6px 0">Gata de transformare?</h3>
        <p style="margin:0;color:var(--muted)">Alege pachetul, primești ghidul de montaj și livrarea rapidă din stoc.</p>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <a class="btn" href="#produse">Vezi pachetele</a>
        <a class="btn btn-ghost" href="/configurator">Configurator rapid</a>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container columns">
      <div>
        <div class="logo" style="margin-bottom:10px"><span class="logo-badge"></span><span>EWM Home</span></div>
        <p>Design, acustică și lumină – într-un singur loc. Demo landing page (concept).</p>
      </div>
      <div>
        <strong>Produse</strong>
        <ul style="list-style:none;padding:0;opacity:.9">
          <li><a href="/">Panouri acustice</a></li>
          <li><a href="/">Riflaje PVC/MDF</a></li>
          <li><a href="/">Lustre & benzi LED</a></li>
        </ul>
      </div>
      <div>
        <strong>Suport</strong>
        <ul style="list-style:none;padding:0;opacity:.9">
          <li><a href="#faq">FAQ</a></li>
          <li><a href="/">Ghiduri montaj</a></li>
          <li><a href="/">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="container" style="border-top:1px solid rgba(255,255,255,.06);margin-top:30px;padding-top:16px;opacity:.7">
      <small>© 2025 EWM Home · Demo</small>
    </div>
  </footer>
</body>
</html>`
        }}
      />
    </div>
  );
}
