/* ---------------------------------------------------
   CollegeCard — Phase 3: temporary persistence
   Architecture: Form -> JavaScript -> localStorage -> Profile page

   Everything the student enters is stored as ONE JSON object under a
   single key. This mirrors how the "students" table will look in
   Phase 5 (SQLite) - id, name, college, branch, year, bio, skills,
   github, linkedin, instagram, createdAt - so moving to a real
   database later is mostly a matter of swapping where this object
   is written and read.
--------------------------------------------------- */

const CollegeCard = (() => {
  const STORAGE_KEY = 'collegecard_profile';

  function save(profile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (err) {
      // Corrupted data shouldn't crash the page - treat it as "no profile".
      console.error('CollegeCard: could not parse saved profile', err);
      return null;
    }
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function makeId() {
    // Simple placeholder ID. Phase 5+ will use a real DB-assigned id
    // and Phase 7 will turn this into a chosen username like /u/vivek.
    return 'CC-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  function escape(str) {
    // Minimal HTML-escaping so profile text can't break the page
    // markup (a taste of the input-validation habits Phase 13 covers).
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  return { save, load, clear, makeId, escape };
})();