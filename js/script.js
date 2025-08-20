const navLinks = document.querySelectorAll("#header-navbar .nav-link-header");
const dropdownLinks = document.querySelectorAll(".dropdown-item-header");
const header = document.querySelector("header");
const sections = document.querySelectorAll("section");
let isScrollingByClick = false;

// Throttle برای scroll
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

// Scrollspy دستی
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
		updateActiveLinks(currentSectionId);
	}
}

// تابع برای به‌روزرسانی کلاس active روی همه لینک‌ها
function updateActiveLinks(currentSectionId) {
	const allLinks = [...navLinks, ...dropdownLinks];
	allLinks.forEach((link) => {
		link.classList.toggle(
			"active",
			link.getAttribute("href") === "#" + currentSectionId
		);
	});
}

// تابع scroll نرم با promise
function smoothScroll(target, extraOffset = 0) {
	return new Promise((resolve) => {
		const headerHeight = header.offsetHeight;
		const top =
			target.getBoundingClientRect().top +
			window.pageYOffset -
			headerHeight -
			extraOffset;

		window.scrollTo({ top, behavior: "smooth" });

		const checkScroll = setInterval(() => {
			if (Math.abs(window.pageYOffset - top) < 2) {
				clearInterval(checkScroll);
				resolve();
			}
		}, 50);
	});
}

// تابع عمومی کلیک روی هر لینک
function handleLinkClick(link, extraOffset = 0) {
	link.addEventListener("click", async (e) => {
		e.preventDefault();
		isScrollingByClick = true;

		// حذف active از همه لینک‌ها و اضافه کردن به لینک کلیک‌شده
		const allLinks = [...navLinks, ...dropdownLinks];
		allLinks.forEach((l) => l.classList.remove("active"));
		link.classList.add("active");

		const href = link.getAttribute("href");
		const target = document.querySelector(href);

		// اگر لینک مربوط به تب بوت‌استرپ بود
		const tabButton = document.querySelector(
			`button[data-bs-target='${href}']`
		);
		if (tabButton) tabButton.click();

		// ✅ اگر تب پین هست، offset اختصاصی 55px استفاده شود
		if (tabButton && target) {
			const extraTabOffset = 55;
			await smoothScroll(target, extraTabOffset);
			isScrollingByClick = false;
			return;
		}

		// scroll نرم با offset معمولی
		if (target) await smoothScroll(target, extraOffset);

		isScrollingByClick = false;
	});
}

// اعمال روی همه لینک‌ها
[...navLinks, ...dropdownLinks].forEach((link) => handleLinkClick(link));

// Scrollspy روی اسکرول
window.addEventListener("scroll", throttle(handleScroll, 200));

// تنظیم لینک فعال اولیه هنگام بارگذاری
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

	if (!currentSectionId && sections.length) {
		currentSectionId = sections[0].getAttribute("id");
	}

	if (currentSectionId) {
		updateActiveLinks(currentSectionId);
	}
}

window.addEventListener("DOMContentLoaded", setInitialActive);
