import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, Download, Eye, LayoutDashboard, Mail, MapPin, Medal, Plus, Search, Settings, Snowflake, Users } from "lucide-react";
import styles from "@/app/design-vorschau/design-preview.module.css";
import type { BoardMember, EventItem, PublicPlatform, Sponsor } from "@/components/public-site";

export type DesignVariant = "pistenstart" | "naechster-termin" | "verein-im-schnee" | "premium-hero" | "premium-startseite-hell" | "premium-sponsoren" | "premium-ueber-uns" | "premium-termin" | "premium-termin-hell" | "premium-anmeldung" | "premium-anmeldung-hell" | "premium-admin" | "premium-admin-hell";

const names: Record<DesignVariant, string> = {
  pistenstart: "Pistenstart",
  "naechster-termin": "Der nächste Termin",
  "verein-im-schnee": "Verein im Schnee",
  "premium-hero": "Premium Hero",
  "premium-startseite-hell": "Premium Startseite · Weiß",
  "premium-sponsoren": "Premium Sponsoren",
  "premium-ueber-uns": "Premium Über uns",
  "premium-termin": "Premium Termin",
  "premium-termin-hell": "Premium Termin · Weiß",
  "premium-anmeldung": "Premium Anmeldung",
  "premium-anmeldung-hell": "Premium Anmeldung · Weiß",
  "premium-admin": "Premium Admin",
  "premium-admin-hell": "Premium Admin · Weiß",
};

function Logo({ inverse = false }: { inverse?: boolean }) {
  return <img className={inverse ? styles.logoInverse : styles.logo} src="/schiteam-logo.png" alt="Schiteam Union Julbach" />;
}

function Header() {
  return <header className={styles.header}><div className={styles.wrap}><a className={styles.skip} href="#preview-main">Zum Inhalt</a><Link className={styles.logoLink} href="/design-vorschau/pistenstart" aria-label="Designvorschau Startseite"><Logo /></Link><nav className={styles.nav} aria-label="Hauptnavigation"><a href="#veranstaltungen">Veranstaltungen</a><a href="#sponsoren">Sponsoren</a><a href="#verein">Über uns</a><a href="#kontakt">Kontakt</a></nav><span className={styles.season}>Saison 2026/27</span></div></header>;
}

function PreviewLabel({ variant }: { variant: DesignVariant }) {
  return <div className={styles.previewLabel}>Isolierte Designvorschau · {names[variant]}</div>;
}

function Photo({ className = "", position = "50% 50%", src = "/schiteam-momente.jpeg", alt = "Momente des Schiteam Julbach im Schnee" }: { className?: string; position?: string; src?: string; alt?: string }) {
  return <figure className={`${styles.photo} ${className}`}><img src={src} alt={alt} style={{ objectPosition: position }} /></figure>;
}

function EventFacts({ event, compact = false }: { event: EventItem; compact?: boolean }) {
  const status = event.status === "Anmeldung offen" ? "Anmeldung geöffnet" : event.status;
  return <div className={compact ? styles.eventFactsCompact : styles.eventFacts}><span>{status}</span><strong>{event.title}</strong><small>{event.dateLong}</small><small>{event.place}</small>{event.showSpots !== false && event.spots !== undefined ? <small>{event.spots} Plätze frei</small> : null}<Link href={`/veranstaltungen/${event.id}`}>Veranstaltung ansehen <span aria-hidden>→</span></Link></div>;
}

function Sponsors({ sponsors }: { sponsors: Sponsor[] }) {
  return <section className={styles.sponsors} id="sponsoren"><div className={styles.wrap}><div className={styles.sectionHead}><h2>Unsere Sponsoren</h2><p>Partner des Sports und der Gemeinschaft in Julbach.</p></div>{sponsors.length ? <div className={styles.sponsorRow} aria-label="Sponsorenlogos aus der Plattform">{sponsors.map((sponsor) => <span key={sponsor.id}><img src={sponsor.logoUrl} alt={sponsor.name} /></span>)}</div> : <p className={styles.sponsorEmpty}>Die bestehenden Sponsoren erscheinen hier automatisch aus dem Adminbereich.</p>}</div></section>;
}

function Footer() {
  return <footer className={styles.footer} id="kontakt"><div className={styles.wrap}><div><Logo inverse /><p>Snow. Fun. Friends.<br />Nachwuchs. Action. Teamspirit.</p></div><div><strong>Schiteam Julbach</strong><span>Julbach · Oberösterreich</span></div><div><strong>Information</strong><a href="#veranstaltungen">Veranstaltungen</a><a href="#verein">Über uns</a></div></div></footer>;
}

