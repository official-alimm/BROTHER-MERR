(() => {
  const cfg = window.INVITATION_CONFIG || {};
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  // Mobile navigation
  const menuButton = $(".menu-toggle");
  const nav = $(".nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const opened = nav.classList.toggle("nav-open");
      menuButton.setAttribute("aria-expanded", String(opened));
      menuButton.textContent = opened ? "×" : "☰";
    });
    $$(".nav a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("nav-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "☰";
    }));
  }

  // Shared music control. Browsers require a guest interaction before playback.

const audio = $("#site-music");
const musicButtons = $$(".music-toggle");

if (audio) {
  audio.src = cfg.musicPath || "music/engagement.mp3";
  audio.volume = 0.55;
  audio.autoplay = true;

  const paintMusic = () => musicButtons.forEach(btn => {
    btn.classList.toggle("is-playing", !audio.paused);

    const label = $(".music-label", btn);
    if (label) {
      label.textContent = audio.paused
        ? "Play our music"
        : "Pause music";
    }

    const icon = $(".music-icon", btn);
    if (icon) icon.textContent = audio.paused ? "♫" : "Ⅱ";
  });

  // Try autoplay when the page opens
  audio.play().catch(() => {
    // Autoplay may be blocked by the browser
    paintMusic();
  });

  // Play/Pause button
  musicButtons.forEach(btn =>
    btn.addEventListener("click", async () => {
      if (audio.paused) {
        try {
          await audio.play();
        } catch {
          alert(
            "Please check that music/engagement.mp3 exists and is a supported audio file."
          );
        }
      } else {
        audio.pause();
      }

      paintMusic();
    })
  );

  audio.addEventListener("play", paintMusic);
  audio.addEventListener("pause", paintMusic);

  paintMusic();
}

  // Countdown
  const countdown = $("#countdown");
  if (countdown) {
    const target = new Date(cfg.eventDate || "2026-10-22T19:00:00+05:30").getTime();
    const updateCountdown = () => {
      let diff = Math.max(0, target - Date.now());
      const units = {
        days: Math.floor(diff / 86400000),
        hours: Math.floor(diff / 3600000) % 24,
        minutes: Math.floor(diff / 60000) % 60,
        seconds: Math.floor(diff / 1000) % 60
      };
      Object.entries(units).forEach(([key, value]) => {
        const el = $(`[data-unit="${key}"]`, countdown);
        if (el) el.textContent = String(value).padStart(2, "0");
      });
    };
    updateCountdown(); setInterval(updateCountdown, 1000);
  }

  // Calendar download
  const calendarButton = $("#calendar-btn");
  if (calendarButton) calendarButton.addEventListener("click", () => {
    const start = new Date(cfg.eventDate || "2026-10-22T19:00:00+05:30");
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    const fmt = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const ics = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Sahil and Tasleema//Invitation//EN","BEGIN:VEVENT",`DTSTART:${fmt(start)}`,`DTEND:${fmt(end)}`,"SUMMARY:Sahil & Tasleema Engagement",`LOCATION:${cfg.venue || "Najan, Kashmir"}`,"DESCRIPTION:Join us to celebrate Sahil & Tasleema.","END:VEVENT","END:VCALENDAR"].join("\r\n");
    const blob = new Blob([ics], {type:"text/calendar;charset=utf-8"});
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = "Sahil-Tasleema-Engagement.ics"; a.click(); URL.revokeObjectURL(url);
  });

  // Gallery upload preview and lightbox
  const photoInput = $("#photo-input"), gallery = $("#gallery-grid"), lightbox = $("#lightbox"), lightboxImage = $("#lightbox-image");
  if (photoInput && gallery) {
    photoInput.addEventListener("change", () => {
      [...photoInput.files].forEach(file => {
        if (!file.type.startsWith("image/")) return;
        const url = URL.createObjectURL(file);
        const button = document.createElement("button");
        button.className = "gallery-tile uploaded-photo"; button.type = "button";
        const img = document.createElement("img"); img.src = url; img.alt = file.name;
        const caption = document.createElement("span"); caption.className = "photo-caption"; caption.textContent = file.name;
        button.append(img, caption); gallery.prepend(button);
        button.addEventListener("click", () => { if (lightbox && lightboxImage) { lightboxImage.src = url; lightbox.classList.add("show"); lightbox.setAttribute("aria-hidden","false"); }});
      });
    });
    $$(".placeholder-tile", gallery).forEach(tile => tile.addEventListener("click", () => photoInput.click()));
  }
  if (lightbox) {
    const close = () => { lightbox.classList.remove("show"); lightbox.setAttribute("aria-hidden","true"); };
    $(".lightbox-close", lightbox)?.addEventListener("click", close);
    lightbox.addEventListener("click", e => { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }

  // Local demo guestbook: stored only in this browser/device.
  const wishForm = $("#wish-form"), wishList = $("#wish-list");
  const loadWishes = () => { try { return JSON.parse(localStorage.getItem("st-invitation-wishes") || "[]"); } catch { return []; } };
  const renderWishes = () => {
    if (!wishList) return;
    const wishes = loadWishes();
    wishList.replaceChildren();
    if (!wishes.length) {
      const p = document.createElement("p"); p.className = "empty-state"; p.textContent = "Your first wish will be displayed here. ✦"; wishList.append(p); return;
    }
    wishes.slice().reverse().forEach(w => {
      const card = document.createElement("article"); card.className = "wish-card";
      const mark = document.createElement("span"); mark.className = "wish-mark"; mark.textContent = "✦";
      const h = document.createElement("h3"); h.textContent = w.name;
      const p = document.createElement("p"); p.textContent = w.message;
      card.append(mark, h, p); wishList.append(card);
    });
  };
  if (wishForm) {
    renderWishes();
    wishForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = $("#wish-name").value.trim(), message = $("#wish-message").value.trim();
      if (!name || !message) return;
      const wishes = loadWishes(); wishes.push({name, message, createdAt: Date.now()});
      try { localStorage.setItem("st-invitation-wishes", JSON.stringify(wishes.slice(-50))); } catch {}
      wishForm.reset(); renderWishes(); alert("Your wish has been saved in this browser.");
    });
  }

  // RSVP via WhatsApp
  const rsvpForm = $("#rsvp-form");
  if (rsvpForm) rsvpForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#guest-name").value.trim(), attendance = $("#attendance").value;
    const count = $("#guest-count").value, note = $("#guest-note").value.trim();
    const number = (cfg.whatsappNumber || "").replace(/\D/g, "");
    const message = `Sahil & Tasleema Engagement RSVP%0AName: ${encodeURIComponent(name)}%0AResponse: ${encodeURIComponent(attendance)}%0AGuests: ${encodeURIComponent(count)}%0AMessage: ${encodeURIComponent(note || "—")}`;
    if (!number) {
      alert("First add the family's WhatsApp number in config.js (whatsappNumber). Then try again.");
      return;
    }
    window.open(`https://wa.me/${number}?text=${message}`, "_blank", "noopener");
  });

  // Reveal effects
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    }), {threshold: 0.12});
    revealItems.forEach(el => observer.observe(el));
  } else revealItems.forEach(el => el.classList.add("visible"));
})();