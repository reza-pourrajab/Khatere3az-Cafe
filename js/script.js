"use strict";
// Select all navigation links in the header
const navLinks = document.querySelectorAll("#header-navbar .nav-link-header");
// Select all dropdown links in the header (for mobile or submenus)
const dropdownLinks = document.querySelectorAll(".dropdown-item-header");
// Select the header element
const header = document.querySelector("header");
// Select all sections on the page for scrollspy
const sections = document.querySelectorAll("section");
// Select the coffee modal element and initialize Bootstrap modal
const coffeeModalEl = document.getElementById("coffee-modal");
const coffeeModal = new bootstrap.Modal(coffeeModalEl, {
	keyboard: true, // allow closing with ESC
});
// Flag to prevent scrollspy from updating active links during programmatic scroll
let isScrollingByClick = false;

// -------------------------
// Show modal 4 seconds after page load
// -------------------------

window.addEventListener("load", () => {
	setTimeout(() => {
		coffeeModal.show();
	}, 4000);
});

// -------------------------
// Throttle function to limit the rate of executing scroll handler
// -------------------------
function throttle(func, limit) {
	let inThrottle;
	return function () {
		const args = arguments;
		const context = this;
		if (!inThrottle) {
			func.apply(context, args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
}

// -------------------------
// Manual scrollspy: update active nav link based on current section
// -------------------------
function handleScroll() {
	if (isScrollingByClick) return; // skip if scrolling triggered by link click

	let currentSectionId = "";
	sections.forEach((section) => {
		const sectionTop = section.offsetTop - header.offsetHeight;
		const sectionBottom = sectionTop + section.offsetHeight;

		if (
			window.pageYOffset >= sectionTop &&
			window.pageYOffset < sectionBottom
		) {
			currentSectionId = section.getAttribute("id");
		}
	});

	if (currentSectionId) {
		updateActiveLinks(currentSectionId);
	}
}

// -------------------------
// Update 'active' class on all nav and dropdown links
// -------------------------
function updateActiveLinks(currentSectionId) {
	const allLinks = [...navLinks, ...dropdownLinks];
	allLinks.forEach((link) => {
		link.classList.toggle(
			"active",
			link.getAttribute("href") === "#" + currentSectionId
		);
	});
}

// -------------------------
// Smooth scroll to a target section using a Promise
// -------------------------
function smoothScroll(target, extraOffset = 0) {
	return new Promise((resolve) => {
		const headerHeight = header.offsetHeight;
		const top =
			target.getBoundingClientRect().top +
			window.pageYOffset -
			headerHeight -
			extraOffset;
		// Trigger smooth scroll
		window.scrollTo({ top, behavior: "smooth" });
		// Check periodically if scroll reached the target
		const checkScroll = setInterval(() => {
			if (Math.abs(window.pageYOffset - top) < 2) {
				clearInterval(checkScroll);
				resolve();
			}
		}, 50);
	});
}

// -------------------------
// Handle click on a nav or dropdown link
// -------------------------
function handleLinkClick(link, extraOffset = 0) {
	link.addEventListener("click", async (e) => {
		e.preventDefault();
		isScrollingByClick = true; // prevent scrollspy interference

		// Remove active class from all links and add to clicked link
		const allLinks = [...navLinks, ...dropdownLinks];
		allLinks.forEach((l) => l.classList.remove("active"));
		link.classList.add("active");

		const href = link.getAttribute("href");
		const target = document.querySelector(href);

		// If link corresponds to a Bootstrap tab, trigger tab click
		const tabButton = document.querySelector(
			`button[data-bs-target='${href}']`
		);
		if (tabButton) tabButton.click();

		// ✅ If tab, use extra offset for pinned section
		if (tabButton && target) {
			const extraTabOffset = 55;
			await smoothScroll(target, extraTabOffset);
			isScrollingByClick = false;
			return;
		}

		// Smooth scroll to section normally
		if (target) await smoothScroll(target, extraOffset);

		isScrollingByClick = false;
	});
}

// Apply click handler to all nav and dropdown links
[...navLinks, ...dropdownLinks].forEach((link) => handleLinkClick(link));

// Attach scroll handler with throttle
window.addEventListener("scroll", throttle(handleScroll, 200));

// -------------------------
// Set initial active link based on current scroll position
// -------------------------
function setInitialActive() {
	let currentSectionId = "";
	sections.forEach((section) => {
		const sectionTop = section.offsetTop - header.offsetHeight;
		const sectionBottom = sectionTop + section.offsetHeight;

		if (
			window.pageYOffset >= sectionTop &&
			window.pageYOffset < sectionBottom
		) {
			currentSectionId = section.getAttribute("id");
		}
	});
	// Default to first section if none matched
	if (!currentSectionId && sections.length) {
		currentSectionId = sections[0].getAttribute("id");
	}

	if (currentSectionId) {
		updateActiveLinks(currentSectionId);
	}
}

window.addEventListener("DOMContentLoaded", setInitialActive);