function Pistenstart({ event, sponsors }: { event: EventItem; sponsors: Sponsor[] }) {
  const image = event.imageUrl || "/schiteam-momente.jpeg";
  return <><section className={`${styles.hero} ${styles.heroPistenstart}`}><div className={`${styles.wrap} ${styles.heroGrid}`}><div className={styles.heroCopy} data-enter><p className={styles.kicker}>Saison 2026/27</p><h1>Skikurse und Ausfahrten für Julbach</h1><p>Termine ansehen und direkt online anmelden.</p><a className={styles.primary} href="#veranstaltungen">Veranstaltungen ansehen <span aria-hidden>→</span></a></div><Photo className={styles.heroPhoto} position={event.imagePosition} src={image} alt={event.title} /></div></section><section className={styles.events} id="veranstaltungen"><div className={styles.wrap}><div className={styles.sectionHead}><h2>Nächste Veranstaltung</h2><p>Der erste veröffentlichte Termin der Saison.</p></div><article className={styles.eventFeature}><Photo position={event.imagePosition} src={image} alt={event.title} /><EventFacts event={event} /></article></div></section><section className={styles.clubSplit} id="verein"><div className={`${styles.wrap} ${styles.clubGrid}`}><div><h2>Training und Gemeinschaft</h2><p>Wir bringen Kinder, Jugendliche und Erwachsene mit Begeisterung in den Schnee.</p></div><Photo position="50% 64%" /></div></section><Sponsors sponsors={sponsors} /><section className={styles.redBand}><div className={styles.wrap}><h2>Ehrenamtlich. Sportlich. Miteinander.</h2></div></section></>;
}

function NextEvent({ event, sponsors, events }: { event: EventItem; sponsors: Sponsor[]; events: EventItem[] }) {
  const image = event.imageUrl || "/schiteam-momente.jpeg";
  const more = events.slice(1, 5);
  return <><section className={`${styles.hero} ${styles.heroNext}`}><div className={styles.wrap}><div className={styles.heroNextHead} data-enter><div><p className={styles.kicker}>Saison 2026/27</p><h1>Veranstaltungen des Schiteam Julbach</h1></div><p>Den nächsten Termin prüfen und direkt zur Anmeldung wechseln.</p></div><article className={styles.nextEventCard}><Photo position={event.imagePosition} src={image} alt={event.title} /><div className={styles.dateBlock}><strong>{event.date}</strong><span>{event.place}</span></div><EventFacts event={event} compact /></article></div></section><section className={styles.eventRows} id="veranstaltungen"><div className={styles.wrap}><div className={styles.sectionHead}><h2>Weitere Saisontermine</h2><p>Neue Termine erscheinen hier nach ihrer Veröffentlichung.</p></div>{more.length ? more.map((item) => <div className={styles.emptyRow} key={item.id}><strong>{item.dateLong} · {item.title}</strong><Link href={`/veranstaltungen/${item.id}`}>Veranstaltung ansehen →</Link></div>) : <div className={styles.emptyRow}><strong>Derzeit ist ein Termin veröffentlicht.</strong><Link href={`/veranstaltungen/${event.id}`}>{event.title} ansehen →</Link></div>}</div></section><section className={styles.steps} id="verein"><div className={styles.wrap}><div className={styles.sectionHead}><h2>So funktioniert die Anmeldung</h2><p>Der vorhandene Ablauf in drei klaren Schritten.</p></div><ol><li><b>01</b><strong>Veranstaltung wählen</strong></li><li><b>02</b><strong>Daten eingeben</strong></li><li><b>03</b><strong>Bestätigung erhalten</strong></li></ol><Photo position="50% 60%" /></div></section><Sponsors sponsors={sponsors} /></>;
}

function ClubStory({ event, sponsors }: { event: EventItem; sponsors: Sponsor[] }) {
  return <><section className={`${styles.hero} ${styles.heroStory}`}><div className={`${styles.wrap} ${styles.storyHeroGrid}`}><Photo className={styles.storyHeroPhoto} position="50% 61%" /><div className={styles.storyPanel} data-enter><p className={styles.kicker}>Saison 2026/27</p><h1>Skiverein für Julbach</h1><p>Skikurse, Trainings und gemeinsame Ausfahrten in der Saison 2026/27.</p><a className={styles.primary} href="#veranstaltungen">Veranstaltungen ansehen <span aria-hidden>→</span></a></div></div></section><section className={styles.photoChapter} id="verein"><div className={styles.wrap}><div className={styles.sectionHead}><h2>Nachwuchs und Training</h2><p>Gemeinsam lernen, üben und sicherer Ski fahren.</p></div></div><Photo position="50% 55%" /></section><section className={styles.compactEvents} id="veranstaltungen"><div className={styles.wrap}><div className={styles.sectionHead}><h2>Aktuelle Veranstaltungen</h2><p>Alle veröffentlichten Termine der Saison.</p></div><article><div><strong>{event.dateLong}</strong><span>{event.place}</span></div><h3>{event.title}</h3><span>{event.status}</span><Link href={`/veranstaltungen/${event.id}`}>Ansehen →</Link></article></div></section><section className={styles.peopleSection}><div className={`${styles.wrap} ${styles.clubGrid}`}><div><h2>Ehrenamtlich. Sportlich. Miteinander.</h2><p>Die Menschen hinter dem Verein gestalten Training, Nachwuchsarbeit und gemeinsame Ausfahrten.</p></div><Photo position="50% 68%" /></div></section><Sponsors sponsors={sponsors} /><section className={styles.redBand}><div className={styles.wrap}><h2>Gemeinsam in den Schnee.</h2><a className={styles.inverseButton} href="#veranstaltungen">Veranstaltungen ansehen →</a></div></section></>;
}

const liveOrigin = "https://www.schiteam-julbach.at";

