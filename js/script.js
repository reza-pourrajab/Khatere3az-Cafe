const navLinks = document.querySelectorAll("#header-navbar .nav-link-header");
const dropdownLinks = document.querySelectorAll(".dropdown-item-header");
const header = document.querySelector("header");
const sections = document.querySelectorAll("section");
let isScrollingByClick = false;

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
function handleScroll() {
	if (isScrollingByClick) return;

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
		navLinks.forEach((link) => {
			link.classList.toggle(
				"active",
				link.getAttribute("href") === "#" + currentSectionId
			);
		});
	}
}

// حل مشکل اسکرول از وسط سکشن
navLinks.forEach((link) => {
	link.addEventListener("click", function (e) {
		e.preventDefault();

		const targetId = this.getAttribute("href");
		const targetEl = document.querySelector(targetId);

		const headerHeight = header.offsetHeight;
		const paddingTop =
			parseInt(window.getComputedStyle(targetEl).paddingTop) || 0;

		const elementPosition =
			targetEl.getBoundingClientRect().top + window.pageYOffset;
		const offsetPosition = elementPosition - headerHeight - paddingTop;

		window.scrollTo({
			top: offsetPosition,
			behavior: "smooth",
		});
	});
});

// Add smooth scroll for dropdown menu links
dropdownLinks.forEach((link) => {
	link.addEventListener("click", function (e) {
		e.preventDefault();

		const targetId = this.getAttribute("href");
		const targetEl = document.querySelector(targetId);
		if (!targetEl) return;

		const headerHeight = header.offsetHeight;
		const paddingTop =
			parseInt(window.getComputedStyle(targetEl).paddingTop) || 0;

		const elementPosition =
			targetEl.getBoundingClientRect().top + window.pageYOffset;
		const offsetPosition = elementPosition - headerHeight - paddingTop;

		window.scrollTo({
			top: offsetPosition,
			behavior: "smooth",
		});
	});
});

// اضافه کردن کلاس اکتیو به لینک فعال

// JS Scrollspy دستی

// تابع scroll نرم با promise
function smoothScroll(target) {
	return new Promise((resolve) => {
		const headerHeight = header.offsetHeight;
		const top =
			target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

		window.scrollTo({ top, behavior: "smooth" });

		const checkScroll = setInterval(() => {
			if (Math.abs(window.pageYOffset - top) < 2) {
				clearInterval(checkScroll);
				resolve();
			}
		}, 50);
	});
}

// کلیک روی لینک‌ها
navLinks.forEach((link) => {
	link.addEventListener("click", async (e) => {
		e.preventDefault();
		isScrollingByClick = true;

		navLinks.forEach((l) => l.classList.remove("active"));
		link.classList.add("active");

		const target = document.querySelector(link.getAttribute("href"));
		await smoothScroll(target);

		isScrollingByClick = false;
	});
});

// Add active class logic for dropdown menu links
dropdownLinks.forEach((link) => {
	link.addEventListener("click", async (e) => {
		e.preventDefault();
		isScrollingByClick = true;

		// Remove active from all dropdown items
		dropdownLinks.forEach((l) => l.classList.remove("active"));
		link.classList.add("active");

		const href = link.getAttribute("href");
		// Generalized: if a tab button with data-bs-target equal to href exists, trigger it
		const tabButton = document.querySelector(
			`button[data-bs-target='${href}']`
		);
		if (tabButton) {
			tabButton.click();
			// Scroll to the tab content, adjusted for header height and extra offset
			const tabPane = document.querySelector(href);
			if (tabPane) {
				const headerHeight = header.offsetHeight;
				const extraOffset = 55; // px, adjust as needed
				const top =
					tabPane.getBoundingClientRect().top +
					window.pageYOffset -
					headerHeight -
					extraOffset;
				window.scrollTo({ top, behavior: "smooth" });
			}
			isScrollingByClick = false;
			return;
		}

		const target = document.querySelector(href);
		await smoothScroll(target);

		isScrollingByClick = false;
	});
});
window.addEventListener("scroll", throttle(handleScroll, 200));
