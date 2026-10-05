// Kindred Care - Shared Interactive Logic

document.addEventListener("DOMContentLoaded", () => {
    highlightActiveNav();
    initFAQ();
    initVaccineFilter();
    initBookingForm();
    initAuth();
});

// Highlight the active page in the top navigation bar
function highlightActiveNav() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";
    
    // Find all navigation links
    const navLinks = document.querySelectorAll("header nav a, nav nav a");
    
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (!href) return;
        
        const linkPage = href.substring(href.lastIndexOf("/") + 1);
        
        // Remove active styling classes and restore default styling classes
        link.className = "font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer active:scale-95";
        
        if (linkPage === pageName || (pageName === "index.html" && linkPage === "") || (pageName === "index.html" && linkPage === "#")) {
            // Apply active classes
            link.className = "font-label-md text-label-md text-primary border-b-2 border-primary pb-1 cursor-pointer active:scale-95";
        }
    });
}

// Interactive behavior for FAQ page (tips.html)
function initFAQ() {
    const detailsElements = document.querySelectorAll("details");
    detailsElements.forEach(details => {
        const summary = details.querySelector("summary");
        if (summary) {
            summary.addEventListener("click", () => {
                // Close other open accordion items
                detailsElements.forEach(otherDetails => {
                    if (otherDetails !== details && otherDetails.hasAttribute("open")) {
                        otherDetails.removeAttribute("open");
                    }
                });
            });
        }
    });
}

// Interactive filter and search on schedule page (schedule.html)
function initVaccineFilter() {
    const filterButtons = document.querySelectorAll(".scrollbar-hide button, button.whitespace-nowrap");
    const searchInput = document.querySelector('input[placeholder*="ابحث عن تطعيم"]');
    const ageGroups = document.querySelectorAll(".grid > div"); // Select age group cards

    if (!filterButtons.length && !searchInput) return;

    let activeFilter = "الكل";
    let searchQuery = "";

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => {
                b.className = "whitespace-nowrap px-4 py-2 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest font-label-md text-label-md transition-colors";
            });
            btn.className = "whitespace-nowrap px-4 py-2 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md";
            
            activeFilter = btn.textContent.trim();
            applyFilterAndSearch();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            applyFilterAndSearch();
        });
    }

    function applyFilterAndSearch() {
        ageGroups.forEach(group => {
            const heading = group.querySelector("h2");
            const headingText = heading ? heading.textContent.trim() : "";
            const vaccineCards = group.querySelectorAll(".space-y-4 > div, .grid > div");
            
            let matchesFilter = false;
            if (activeFilter === "الكل") {
                matchesFilter = true;
            } else if (activeFilter === "الولادة" && (headingText.includes("الولادة") || headingText.includes("عند الولادة"))) {
                matchesFilter = true;
            } else if (activeFilter === "شهرين - 6 أشهر" && headingText.includes("شهرين")) {
                matchesFilter = true;
            } else if (activeFilter === "سنة - سنتين" && headingText.includes("سنة")) {
                matchesFilter = true;
            } else if (activeFilter === "4 - 6 سنوات" && (headingText.includes("سنين") || headingText.includes("سنوات"))) {
                matchesFilter = true;
            }

            let groupHasVisibleVaccines = false;

            vaccineCards.forEach(card => {
                const title = card.querySelector("h3") ? card.querySelector("h3").textContent.toLowerCase() : "";
                const desc = card.querySelector("p") ? card.querySelector("p").textContent.toLowerCase() : "";
                
                const matchesSearch = title.includes(searchQuery) || desc.includes(searchQuery);

                if (matchesFilter && matchesSearch) {
                    card.style.display = "block";
                    groupHasVisibleVaccines = true;
                } else {
                    card.style.display = "none";
                }
            });

            if (matchesFilter && (groupHasVisibleVaccines || searchQuery === "")) {
                group.style.display = "block";
            } else {
                group.style.display = "none";
            }
        });
    }
}