function previewAssetUrl(src: string) {
  return src.startsWith("/") ? `${liveOrigin}${src}` : src;
}

function PremiumSiteHeader({ active, homeHref = "/design-vorschau/premium-hero" }: { active: "home" | "sponsors" | "about"; homeHref?: string }) {
  return <header className={styles.premiumHeader}>
    <a className={styles.premiumSkip} href="#preview-main">Zum Inhalt</a>
    <Link className={styles.premiumLogo} href={homeHref} aria-label="Schiteam Julbach Startseite">
      <img src="/schiteam-logo.png" alt="Schiteam Union Julbach" />
    </Link>
    <nav className={styles.premiumNav} aria-label="Hauptnavigation">
      <Link className={active === "home" ? styles.premiumNavActive : ""} href={homeHref}>Veranstaltungen</Link>
      <Link className={active === "sponsors" ? styles.premiumNavActive : ""} href="/design-vorschau/premium-sponsoren">Sponsoren</Link>
      <Link className={active === "about" ? styles.premiumNavActive : ""} href="/design-vorschau/premium-ueber-uns">Über uns</Link>
    </nav>
    <span className={styles.premiumHeaderSpacer} aria-hidden="true" />
  </header>;
}

function PremiumHomeSponsors({ sponsors }: { sponsors: Sponsor[] }) {
  return <section className={`${styles.premiumSponsorSection} ${styles.premiumHomeSponsors}`} aria-labelledby="home-sponsors-title">
    <div className={`${styles.premiumSectionTitle} ${styles.premiumSponsorHeading}`}>
      <h2 id="home-sponsors-title">Unsere Sponsoren</h2>
      <span>Danke an unsere Partner, die den Sport und die Gemeinschaft im Schiteam Julbach möglich machen.</span>
    </div>
    {sponsors.length ? <div className={styles.premiumSponsorGrid}>{sponsors.map((sponsor) => <article className={`${styles.premiumSponsorCard} ${sponsorCardClass(sponsor.name)}`} key={sponsor.id}>
      <div className={styles.premiumSponsorLogoStage}>{sponsor.logoUrl ? <img className={sponsorLogoClass(sponsor.name)} src={previewAssetUrl(sponsor.logoUrl)} alt={`Logo von ${sponsor.name}`} /> : <strong>{sponsor.name}</strong>}</div>
    </article>)}</div> : <p className={styles.premiumDataEmpty}>Die Sponsoren werden automatisch aus dem Adminbereich übernommen.</p>}
  </section>;
}

function PremiumHomeClosing({ homeHref = "/design-vorschau/premium-hero" }: { homeHref?: string }) {
  return <>
    <section className={styles.premiumHomeClub} aria-labelledby="home-club-title">
      <div>
        <p>Schiteam Julbach</p>
        <h2 id="home-club-title">Ehrenamtlich.<br /><span>Sportlich. Miteinander.</span></h2>
      </div>
      <p>Wir bringen Kinder, Jugendliche und Erwachsene mit Begeisterung in den Schnee – und schaffen Erlebnisse, die verbinden.</p>
    </section>
    <footer className={styles.premiumHomeFooter}>
      <div>
        <Link className={styles.premiumFooterLogo} href={homeHref}><img src="/schiteam-logo.png" alt="Schiteam Union Julbach" /></Link>
        <p>Snow. Fun. Friends.<br />Nachwuchs. Action. Teamspirit.</p>
      </div>
      <div><strong>Schiteam Julbach</strong><a href="mailto:schiteam.julbach@gmail.com">schiteam.julbach@gmail.com</a><span>Julbach · Oberösterreich</span></div>
      <div><strong>Information</strong><Link href="/datenschutz">Datenschutz</Link><a href="#impressum">Impressum</a><Link href="/design-vorschau/premium-admin">Admin Login</Link></div>
      <small>© 2026 Schiteam Julbach</small>
    </footer>
  </>;
}

