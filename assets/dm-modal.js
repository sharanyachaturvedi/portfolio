/* ══════════════════════════════════════════════════════════════
   DM MODAL — shared "Let's talk" + "Request resumé" popup.
   Injects its own CSS + HTML, then binds every CTA on the page:
   - anchors whose text starts with "Let's talk" / "Send me an email" / "Connect" → talk mode
   - anchors reading "Resume (PDF)" → resumé mode
   Include with:  <script src="assets/dm-modal.js" defer></script>   (root page)
                  <script src="../assets/dm-modal.js" defer></script> (case-study pages)
══════════════════════════════════════════════════════════════ */
(function () {
  var EMAIL = 'chaturvedisharanya@gmail.com';          // shown in "or email me directly" links
  var FORM_ID = '805b4aa7ad8864f98f4e6704a33f8d38';    // FormSubmit privacy alias for the same inbox

  var css = '\
#dm-overlay { position:fixed; inset:0; z-index:90; background:rgba(6,6,10,0.8); backdrop-filter:blur(12px); display:none; align-items:center; justify-content:center; padding:16px; }\
#dm-overlay.open { display:flex; }\
#dm-modal { width:min(500px, 100%); max-height:96vh; overflow-y:auto; scrollbar-width:none; background:linear-gradient(180deg,#12121f 0%,#0e0e1a 100%); border:1px solid rgba(255,255,255,0.1); border-radius:24px; padding:26px 28px 24px; position:relative; box-shadow:0 24px 80px rgba(0,0,0,0.65), 0 0 80px rgba(255,107,157,0.07); animation:dmIn .35s cubic-bezier(0.16,1,0.3,1); font-family:Inter,Arial,sans-serif; }\
#dm-modal::-webkit-scrollbar { display:none; }\
#dm-modal::before { content:""; position:absolute; top:0; left:0; right:0; height:130px; background:radial-gradient(ellipse 75% 100% at 50% 0%, rgba(255,107,157,0.12) 0%, transparent 70%); pointer-events:none; border-radius:24px 24px 0 0; }\
@keyframes dmIn { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:none; } }\
#dm-modal h3 { font-family:"Instrument Serif",Georgia,serif; font-weight:400; font-size:24px; color:#f3f4f6; margin:0 0 4px; }\
.dm-sub { font-size:13px; color:#6b7280; margin:0 0 20px; }\
.dm-field { margin-bottom:12px; }\
.dm-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }\
@media (max-width:480px){ .dm-row { grid-template-columns:1fr; } }\
.dm-input { width:100%; box-sizing:border-box; background:rgba(10,10,14,0.8); border:1px solid rgba(255,255,255,0.1); border-radius:11px; padding:10px 13px; font-size:13px; color:#e5e7eb; outline:none; transition:border-color .2s, box-shadow .2s; font-family:inherit; }\
.dm-input:focus { border-color:rgba(255,107,157,0.55); box-shadow:0 0 0 3px rgba(255,107,157,0.08); }\
.dm-input::placeholder { color:#4b5563; }\
select.dm-input { appearance:none; background-image:url("data:image/svg+xml,%3Csvg width=\'12\' height=\'12\' viewBox=\'0 0 16 16\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M4 6l4 4 4-4\' stroke=\'%236b7280\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 13px center; padding-right:36px; cursor:pointer; }\
select.dm-input option { background:#0e0e1a; color:#e5e7eb; }\
.dm-label { display:block; font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#6b7280; margin-bottom:5px; }\
.dm-label .opt { text-transform:none; font-weight:500; color:#4b5563; }\
.dm-tabs { display:flex; gap:4px; background:rgba(10,10,14,0.8); border:1px solid rgba(255,255,255,0.08); border-radius:9999px; padding:4px; margin:0 40px 20px 0; position:relative; z-index:1; }\
.dm-tab { flex:1; padding:9px 8px; border-radius:9999px; border:none; background:transparent; color:#8b93a1; font-size:12px; font-weight:700; cursor:pointer; transition:all .25s; font-family:inherit; }\
.dm-tab.on { background:linear-gradient(135deg, rgba(255,107,157,0.18), rgba(150,46,255,0.14)); color:#FF6B9D; box-shadow:inset 0 0 0 1px rgba(255,107,157,0.35); }\
.dm-submit { width:100%; background:#fff; color:#000; font-size:14px; font-weight:700; padding:12px; border:none; border-radius:12px; cursor:pointer; margin-top:6px; transition:background .2s; font-family:inherit; }\
.dm-submit:hover { background:#e5e7eb; }\
.dm-submit:disabled { opacity:.6; cursor:wait; }\
.dm-alt { font-size:11px; color:#6b7280; text-align:center; margin:12px 0 0; }\
.dm-alt a { color:#9ca3af; text-decoration:underline; text-decoration-color:rgba(255,255,255,0.2); text-underline-offset:2px; transition:color .2s; }\
.dm-alt a:hover { color:#FF6B9D; }\
#dm-close { position:absolute; top:16px; right:16px; width:32px; height:32px; border-radius:9999px; border:1px solid rgba(255,255,255,0.1); background:transparent; color:#6b7280; cursor:pointer; z-index:2; transition:all .2s; font-size:13px; }\
#dm-close:hover { color:#fff; border-color:rgba(255,255,255,0.3); }\
.dm-pane { position:relative; z-index:1; }\
.dm-hidden { display:none; }\
#dm-success { text-align:center; padding:40px 0; }\
#dm-success .dm-spark { font-size:44px; margin-bottom:18px; }\
#dm-success p { font-size:14px; color:#9ca3af; max-width:280px; margin:8px auto 0; line-height:1.6; }\
#dm-error { font-size:12px; color:#fb7185; margin:14px 0 0; line-height:1.6; position:relative; z-index:1; }\
#dm-error a { color:#fb7185; text-decoration:underline; }';

  var html = '\
<div id="dm-overlay" role="dialog" aria-modal="true" aria-labelledby="dm-title">\
  <div id="dm-modal">\
    <button id="dm-close" aria-label="Close">✕</button>\
    <div class="dm-tabs">\
      <button class="dm-tab on" data-mode="talk">👋 Say hello</button>\
      <button class="dm-tab" data-mode="resume">📄 Request resumé</button>\
    </div>\
    <div id="dm-talk" class="dm-pane">\
      <h3 id="dm-title">Slide into my inbox</h3>\
      <p class="dm-sub">No forms-y nonsense — this lands straight in my email.</p>\
      <form id="dm-talk-form">\
        <div class="dm-row dm-field">\
          <div><label class="dm-label" for="dm-name">Name *</label><input class="dm-input" id="dm-name" name="name" type="text" required placeholder="Your good name"></div>\
          <div><label class="dm-label" for="dm-phone">Phone <span class="opt">(optional)</span></label><input class="dm-input" id="dm-phone" name="phone" type="tel" value="+91 "></div>\
        </div>\
        <div class="dm-field"><label class="dm-label" for="dm-email">Email *</label><input class="dm-input" id="dm-email" name="email" type="email" required placeholder="you@somewhere.com"></div>\
        <div class="dm-field"><label class="dm-label" for="dm-reason">What brings you here? *</label>\
          <select class="dm-input" id="dm-reason" name="reason" required>\
            <option value="" disabled selected>Pick your poison…</option>\
            <option>Hiring a Senior PM — you clearly have great taste</option>\
            <option>Need a product consultant for my brand</option>\
            <option>Recruiter — I have a role that\'s *perfect* for you</option>\
            <option>Just want to nerd out about product over chai</option>\
            <option>Anything &amp; everything else in the world</option>\
          </select></div>\
        <div class="dm-field"><label class="dm-label" for="dm-msg">Your message *</label><textarea class="dm-input" id="dm-msg" name="message" rows="3" required placeholder="Go on, I read everything…"></textarea></div>\
        <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">\
        <button type="submit" data-label="Send it →" class="dm-submit">Send it →</button>\
        <p class="dm-alt">or email me directly at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a></p>\
      </form>\
    </div>\
    <div id="dm-resume" class="dm-pane dm-hidden">\
      <h3>Want the full resumé?</h3>\
      <p class="dm-sub">Drop your email — I\'ll send it across. And if you\'d like to know more, let\'s connect.</p>\
      <form id="dm-resume-form">\
        <div class="dm-field"><label class="dm-label" for="dm-r-email">Your email *</label><input class="dm-input" id="dm-r-email" name="email" type="email" required placeholder="you@company.com"></div>\
        <div class="dm-field"><label class="dm-label" for="dm-r-company">Company <span class="opt">(optional)</span></label><input class="dm-input" id="dm-r-company" name="company" type="text" placeholder="Where you work"></div>\
        <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">\
        <button type="submit" data-label="Request resumé →" class="dm-submit">Request resumé →</button>\
        <p class="dm-alt">or email me directly at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a></p>\
      </form>\
    </div>\
    <div id="dm-success" class="dm-pane dm-hidden">\
      <div class="dm-spark">✨</div>\
      <h3>Delivered!</h3>\
      <p id="dm-success-msg"></p>\
    </div>\
    <p id="dm-error" class="dm-hidden">Hmm, that didn\'t go through. Email me directly at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a> — old school works too.</p>\
  </div>\
</div>';

  function init() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    document.body.insertAdjacentHTML('beforeend', html);

    var overlay = document.getElementById('dm-overlay');
    var talk    = document.getElementById('dm-talk');
    var resume  = document.getElementById('dm-resume');
    var success = document.getElementById('dm-success');
    var errorEl = document.getElementById('dm-error');
    var tabs    = document.querySelectorAll('.dm-tab');

    function setMode(mode) {
      tabs.forEach(function (t) { t.classList.toggle('on', t.dataset.mode === mode); });
      talk.classList.toggle('dm-hidden', mode !== 'talk');
      resume.classList.toggle('dm-hidden', mode !== 'resume');
      success.classList.add('dm-hidden');
      errorEl.classList.add('dm-hidden');
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { setMode(t.dataset.mode); }); });

    function openModal(mode) { setMode(mode); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeModal()    { overlay.classList.remove('open'); document.body.style.overflow = ''; }

    document.getElementById('dm-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

    /* Bind CTAs by their visible text */
    document.querySelectorAll('a').forEach(function (a) {
      var label = a.textContent.trim();
      if (label.indexOf("Let's talk") === 0 || label.indexOf('Send me an email') === 0 || label === 'Connect') {
        a.addEventListener('click', function (e) { e.preventDefault(); openModal('talk'); });
      } else if (label === 'Resume (PDF)') {
        a.addEventListener('click', function (e) { e.preventDefault(); openModal('resume'); });
      }
    });

    function send(form, payload, successMsg) {
      var btn = form.querySelector('.dm-submit');
      btn.disabled = true; btn.textContent = 'Sending…';
      fetch('https://formsubmit.co/ajax/' + FORM_ID, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function () {
        talk.classList.add('dm-hidden'); resume.classList.add('dm-hidden');
        document.getElementById('dm-success-msg').textContent = successMsg;
        success.classList.remove('dm-hidden');
        form.reset();
      })
      .catch(function () { errorEl.classList.remove('dm-hidden'); })
      .finally(function () { btn.disabled = false; btn.textContent = btn.dataset.label; });
    }

    document.getElementById('dm-talk-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(this);
      var phone = (f.get('phone') || '').trim();
      send(this, {
        _subject: 'DM on Portfolio — ' + f.get('name'),
        _template: 'table',
        Name: f.get('name'),
        Email: f.get('email'),
        Phone: (phone && phone !== '+91') ? phone : '—',
        Reason: f.get('reason'),
        Message: f.get('message'),
        Page: location.pathname
      }, "It's in my inbox. I read everything — expect a reply soon.");
    });

    document.getElementById('dm-resume-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(this);
      send(this, {
        _subject: 'Resume Request — ' + (f.get('company') || f.get('email')),
        _template: 'table',
        'Requester email': f.get('email'),
        'Company': f.get('company') || '—',
        'To approve': 'Reply to ' + f.get('email') + ' with the resumé PDF attached. Ignoring this email = declining.'
      }, 'Request sent! The resumé will land in your inbox soon.');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