// Booking form submission interaction in clinics page (clinics.html)
function initBookingForm() {
    const bookingForm = document.querySelector("form");
    if (!bookingForm) return;

    // Make sure it doesn't run if it's the login/signup form
    if (bookingForm.closest("main").querySelector("h1")?.textContent.includes("تسجيل") || 
        bookingForm.closest("main").querySelector("h1")?.textContent.includes("حساب")) {
        return;
    }

    const submitBtn = bookingForm.querySelector("button[type='button'], button[type='submit']");
    if (!submitBtn) return;

    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        const clinicSelect = bookingForm.querySelector("select:nth-of-type(1)");
        const visitTypeSelect = bookingForm.querySelector("select:nth-of-type(2)");
        const dateInput = bookingForm.querySelector("input[type='date']");
        const timeInput = bookingForm.querySelector("input[type='time']");
        const childNameInput = bookingForm.querySelector("input[placeholder*='اسم الطفل']");
        const phoneInput = bookingForm.querySelector("input[type='tel']");

        if (!dateInput.value || !timeInput.value || !childNameInput.value || !phoneInput.value) {
            alert("يرجى ملء جميع الحقول المطلوبة لإتمام الحجز.");
            return;
        }

        showBookingSuccessModal(childNameInput.value, clinicSelect.value, dateInput.value, timeInput.value);
        bookingForm.reset();
    });
}