function PremiumHero({ events, sponsors, light = false }: { events: EventItem[]; sponsors: Sponsor[]; light?: boolean }) {
  const event = events[0];
  const homeHref = light ? "/design-vorschau/premium-startseite-hell" : "/design-vorschau/premium-hero";
  if (!event) return <main className={styles.noEvents}><h1>Keine veröffentlichte Veranstaltung</h1></main>;
  return <main className={`${styles.premiumPage} ${light ? styles.premiumLightHome : ""}`} id="preview-main">
    <section className={styles.premiumHero} aria-labelledby="premium-title">
      <PremiumSiteHeader active="home" homeHref={homeHref} />

      <div className={styles.premiumStage}>
        <div className={styles.premiumCopy} data-enter>
          <p className={styles.premiumEyebrow}><span /> Saison 2026/27 · Julbach</p>
          <h1 id="premium-title">Skikurse.<br /><em>Ausfahrten.</em><br />Gemeinschaft.</h1>
          <p className={styles.premiumIntro}>Das Schiteam Julbach bringt Kinder, Jugendliche und Erwachsene gemeinsam in den Schnee.</p>
          <a className={styles.premiumPrimary} href="#premium-event">Veranstaltungen ansehen <span aria-hidden>→</span></a>
        </div>

        <div className={styles.premiumArtwork} aria-hidden="true">
          <span className={styles.premiumSeason}>26<span>/</span>27</span>
          <svg className={styles.premiumContours} viewBox="0 0 680 760" fill="none">
            <path d="M-40 115C87 28 214 43 300 132C391 226 450 238 720 80" />
            <path d="M-70 185C77 81 230 91 323 181C418 274 489 284 743 135" />
            <path d="M-100 258C69 137 242 146 349 241C459 339 527 345 764 208" />
            <path d="M-120 338C55 207 254 213 376 318C495 421 571 419 790 294" />
            <path d="M-133 429C69 274 270 286 402 398C531 507 612 505 812 393" />
            <path d="M-151 527C65 370 294 374 431 488C571 604 655 597 835 495" />
            <path d="M-170 634C61 471 305 475 459 596C614 718 709 700 861 613" />
          </svg>
          <svg className={styles.premiumTrack} viewBox="0 0 680 760" fill="none">
            <path d="M480 -30C503 99 426 137 386 224C331 344 489 386 427 492C381 570 288 589 307 790" />
            <circle cx="466" cy="72" r="10" /><circle cx="398" cy="205" r="10" /><circle cx="414" cy="348" r="10" /><circle cx="421" cy="493" r="10" /><circle cx="331" cy="632" r="10" />
            <g className={styles.premiumGates}>
              <g transform="translate(426 108) rotate(17)"><line x1="-34" y1="-48" x2="-34" y2="48" /><line x1="34" y1="-48" x2="34" y2="48" /><rect x="-34" y="-28" width="68" height="26" /></g>
              <g transform="translate(373 248) rotate(-13)"><line x1="-34" y1="-48" x2="-34" y2="48" /><line x1="34" y1="-48" x2="34" y2="48" /><rect x="-34" y="-28" width="68" height="26" /></g>
              <g transform="translate(443 389) rotate(14)"><line x1="-34" y1="-48" x2="-34" y2="48" /><line x1="34" y1="-48" x2="34" y2="48" /><rect x="-34" y="-28" width="68" height="26" /></g>
              <g transform="translate(397 532) rotate(-15)"><line x1="-34" y1="-48" x2="-34" y2="48" /><line x1="34" y1="-48" x2="34" y2="48" /><rect x="-34" y="-28" width="68" height="26" /></g>
              <g transform="translate(307 668) rotate(12)"><line x1="-34" y1="-48" x2="-34" y2="48" /><line x1="34" y1="-48" x2="34" y2="48" /><rect x="-34" y="-28" width="68" height="26" /></g>
            </g>
          </svg>
          <span className={styles.premiumVertical}>SNOW · FUN · FRIENDS</span>
        </div>
      </div>

      <span className={styles.premiumClubAnchor} id="premium-club" />
      <span className={styles.premiumContactAnchor} id="premium-contact" />
    </section>
    {events.length ? <section className={styles.premiumEventsList} id="premium-event" aria-labelledby="all-events-title">
      <div className={styles.premiumEventsListHead}>
        <h2 id="all-events-title">Veranstaltungen 2026/27</h2>
      </div>
      <div className={styles.premiumEventRows}>{events.map((item, index) => <article className={styles.premiumEventRow} key={item.id}>
        <div className={styles.premiumEventRowImage}>{item.imageUrl ? <img src={previewAssetUrl(item.imageUrl)} alt="" style={{ objectPosition: item.imagePosition }} /> : <span>{String(index + 1).padStart(2, "0")}</span>}</div>
        <div className={styles.premiumEventRowMain}><span><i className={item.status === "Anmeldung geschlossen" ? styles.premiumStatusClosed : styles.premiumStatusOpen} />{item.status}</span><h3>{item.title}</h3></div>
        <div className={styles.premiumEventRowFacts}><span><CalendarDays aria-hidden="true" />{item.dateLong}</span><span><MapPin aria-hidden="true" />{item.place}</span>{item.showSpots !== false && item.spots !== undefined ? <span><Users aria-hidden="true" />{item.spots} Plätze frei</span> : null}</div>
        <Link href={`/design-vorschau/${light ? "premium-termin-hell" : "premium-termin"}?event=${item.id}`} aria-label={`${item.title} ansehen`}><span>Termin ansehen</span><ArrowUpRight aria-hidden="true" /></Link>
      </article>)}</div>
    </section> : null}
    <PremiumHomeSponsors sponsors={sponsors} />
    <PremiumHomeClosing homeHref={homeHref} />
  </main>;
}

