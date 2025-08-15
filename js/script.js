const navLinks = document.querySelectorAll("#header-navbar .nav-link-custom");
const header = document.querySelector("header");
const sections = document.querySelectorAll("section");
let isScrollingByClick = false;

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

// Scrollspy هنگام اسکرول
window.addEventListener("scroll", () => {
	if (isScrollingByClick) return; // اگه اسکرول توسط کلیک است، کاری نکن

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
});