function showBookingSuccessModal(childName, clinicName, date, time) {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-50 bg-on-background/40 backdrop-blur-sm flex items-center justify-center p-margin-mobile transition-all duration-300";
    
    const card = document.createElement("div");
    card.className = "bg-surface p-lg rounded-xl shadow-[0_8px_32px_rgba(42,115,232,0.15)] max-w-md w-full border border-outline-variant text-center relative animate-fade-in";
    card.innerHTML = `
        <div class="w-16 h-16 bg-secondary-container text-secondary rounded-full flex items-center justify-center mx-auto mb-md">
            <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">check_circle</span>
        </div>
        <h3 class="font-headline-md text-headline-md text-on-surface mb-2">تم استلام طلب الحجز بنجاح!</h3>
        <p class="font-body-md text-body-md text-on-surface-variant mb-6">
            تم تسجيل موعد للطفل <strong>${childName}</strong> في <strong>${clinicName}</strong> يوم <strong>${date}</strong> الساعة <strong>${time}</strong>.
            سوف نرسل لك رسالة نصية قصيرة (SMS) للتأكيد خلال 15 دقيقة.
        </p>
        <button class="bg-primary text-on-primary px-8 py-2 rounded-full font-label-md text-label-md hover:bg-primary-container transition-colors w-full cursor-pointer active:scale-95">موافق</button>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const closeBtn = card.querySelector("button");
    closeBtn.addEventListener("click", () => {
        overlay.classList.add("opacity-0");
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    });
}

// ----------------------------------------------------
// Authentication System Logic (Login / Signup)
// ----------------------------------------------------

function initAuth() {
    renderHeaderProfile();
    
    // Check if we are on the login page
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        initLoginPage(loginForm);
    }

    // Check if we are on the signup page
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        initSignupPage(signupForm);
    }
}

// Renders the correct profile image or login button on the top nav header
function renderHeaderProfile() {
    const profileContainer = document.getElementById("header-profile-section");
    if (!profileContainer) return;

    const sessionData = localStorage.getItem("userSession");
    
    if (sessionData) {
        // User is logged in
        const session = JSON.parse(sessionData);
        const avatarUrl = session.role === "admin" 
            ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCw8XWlnYYjG2Ecbr6zxiiuYcmo5UofmaKw_U9BhNPD4cyVTg6lqF7hRMLzJ5FyaojPS8l9eaJjKwZSpSsHYMVFMvLcniuDHuT_z7gX8amb9lzJewIiRAFlAVcXhj8Caso3ft0PBKqrDjsVvy1xZDWQKggxbkB5tb0WZ8pS_dhPUaF0suEt0r_UPcB-8qtFCwPKk-hmitKKlZicV4G2lzwLJPW3Jsnq7FPUedDjjgJeRkv1trDUfQkT" // Doctor avatar
            : "https://lh3.googleusercontent.com/aida-public/AB6AXuCSgr_HC5VN2_JVEvYlWav-myCI3agbO57dxdvSF68vB5mtBCLitCQls7dvbOeVJ93T1LaeY6zORX6SZ5qRKVJy-Cq6fKwBLF5WegA5DtTue8kF_NNAP6tqHSmGt2PcCG9b9JJ6WAGOGtideBy1IrvlSJN9iGbySvFvxrZMzGQs3uAvmxWqabZwBATSyZOuFf9Lb-xTuXWgMWvB8X2ypXPUdw8Pc5kfMWI0YsBU8mjJ1VP1xzNNeTtp"; // Parent avatar

        profileContainer.innerHTML = `
            <div class="relative flex items-center gap-4">
                <a href="clinics.html" class="hidden md:block bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded-full hover:bg-primary-container transition-colors duration-200 text-center">
                    Find a Clinic
                </a>
                <div class="relative">
                    <button id="profile-dropdown-btn" class="w-10 h-10 rounded-full overflow-hidden border border-outline-variant focus:outline-none cursor-pointer active:scale-95 transition-all">
                        <img alt="User Profile" class="w-full h-full object-cover" src="${avatarUrl}"/>
                    </button>
                    <!-- Dropdown Menu -->
                    <div id="profile-dropdown-menu" class="hidden absolute left-0 mt-2 w-48 bg-surface rounded-lg shadow-lg border border-outline-variant py-2 z-50 animate-fade-in">
                        <div class="px-4 py-2 border-b border-outline-variant/30 text-right">
                            <p class="font-label-sm text-label-sm text-on-surface font-semibold truncate">${session.name}</p>
                            <p class="font-body-sm text-[12px] text-on-surface-variant truncate">${session.role === "admin" ? "طبيب / إداري" : "ولي أمر"}</p>
                        </div>
                        ${session.role === "admin" ? `
                            <a href="schedule.html" class="block w-full text-right px-4 py-2 text-label-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">لوحة تحكم الإدارة</a>
                            <a href="clinics.html" class="block w-full text-right px-4 py-2 text-label-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">إدارة المواعيد</a>
                        ` : `
                            <a href="schedule.html" class="block w-full text-right px-4 py-2 text-label-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">جدول تطعيمات طفلي</a>
                            <a href="clinics.html" class="block w-full text-right px-4 py-2 text-label-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">مواعيدي المحجوزة</a>
                        `}
                        <button id="logout-btn" class="block w-full text-right px-4 py-2 text-label-sm text-error hover:bg-error-container/20 transition-colors border-t border-outline-variant/30 mt-2">تسجيل الخروج</button>
                    </div>
                </div>
            </div>
        `;

        // Toggle dropdown logic
        const dropdownBtn = document.getElementById("profile-dropdown-btn");
        const dropdownMenu = document.getElementById("profile-dropdown-menu");
        
        if (dropdownBtn && dropdownMenu) {
            dropdownBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle("hidden");
            });

            document.addEventListener("click", () => {
                dropdownMenu.classList.add("hidden");
            });
        }

        // Logout logic
        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                localStorage.removeItem("userSession");
                window.location.reload();
            });
        }
    } else {
        // User is not logged in, show Login link
        profileContainer.innerHTML = `
            <div class="flex items-center gap-4">
                <a href="clinics.html" class="hidden md:block bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded-full hover:bg-primary-container transition-colors duration-200 text-center">
                    Find a Clinic
                </a>
                <a href="login.html" class="bg-transparent border-2 border-primary text-primary font-label-md text-label-md px-6 py-1.5 rounded-full hover:bg-primary/5 transition-colors duration-200 text-center">
                    تسجيل الدخول
                </a>
            </div>
        `;
    }
}

// Logic for Login Page
function initLoginPage(form) {
    const parentTabBtn = document.getElementById("tab-parent");
    const staffTabBtn = document.getElementById("tab-staff");
    const loginSubmitBtn = document.getElementById("login-submit-btn");
    
    let activeRole = "parent"; // default

    if (parentTabBtn && staffTabBtn) {
        parentTabBtn.addEventListener("click", () => {
            activeRole = "parent";
            // Update active states
            parentTabBtn.className = "flex-1 py-3 text-center rounded-lg font-label-md text-label-md bg-primary text-on-primary shadow-sm transition-all";
            staffTabBtn.className = "flex-1 py-3 text-center rounded-lg font-label-md text-label-md bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all";
            // Change submit button primary colors
            loginSubmitBtn.className = "w-full py-3 bg-primary hover:bg-primary/90 text-on-primary font-label-md text-label-md rounded-full shadow-sm transition-colors text-center";
        });

        staffTabBtn.addEventListener("click", () => {
            activeRole = "admin";
            // Update active states
            staffTabBtn.className = "flex-1 py-3 text-center rounded-lg font-label-md text-label-md bg-secondary text-on-secondary shadow-sm transition-all";
            parentTabBtn.className = "flex-1 py-3 text-center rounded-lg font-label-md text-label-md bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all";
            // Change submit button secondary colors (Teal for Admin)
            loginSubmitBtn.className = "w-full py-3 bg-secondary hover:bg-secondary/90 text-on-secondary font-label-md text-label-md rounded-full shadow-sm transition-colors text-center";
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;

        if (!email || !password) {
            alert("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
            return;
        }

        // Simulate login
        const userName = activeRole === "admin" ? "د. أحمد كمال (طبيب)" : "مريم أحمد (ولي أمر)";
        const session = {
            role: activeRole,
            name: userName,
            email: email
        };

        localStorage.setItem("userSession", JSON.stringify(session));
        
        // Show success modal then redirect
        showAuthSuccessModal("تم تسجيل الدخول بنجاح!", `أهلاً بك مجدداً، ${userName}.`);
    });
}

// Logic for Signup Page
function initSignupPage(form) {
    const parentTabBtn = document.getElementById("tab-parent");
    const staffTabBtn = document.getElementById("tab-staff");
    const signupSubmitBtn = document.getElementById("signup-submit-btn");
    const licenseField = document.getElementById("admin-license-field");
    
    let activeRole = "parent"; // default

    if (parentTabBtn && staffTabBtn) {
        parentTabBtn.addEventListener("click", () => {
            activeRole = "parent";
            parentTabBtn.className = "flex-1 py-3 text-center rounded-lg font-label-md text-label-md bg-primary text-on-primary shadow-sm transition-all";
            staffTabBtn.className = "flex-1 py-3 text-center rounded-lg font-label-md text-label-md bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all";
            signupSubmitBtn.className = "w-full py-3 bg-primary hover:bg-primary/90 text-on-primary font-label-md text-label-md rounded-full shadow-sm transition-colors text-center";
            
            // Hide license field
            if (licenseField) {
                licenseField.classList.add("hidden");
                document.getElementById("signup-license").removeAttribute("required");
            }
        });

        staffTabBtn.addEventListener("click", () => {
            activeRole = "admin";
            staffTabBtn.className = "flex-1 py-3 text-center rounded-lg font-label-md text-label-md bg-secondary text-on-secondary shadow-sm transition-all";
            parentTabBtn.className = "flex-1 py-3 text-center rounded-lg font-label-md text-label-md bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all";
            signupSubmitBtn.className = "w-full py-3 bg-secondary hover:bg-secondary/90 text-on-secondary font-label-md text-label-md rounded-full shadow-sm transition-colors text-center";
            
            // Show license field
            if (licenseField) {
                licenseField.classList.remove("hidden");
                document.getElementById("signup-license").setAttribute("required", "required");
            }
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("signup-name").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const phone = document.getElementById("signup-phone").value.trim();
        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById("signup-confirm-password").value;
        
        if (password !== confirmPassword) {
            alert("كلمتا المرور غير متطابقتين.");
            return;
        }

        // Simulate creation
        const session = {
            role: activeRole,
            name: name,
            email: email,
            phone: phone
        };

        localStorage.setItem("userSession", JSON.stringify(session));
        
        showAuthSuccessModal("تم إنشاء الحساب بنجاح!", `أهلاً بك في عائلة كينديرد كير، ${name}.`);
    });
}

function showAuthSuccessModal(title, message) {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-50 bg-on-background/40 backdrop-blur-sm flex items-center justify-center p-margin-mobile transition-all duration-300";
    
    const card = document.createElement("div");
    card.className = "bg-surface p-lg rounded-xl shadow-[0_8px_32px_rgba(42,115,232,0.15)] max-w-md w-full border border-outline-variant text-center relative animate-fade-in";
    card.innerHTML = `
        <div class="w-16 h-16 bg-secondary-container text-secondary rounded-full flex items-center justify-center mx-auto mb-md">
            <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">check_circle</span>
        </div>
        <h3 class="font-headline-md text-headline-md text-on-surface mb-2">${title}</h3>
        <p class="font-body-md text-body-md text-on-surface-variant mb-6">${message}</p>
        <button class="bg-primary text-on-primary px-8 py-2 rounded-full font-label-md text-label-md hover:bg-primary-container transition-colors w-full cursor-pointer active:scale-95">الذهاب للرئيسية</button>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const closeBtn = card.querySelector("button");
    closeBtn.addEventListener("click", () => {
        overlay.classList.add("opacity-0");
        setTimeout(() => {
            document.body.removeChild(overlay);
            window.location.href = "index.html"; // Redirect to index page
        }, 300);
    });
}