function PremiumAlpineMotif() {
  return <div className={styles.premiumSubMotif} aria-hidden="true">
    <span className={styles.premiumSeason}>26<span>/</span>27</span>
    <span className={styles.premiumVertical}>SNOW · FUN · FRIENDS</span>
    <svg className={styles.premiumContours} viewBox="0 0 680 760" fill="none">
      <path d="M-40 115C87 28 214 43 300 132C391 226 450 238 720 80" />
      <path d="M-70 185C77 81 230 91 323 181C418 274 489 284 743 135" />
      <path d="M-100 258C69 137 242 146 349 241C459 339 527 345 764 208" />
      <path d="M-120 338C55 207 254 213 376 318C495 421 571 419 790 294" />
      <path d="M-133 429C69 274 270 286 402 398C531 507 612 505 812 393" />
      <path d="M-151 527C65 370 294 374 431 488C571 604 655 597 835 495" />
      <path d="M-170 634C61 471 305 475 459 596C614 718 709 700 861 613" />
    </svg>
    <svg className={styles.premiumTrack} viewBox="0 0 680 760" fill="none">
      <path d="M480 -30C503 99 426 137 386 224C331 344 489 386 427 492C381 570 288 589 307 790" />
      <circle cx="466" cy="72" r="10" /><circle cx="398" cy="205" r="10" /><circle cx="414" cy="348" r="10" /><circle cx="421" cy="493" r="10" /><circle cx="331" cy="632" r="10" />
      <g className={styles.premiumGates}>
        <g transform="translate(426 108) rotate(17)"><line x1="-34" y1="-48" x2="-34" y2="48" /><line x1="34" y1="-48" x2="34" y2="48" /><rect x="-34" y="-28" width="68" height="26" /></g>
        <g transform="translate(373 248) rotate(-13)"><line x1="-34" y1="-48" x2="-34" y2="48" /><line x1="34" y1="-48" x2="34" y2="48" /><rect x="-34" y="-28" width="68" height="26" /></g>
        <g transform="translate(443 389) rotate(14)"><line x1="-34" y1="-48" x2="-34" y2="48" /><line x1="34" y1="-48" x2="34" y2="48" /><rect x="-34" y="-28" width="68" height="26" /></g>
        <g transform="translate(397 532) rotate(-15)"><line x1="-34" y1="-48" x2="-34" y2="48" /><line x1="34" y1="-48" x2="34" y2="48" /><rect x="-34" y="-28" width="68" height="26" /></g>
        <g transform="translate(307 668) rotate(12)"><line x1="-34" y1="-48" x2="-34" y2="48" /><line x1="34" y1="-48" x2="34" y2="48" /><rect x="-34" y="-28" width="68" height="26" /></g>
      </g>
    </svg>
  </div>;
}

function PremiumSponsorsPage({ sponsors }: { sponsors: Sponsor[] }) {
  return <main className={`${styles.premiumPage} ${styles.premiumSubPage}`} id="preview-main">
    <section className={styles.premiumSubHero} aria-labelledby="sponsors-title">
      <PremiumSiteHeader active="sponsors" />
      <div className={styles.premiumSubHeroContent} data-enter>
        <div>
          <p className={styles.premiumEyebrow}><span /> Partner des Schiteam Julbach</p>
          <h1 id="sponsors-title">Gemeinsam.<br /><em>Stärker.</em></h1>
          <p>Unsere Partner unterstützen den Nachwuchs, den Wintersport und das Vereinsleben in Julbach.</p>
        </div>
        <PremiumAlpineMotif />
      </div>
    </section>
    <section className={styles.premiumSponsorSection} aria-labelledby="partner-title">
      <div className={`${styles.premiumSectionTitle} ${styles.premiumSponsorHeading}`}>
        <h2 id="partner-title">Unsere Sponsoren</h2>
        <span>Danke an unsere Partner, die den Sport und die Gemeinschaft im Schiteam Julbach möglich machen.</span>
      </div>
      {sponsors.length ? <div className={styles.premiumSponsorGrid}>{sponsors.map((sponsor) => <article className={`${styles.premiumSponsorCard} ${sponsorCardClass(sponsor.name)}`} key={sponsor.id}>
        <div className={styles.premiumSponsorLogoStage}>{sponsor.logoUrl ? <img className={sponsorLogoClass(sponsor.name)} src={previewAssetUrl(sponsor.logoUrl)} alt={`Logo von ${sponsor.name}`} /> : <strong>{sponsor.name}</strong>}</div>
      </article>)}</div> : <p className={styles.premiumDataEmpty}>Die Sponsoren werden automatisch aus dem Adminbereich übernommen.</p>}
    </section>
  </main>;
}

function sponsorLogoClass(name: string) {
  const normalized = name.toLocaleLowerCase("de-AT");
  if (normalized.includes("schiteam")) return styles.premiumSponsorLogoSchiteam;
  if (normalized.includes("kame")) return styles.premiumSponsorLogoKame;
  return styles.premiumSponsorLogoDefault;
}

function sponsorCardClass(name: string) {
  const normalized = name.toLocaleLowerCase("de-AT");
  if (normalized.includes("schiteam")) return styles.premiumSponsorCardSchiteam;
  if (normalized.includes("kame")) return styles.premiumSponsorCardKame;
  return styles.premiumSponsorCardDefault;
}

function boardInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toLocaleUpperCase("de-AT")).join("");
}

