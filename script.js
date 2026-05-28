(function () {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector("#site-nav");
  const year = document.querySelector("#year");
  const capacityOutput = document.querySelector("#capacity-output");
  const currentResidents = document.querySelector("#current-residents");
  const reservedBeds = document.querySelector("#reserved-beds");
  const careForm = document.querySelector("#care-form");
  const saveDraftButton = document.querySelector("#save-draft");
  const clearDraftButton = document.querySelector("#clear-draft");
  const printButton = document.querySelector("#print-summary");
  const summaryOutput = document.querySelector("#summary-output");
  const formStatus = document.querySelector("#form-status");
  const contactForm = document.querySelector("#contact-form");
  const contactStatus = document.querySelector("#contact-status");
  const draftKey = "bulsho-care-record-draft";

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        siteNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }, { passive: true });
  }

  document.querySelectorAll(".journey-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const panelId = tab.getAttribute("aria-controls");

      document.querySelectorAll(".journey-tab").forEach((item) => {
        item.classList.toggle("is-active", item === tab);
        item.setAttribute("aria-selected", String(item === tab));
      });

      document.querySelectorAll(".journey-panel").forEach((panel) => {
        const isActive = panel.id === panelId;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      });
    });
  });

  function updateCapacity() {
    if (!capacityOutput || !currentResidents || !reservedBeds) {
      return;
    }

    const residents = Math.max(0, Number(currentResidents.value || 0));
    const reserved = Math.max(0, Number(reservedBeds.value || 0));
    const available = Math.max(0, 150 - residents - reserved);
    const noun = available === 1 ? "bed" : "beds";
    capacityOutput.textContent = `${available} ${noun} available`;
  }

  [currentResidents, reservedBeds].forEach((input) => {
    if (input) {
      input.addEventListener("input", updateCapacity);
    }
  });
  updateCapacity();

  function getFormData(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function setFormData(form, data) {
    Object.entries(data).forEach(([name, value]) => {
      const field = form.elements.namedItem(name);
      if (field && "value" in field) {
        field.value = value;
      }
    });
  }

  function cleanValue(value) {
    return String(value || "").trim() || "Not recorded";
  }

  function renderSummary(data) {
    if (!summaryOutput) {
      return;
    }

    const rows = [
      ["Clinic number", data.clinicNumber],
      ["Patient", `${cleanValue(data.patientName)}; age ${cleanValue(data.age)}`],
      ["Referral", data.referralSource],
      ["Guardian/contact", `${cleanValue(data.guardian)}; ${cleanValue(data.phone)}`],
      ["Risk and bed", `${cleanValue(data.riskLevel)}; ${cleanValue(data.bed)}`],
      ["Presenting concern", data.presentingConcern],
      ["Medication plan", data.medicationPlan],
      ["Psychosocial plan", data.psychosocialPlan],
      ["Spiritual support", data.spiritualPlan],
      ["Progress notes", data.progressNotes],
      ["Discharge date", data.dischargeDate],
      ["Destination", data.destination],
      ["Follow-up", `${cleanValue(data.followUpDate)} with ${cleanValue(data.followUpStaff)}`],
      ["Safety plan", data.safetyPlan]
    ];

    const descriptionList = document.createElement("dl");
    rows.forEach(([label, value]) => {
      const term = document.createElement("dt");
      const detail = document.createElement("dd");
      term.textContent = label;
      detail.textContent = cleanValue(value);
      descriptionList.append(term, detail);
    });

    summaryOutput.replaceChildren(descriptionList);
  }

  function showStatus(message) {
    if (formStatus) {
      formStatus.textContent = message;
    }
  }

  if (careForm) {
    try {
      const savedDraft = JSON.parse(localStorage.getItem(draftKey) || "null");
      if (savedDraft) {
        setFormData(careForm, savedDraft);
        renderSummary(savedDraft);
        showStatus("Saved draft loaded from this browser.");
      }
    } catch (error) {
      localStorage.removeItem(draftKey);
    }

    careForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = getFormData(careForm);
      renderSummary(data);
      showStatus("Care summary prepared. Review before printing or filing.");
    });
  }

  if (saveDraftButton && careForm) {
    saveDraftButton.addEventListener("click", () => {
      const data = getFormData(careForm);
      localStorage.setItem(draftKey, JSON.stringify(data));
      renderSummary(data);
      showStatus("Draft saved locally in this browser.");
    });
  }

  if (clearDraftButton && careForm) {
    clearDraftButton.addEventListener("click", () => {
      careForm.reset();
      localStorage.removeItem(draftKey);
      if (summaryOutput) {
        summaryOutput.innerHTML = "<p>Complete the form and create a summary for admission, stay, discharge, and follow-up notes.</p>";
      }
      showStatus("Form cleared.");
    });
  }

  if (printButton) {
    printButton.addEventListener("click", () => window.print());
  }

  if (contactForm && contactStatus) {
    const requiredContactFields = [
      {
        field: contactForm.elements.namedItem("name"),
        message: "Please enter your name."
      },
      {
        field: contactForm.elements.namedItem("email"),
        message: "Please enter a valid email address.",
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      },
      {
        field: contactForm.elements.namedItem("message"),
        message: "Please include a short message."
      }
    ];

    function setContactStatus(message, type) {
      contactStatus.textContent = message;
      contactStatus.classList.remove("is-error", "is-success");
      if (type) {
        contactStatus.classList.add(`is-${type}`);
      }
    }

    function setFieldError(field, message) {
      field.setAttribute("aria-invalid", "true");
      const errorId = field.getAttribute("aria-describedby");
      const error = errorId ? document.getElementById(errorId) : null;
      if (error) {
        error.textContent = message;
      }
    }

    function clearFieldError(field) {
      field.removeAttribute("aria-invalid");
      const errorId = field.getAttribute("aria-describedby");
      const error = errorId ? document.getElementById(errorId) : null;
      if (error) {
        error.textContent = "";
      }
    }

    function validateContactForm() {
      let firstInvalidField = null;

      requiredContactFields.forEach(({ field, message, validate }) => {
        if (!field || !("value" in field)) {
          return;
        }

        const value = String(field.value || "").trim();
        const isValid = value && (!validate || validate(value));

        if (isValid) {
          clearFieldError(field);
        } else {
          setFieldError(field, message);
          firstInvalidField ||= field;
        }
      });

      if (firstInvalidField && "focus" in firstInvalidField) {
        firstInvalidField.focus();
      }

      return !firstInvalidField;
    }

    requiredContactFields.forEach(({ field }) => {
      if (field) {
        field.addEventListener("input", () => clearFieldError(field));
      }
    });

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!validateContactForm()) {
        setContactStatus("Please fix the highlighted fields before sending.", "error");
        return;
      }

      const endpoint = contactForm.getAttribute("action") || "";
      if (!endpoint || endpoint.includes("YOUR_FORM_ID")) {
        // Formspree setup: paste your real endpoint into the contact form action in index.html.
        setContactStatus("Formspree endpoint missing. Paste your endpoint into the form action in index.html.", "error");
        return;
      }

      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton ? submitButton.textContent : "";

      try {
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Sending...";
        }
        setContactStatus("Sending enquiry...", "success");

        const response = await fetch(endpoint, {
          method: "POST",
          body: new FormData(contactForm),
          headers: {
            "Accept": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Formspree rejected the submission.");
        }

        contactForm.reset();
        requiredContactFields.forEach(({ field }) => {
          if (field) {
            clearFieldError(field);
          }
        });
        setContactStatus("Thank you. Your enquiry has been sent.", "success");
      } catch (error) {
        setContactStatus("The enquiry could not be sent. Check the Formspree endpoint and try again.", "error");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  }
})();
