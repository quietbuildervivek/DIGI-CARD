// CollegeCard — script.js
// Phase 2 starts here.
//
// First target: when the Create Profile form is submitted,
// read the input values and log a student object to the console.
//
// Example shape to aim for:
// const student = {
//   name: "",
//   college: "",
//   branch: "",
//   year: "",
//   bio: "",
//   skills: [],
//   github: "",
//   linkedin: "",
//   instagram: ""
// };

/* ============================================================
   CollegeCard — create-profile.html logic
   Phase 2, Steps 5-8:
     5. JS fundamentals (variables, objects, functions)
     6. DOM selection and updates
     7. Events (form submit)
     8. Read + validate form input, build a student object,
        render it dynamically into the same markup profile.html uses
   No backend and no localStorage yet — that's Phase 3/4.
   ============================================================ */

// ---------- STEP 6: DOM selection ----------
const form          = document.querySelector('#profile-form');
const errorText      = document.querySelector('#form-error');
const previewSection = document.querySelector('#profile-preview');

const previewPhoto  = document.querySelector('#preview-photo');
const previewName    = document.querySelector('#preview-name');
const previewMeta      = document.querySelector('#preview-meta');
const previewBio        = document.querySelector('#preview-bio');
const previewSkills       = document.querySelector('#preview-skills');
const previewSocial        = document.querySelector('#preview-social');


// ---------- STEP 7: Events ----------
// preventDefault() stops the browser's default "reload the page"
// behaviour on submit — this is the line that makes the button
// actually do something instead of feeling dead.
form.addEventListener('submit', function (event) {
  event.preventDefault();

  const student = readFormData();

  const validationError = validateStudent(student);
  if (validationError) {
    showError(validationError);
    return;
  }

  clearError();
  renderProfile(student);
});


// ---------- STEP 8: Reading form input into one object ----------
function readFormData() {
  const name       = document.querySelector('#name').value.trim();
  const college     = document.querySelector('#college').value.trim();
  const branch       = document.querySelector('#branch').value.trim();
  const year           = document.querySelector('#year').value;
  const bio             = document.querySelector('#bio').value.trim();
  const skillsRaw         = document.querySelector('#skills').value.trim();
  const github              = document.querySelector('#github').value.trim();
  const linkedin              = document.querySelector('#linkedin').value.trim();
  const instagram                = document.querySelector('#instagram').value.trim();

  // "Python, JavaScript, Flask" -> ["Python", "JavaScript", "Flask"]
  const skills = skillsRaw
    .split(',')
    .map(function (skill) { return skill.trim(); })
    .filter(function (skill) { return skill.length > 0; });

  // One object holding the whole profile. This exact shape is what
  // you'll save to localStorage in Phase 3, and to SQLite in Phase 5.
  return {
    name: name,
    college: college,
    branch: branch,
    year: year,
    bio: bio,
    skills: skills,
    social: {
      github: github,
      linkedin: linkedin,
      instagram: instagram
    }
  };
}


// ---------- Validation ----------
function validateStudent(student) {
  if (student.name === '') {
    return 'Please enter your name.';
  }
  if (student.college === '') {
    return 'Please enter your college.';
  }
  return null;
}

function showError(message) {
  errorText.textContent = message;
}

function clearError() {
  errorText.textContent = '';
}


// ---------- Rendering into the .profile-card markup ----------
function renderProfile(student) {
  previewPhoto.textContent = getInitials(student.name);

  previewName.textContent = student.name;

  // "Branch · Year<br>College" — matches the two-line meta style
  // used in profile.html, skipping any parts left blank
  const line1 = [student.branch, student.year]
    .filter(function (part) { return part && part.length > 0; })
    .join(' · ');
  previewMeta.innerHTML = line1 + (student.college ? '<br>' + student.college : '');

  previewBio.textContent = student.bio;

  renderSkills(student.skills);
  renderSocialLinks(student.social);

  previewSection.classList.remove('hidden');
  previewSection.scrollIntoView({ behavior: 'smooth' });
}

function getInitials(fullName) {
  if (!fullName) return '?';
  const parts = fullName.split(' ').filter(Boolean);
  const first = parts[0] ? parts[0][0] : '';
  const last  = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function renderSkills(skills) {
  previewSkills.innerHTML = ''; // clear old tags on re-submit

  skills.forEach(function (skill) {
    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.textContent = skill;
    previewSkills.appendChild(tag);
  });
}

function renderSocialLinks(social) {
  previewSocial.innerHTML = '';

  const links = [
    ['GitHub', social.github],
    ['LinkedIn', social.linkedin],
    ['Instagram', social.instagram]
  ];

  links.forEach(function (pair) {
    const label = pair[0];
    const url = pair[1];
    if (!url) return; // skip fields the student left blank

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = label;
    previewSocial.appendChild(link);
  });
}