function PremiumAboutPage({ board }: { board: BoardMember[] }) {
  return <main className={`${styles.premiumPage} ${styles.premiumSubPage} ${styles.premiumLightAbout}`} id="preview-main">
    <section className={`${styles.premiumSubHero} ${styles.premiumAboutHero}`} aria-labelledby="about-title">
      <PremiumSiteHeader active="about" />
      <div className={styles.premiumSubHeroContent} data-enter>
        <div>
          <p className={styles.premiumEyebrow}><span /> Vorstand · Schiteam Julbach</p>
          <h1 id="about-title">Menschen.<br /><em>Für den Verein.</em></h1>
          <p>Der Vorstand organisiert den Verein und gestaltet Training, Nachwuchsarbeit und gemeinsame Ausfahrten.</p>
        </div>
        <PremiumAlpineMotif />
      </div>
    </section>
    <section className={styles.premiumBoardSection} aria-labelledby="board-preview-title">
      <div className={styles.premiumSectionTitle}>
        <p>Vorstand 2026/27</p>
        <h2 id="board-preview-title">Verantwortung im Team.</h2>
      </div>
      {board.length ? <div className={styles.premiumBoardGrid}>{board.map((member, index) => <article className={styles.premiumBoardCard} key={member.id}>
        <div className={styles.premiumBoardPhoto}>
          <div className={styles.premiumBoardInitial} aria-hidden="true">{boardInitials(member.name)}</div>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div className={styles.premiumBoardIdentity}><b>{member.role}</b><strong>{member.name}</strong></div>
        </div>
        {member.qualifications?.length ? <ul>{member.qualifications.map((qualification) => <li key={qualification}><Medal aria-hidden="true" />{qualification}</li>)}</ul> : <p>Organisation und Vereinsarbeit</p>}
      </article>)}</div> : <p className={styles.premiumDataEmpty}>Der Vorstand wird automatisch aus dem Adminbereich übernommen.</p>}
    </section>
  </main>;
}

function PremiumEventPage({ event, light = false }: { event: EventItem; light?: boolean }) {
  const disabled = ["Ausgebucht", "Anmeldung geschlossen", "Anmeldung startet bald"].includes(event.status);
  const homeHref = light ? "/design-vorschau/premium-startseite-hell" : "/design-vorschau/premium-hero";
  return <main className={`${styles.premiumPage} ${styles.premiumEventDetailPage} ${light ? styles.premiumLightEvent : ""}`} id="preview-main">
    <section className={styles.premiumEventDetailHero} aria-labelledby="event-detail-title">
      <PremiumSiteHeader active="home" homeHref={homeHref} />
      <div className={styles.premiumEventDetailGrid} data-enter>
        <div className={styles.premiumEventDetailCopy}>
          <Link href={homeHref} className={styles.premiumBackLink}>← Alle Veranstaltungen</Link>
          <p className={styles.premiumEyebrow}><span /> {event.status}</p>
          <h1 id="event-detail-title">{event.title}</h1>
          <p>{event.description || "Gemeinsam in den Schnee – mit Freude, Bewegung und einem starken Team."}</p>
          <div className={styles.premiumEventKeyFacts}>
            <span><CalendarDays aria-hidden="true" /><small>Termin</small><strong>{event.dateLong}</strong></span>
            <span><MapPin aria-hidden="true" /><small>Treffpunkt</small><strong>{event.place}</strong></span>
          </div>
        </div>
        <figure className={styles.premiumEventDetailImage}>
          <img src={previewAssetUrl(event.imageUrl || "/schiteam-momente.jpeg")} alt={`Schiteam Julbach bei ${event.title}`} style={{ objectPosition: event.imagePosition }} />
          <span>26/27</span>
        </figure>
      </div>
    </section>
    <section className={styles.premiumEventInformation} aria-labelledby="event-information-title">
      <div className={styles.premiumEventInformationMain}>
        <p>Veranstaltungsinfo</p>
        <h2 id="event-information-title">{event.detailHeading || "Gemeinsam besser Ski fahren."}</h2>
        <div className={styles.premiumEventLead}>{event.description || "Alle wichtigen Informationen zum Ablauf, zur Ausrüstung und zur gemeinsamen Anreise findest du direkt hier."}</div>
        <ul>{(event.info.length ? event.info : ["Gemeinsame Anreise und Betreuung durch das Schiteam", "Weitere Informationen folgen rechtzeitig vor dem Termin"]).map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>
      </div>
      <aside className={styles.premiumRegistrationCard}>
        <span>Anmeldung</span>
        <h2>{disabled ? "Anmeldung derzeit geschlossen" : "Deinen Platz sichern."}</h2>
        <p>{disabled ? "Sobald die Anmeldung startet, wird der Button automatisch freigeschaltet." : event.showSpots === false || event.spots === undefined ? "Die Anmeldung ist jetzt möglich." : `Noch ${event.spots} Plätze verfügbar.`}</p>
        {disabled ? <button disabled>Noch nicht verfügbar<ArrowRight aria-hidden="true" /></button> : <Link className={styles.premiumRegistrationAction} href={`/design-vorschau/${light ? "premium-anmeldung-hell" : "premium-anmeldung"}?event=${event.id}`}>Jetzt anmelden<ArrowRight aria-hidden="true" /></Link>}
        <small><Clock3 aria-hidden="true" /> Die Anmeldung dauert etwa 2 Minuten.</small>
      </aside>
    </section>
  </main>;
}

function PremiumSignupPage({ event, light = false }: { event: EventItem; light?: boolean }) {
  const homeHref = light ? "/design-vorschau/premium-startseite-hell" : "/design-vorschau/premium-hero";
  return <main className={`${styles.premiumSignupPage} ${light ? styles.premiumLightSignup : ""}`} id="preview-main">
    <header className={styles.premiumSignupHeader}>
      <Link className={styles.premiumLogo} href={homeHref} aria-label="Schiteam Julbach Startseite"><img src="/schiteam-logo.png" alt="Schiteam Union Julbach" /></Link>
      <Link href={`/design-vorschau/${light ? "premium-termin-hell" : "premium-termin"}?event=${event.id}`}>← Zurück zur Veranstaltung</Link>
      <span>Sichere Anmeldung · Saison 2026/27</span>
    </header>
    <div className={styles.premiumSignupLayout}>
      <aside className={styles.premiumSignupSummary}>
        <p>Anmeldung</p>
        <h1>{event.title}</h1>
        <div>
          <span><CalendarDays aria-hidden="true" /><small>Termin</small><strong>{event.dateLong}</strong></span>
          <span><MapPin aria-hidden="true" /><small>Ort</small><strong>{event.place}</strong></span>
          {event.showSpots !== false && event.spots !== undefined ? <span><Users aria-hidden="true" /><small>Verfügbarkeit</small><strong>{event.spots} Plätze frei</strong></span> : null}
        </div>
        <figure><img src={previewAssetUrl(event.imageUrl || "/schiteam-momente.jpeg")} alt="" style={{ objectPosition: event.imagePosition }} /></figure>
      </aside>
      <form className={styles.premiumSignupForm}>
        <div className={styles.premiumSignupIntro}>
          <p>Online-Anmeldung</p>
          <h2>Teilnehmerdaten eingeben.</h2>
          <span>Alle mit * gekennzeichneten Felder sind erforderlich.</span>
        </div>
        {event.registrationInfo ? <div className={styles.premiumSignupNotice}><strong>Gut zu wissen</strong><p>{event.registrationInfo}</p></div> : null}
        <fieldset>
          <legend><span>01</span>Persönliche Angaben</legend>
          <div className={styles.premiumSignupFields}>
            <label>Vorname *<input name="firstName" autoComplete="given-name" required /></label>
            <label>Nachname *<input name="lastName" autoComplete="family-name" required /></label>
            <label>Geburtsdatum *<input name="birthDate" type="date" required /></label>
            {event.skillLevelsEnabled !== false ? <label>Könnensstufe *<select name="skill" defaultValue="" required><option value="" disabled>Bitte auswählen</option>{event.skillLevels.map((level) => <option key={level}>{level}</option>)}</select></label> : null}
            <label>ÖSV-Mitglied bei anderem Verein? *<select name="osvMember" defaultValue="" required><option value="" disabled>Bitte auswählen</option><option>Ja</option><option>Nein</option></select></label>
          </div>
        </fieldset>
        <fieldset>
          <legend><span>02</span>Adresse und Kontakt</legend>
          <div className={styles.premiumSignupFields}>
            <label className={styles.premiumSignupWide}>Straße und Hausnummer *<input name="address" autoComplete="street-address" required /></label>
            <label>PLZ *<input name="postalCode" autoComplete="postal-code" required /></label>
            <label>Ort *<input name="city" autoComplete="address-level2" required /></label>
            <label>E-Mail *<input name="email" type="email" autoComplete="email" required /></label>
            <label>Telefonnummer *<input name="phone" type="tel" autoComplete="tel" required /></label>
            <label className={styles.premiumSignupWide}>Anmerkung<textarea name="note" rows={4} /></label>
          </div>
        </fieldset>
        <div className={styles.premiumSignupSubmit}>
          <label><input type="checkbox" required /> <span>Ich stimme der Verarbeitung meiner Daten zur Durchführung der Veranstaltung zu. *</span></label>
          <button type="button">Anmeldung absenden<ArrowRight aria-hidden="true" /></button>
          <small>Du erhältst anschließend eine Bestätigung per E-Mail.</small>
        </div>
      </form>
    </div>
  </main>;
}

function PremiumAdminPage({ data, light = false }: { data: PublicPlatform; light?: boolean }) {
  const event = data.events[0];
  return <main className={`${styles.premiumAdminPage} ${light ? styles.premiumLightAdmin : ""}`} id="preview-main">
    <aside className={styles.premiumAdminSidebar}>
      <Link href={light ? "/design-vorschau/premium-startseite-hell" : "/design-vorschau/premium-hero"} className={styles.premiumAdminLogo}><img src="/schiteam-logo.png" alt="Schiteam Union Julbach" /></Link>
      <nav aria-label="Admin Navigation">
        <a className={styles.premiumAdminActive} href="#admin-overview"><LayoutDashboard aria-hidden="true" />Übersicht</a>
        <a href="#admin-events"><CalendarDays aria-hidden="true" />Veranstaltungen</a>
        <a href="#admin-people"><Users aria-hidden="true" />Anmeldungen</a>
        <a href="#admin-mails"><Mail aria-hidden="true" />E-Mails</a>
        <a href="#admin-settings"><Settings aria-hidden="true" />Einstellungen</a>
      </nav>
      <div className={styles.premiumAdminSeason}><Snowflake aria-hidden="true" /><span><small>Aktive Saison</small>2026/27</span></div>
    </aside>
    <div className={styles.premiumAdminWorkspace}>
      <header className={styles.premiumAdminTopbar}>
        <label><Search aria-hidden="true" /><input aria-label="Im Adminbereich suchen" placeholder="Suchen …" /></label>
        <span className={styles.premiumAdminUser}><b>LN</b><span><strong>Schiteam Julbach</strong><small>Administrator</small></span></span>
      </header>
      <div className={styles.premiumAdminContent} id="admin-overview">
        <div className={styles.premiumAdminHeading}>
          <div><p>Donnerstag, 12. November</p><h1>Guten Tag, Schiteam.</h1><span>Hier ist der aktuelle Stand der Saison 2026/27.</span></div>
          <button><Plus aria-hidden="true" />Veranstaltung anlegen</button>
        </div>
        <section className={styles.premiumAdminStats} aria-label="Saisonkennzahlen">
          <article><span>Veranstaltungen</span><strong>{String(data.events.length).padStart(2, "0")}</strong><small>{data.events.filter((item) => item.status === "Anmeldung offen" || item.status === "Warteliste").length} derzeit aktiv</small></article>
          <article><span>Freie Plätze</span><strong>{data.events.reduce((sum, item) => sum + (item.showSpots === false ? 0 : item.spots || 0), 0)}</strong><small>über alle Termine</small></article>
          <article><span>Partner</span><strong>{String(data.sponsors.length).padStart(2, "0")}</strong><small>auf der Website sichtbar</small></article>
        </section>
        <div className={styles.premiumAdminColumns}>
          <section className={styles.premiumAdminPanel} id="admin-events">
            <div className={styles.premiumAdminPanelHead}><div><span>Nächste Termine</span><h2>Veranstaltungen</h2></div><button>Alle ansehen <ArrowUpRight aria-hidden="true" /></button></div>
            <div className={styles.premiumAdminEventRows}>{data.events.slice(0, 4).map((item) => <article key={item.id}>
              <time>{item.date}</time><div><strong>{item.title}</strong><span><MapPin aria-hidden="true" />{item.place}</span></div><em>{item.status}</em><button aria-label={`${item.title} öffnen`}><ArrowUpRight aria-hidden="true" /></button>
            </article>)}</div>
          </section>
          <aside className={styles.premiumAdminPanel}>
            <div className={styles.premiumAdminPanelHead}><div><span>Schnellzugriff</span><h2>{event?.title || "Neue Veranstaltung"}</h2></div></div>
            <div className={styles.premiumAdminQuickLinks}>
              <button><Users aria-hidden="true" /><span><strong>Anmeldungen verwalten</strong><small>Teilnehmer und Warteliste</small></span><ArrowRight aria-hidden="true" /></button>
              <button><Eye aria-hidden="true" /><span><strong>Vorschau öffnen</strong><small>Öffentliche Terminseite</small></span><ArrowRight aria-hidden="true" /></button>
              <button><Download aria-hidden="true" /><span><strong>Liste exportieren</strong><small>Excel-Datei herunterladen</small></span><ArrowRight aria-hidden="true" /></button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </main>;
}

export function DesignPreview({ variant, data }: { variant: DesignVariant; data: PublicPlatform }) {
  if (variant === "premium-admin-hell") return <PremiumAdminPage data={data} light />;
  if (variant === "premium-admin") return <PremiumAdminPage data={data} />;
  if (variant === "premium-anmeldung-hell") return data.events[0] ? <PremiumSignupPage event={data.events[0]} light /> : <main className={styles.noEvents}><h1>Keine veröffentlichte Veranstaltung</h1></main>;
  if (variant === "premium-anmeldung") return data.events[0] ? <PremiumSignupPage event={data.events[0]} /> : <main className={styles.noEvents}><h1>Keine veröffentlichte Veranstaltung</h1></main>;
  if (variant === "premium-termin-hell") return data.events[0] ? <PremiumEventPage event={data.events[0]} light /> : <main className={styles.noEvents}><h1>Keine veröffentlichte Veranstaltung</h1></main>;
  if (variant === "premium-termin") return data.events[0] ? <PremiumEventPage event={data.events[0]} /> : <main className={styles.noEvents}><h1>Keine veröffentlichte Veranstaltung</h1></main>;
  if (variant === "premium-sponsoren") return <PremiumSponsorsPage sponsors={data.sponsors} />;
  if (variant === "premium-ueber-uns") return <PremiumAboutPage board={data.board} />;
  const event = data.events[0];
  if (!event) return <main className={styles.noEvents}><h1>Keine veröffentlichte Veranstaltung</h1><p>Die Designvorschau übernimmt automatisch die veröffentlichten Termine der Homepage.</p></main>;
  if (variant === "premium-startseite-hell") return <PremiumHero events={data.events} sponsors={data.sponsors} light />;
  if (variant === "premium-hero") return <PremiumHero events={data.events} sponsors={data.sponsors} />;
  return <div className={styles.page}><PreviewLabel variant={variant} /><Header /><main id="preview-main">{variant === "pistenstart" ? <Pistenstart event={event} sponsors={data.sponsors} /> : variant === "naechster-termin" ? <NextEvent event={event} events={data.events} sponsors={data.sponsors} /> : <ClubStory event={event} sponsors={data.sponsors} />}</main><Footer /></div>;
}
