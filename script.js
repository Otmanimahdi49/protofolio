// script.js
/**
 * وظائف JavaScript لموقع شخصي تفاعلي
 * المهام:
 * 1. التنقل السلس بين الأقسام
 * 2. تفعيل القائمة الهلالية (هامبرغر) للشاشات الصغيرة
 * 3. التحقق من صحة نموذج الاتصال وعرض رسائل النجاح/الخطأ
 * 4. تأثير الظهور التدريجي للعناصر عند التمرير
 */

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializeSmoothScrolling();
    initializeMobileMenu();
    initializeContactForm();
    initializeScrollReveal();
});

/**
 * 1. التنقل السلس بين الأقسام
 * يستمع لنقرات روابط التنقل وينتقل للسواق المعني بسلاسة
 */
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // إغلاق القائمة الهلالية إذا كانت مفتوحة
                closeMobileMenu();
            }
        });
    });
}

/**
 * 2. إدارة القائمة الهلالية للشاشات الصغيرة
 * يفتح/يغلق القائمة عند النقر على زر الهامبرغر
 */
function initializeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            this.setAttribute('aria-expanded', 
                this.classList.contains('active').toString()
            );
        });
        
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // إغلاق القائمة عند تغيير حجم النافذة
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
    }
}

/**
 * إغلاق القائمة الهلالية
 */
function closeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
}

/**
 * 3. التحقق من صحة نموذج الاتصال
 * يتحقق من الحقول المطلوبة وعرض رسائل الخطأ/النجاح
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {
       
          contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        message: document.getElementById("message").value
    };

    try {
         const response = await fetch("https://script.google.com/macros/s/AKfycbxvwntSof9zub8rRcZMwEHgCFiEqw3b_dZMBm3tSn3ezyHqJ9SCCScBzgifGaSFUW0LkQ/exec", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const result = await response.text();

        showFormMessage("تم إرسال رسالتك بنجاح!", "success");
        contactForm.reset();

    } catch (error) {
        showFormMessage("حدث خطأ أثناء الإرسال، حاول لاحقاً.", "error");
    }
});

        
        // التحقق أثناء الكتابة
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

/**
 * التحقق من صحة جميع الحقول في النموذج
 */
function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const message = document.getElementById('message');
    
    let isValid = true;
    
    if (!validateField(name)) isValid = false;
    if (!validateField(email)) isValid = false;
    if (!validateField(phone)) isValid = false;
    if (!validateField(message)) isValid = false;
    
    return isValid;
}

/**
 * التحقق من صحة حقل فردي
 */
function validateField(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById(field.id + '-error');
    
    // مسح أي أخطاء سابقة
    clearFieldError(field);
    
    // التحقق من الحقول المطلوبة
    if (field.hasAttribute('required') && value === '') {
        showFieldError(field, 'هذا الحقل مطلوب');
        return false;
    }
    // التحقق من رقم الهاتف
    if (field.id === 'phone') {
       const moroccoPhone = /^(06|07)[0-9]{8}$/;  // يدعم أرقام المغرب 06 أو 07
       if (!moroccoPhone.test(value)) {
           showFieldError(field, 'يرجى إدخال رقم هاتف صحيح من 10 أرقام يبدأ بـ 06 أو 07');
           return false;
       }
    }

    // التحقق من صحة البريد الإلكتروني
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'يرجى إدخال بريد إلكتروني صحيح');
            return false;
        }
    }
    
    // التحقق من الحد الأدنى لطول الرسالة
    if (field.id === 'message' && value.length < 10) {
        showFieldError(field, 'الرسالة يجب أن تحتوي على الأقل على 10 أحرف');
        return false;
    }
    
    return true;
}

/**
 * عرض خطأ لحقل معين
 */
function showFieldError(field, message) {
    const errorElement = document.getElementById(field.id + '-error');
    field.style.borderColor = 'var(--accent)';
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * مسح رسالة الخطأ لحقل معين
 */
function clearFieldError(field) {
    const errorElement = document.getElementById(field.id + '-error');
    field.style.borderColor = '';
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

/**
 * مسح جميع رسائل الخطأ
 */
function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    const formInputs = document.querySelectorAll('.form-input, .form-textarea');
    
    errorMessages.forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
    
    formInputs.forEach(input => {
        input.style.borderColor = '';
    });
}

/**
 * عرض رسالة النموذج (نجاح/خطأ)
 */
function showFormMessage(message, type) {
    const formMessage = document.getElementById('form-message');
    
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';
        
        // إخفاء الرسالة تلقائياً بعد 5 ثوانٍ
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

/**
 * 4. تأثير الظهور التدريجي للعناصر عند التمرير
 * يستخدم IntersectionObserver لاكتشاف ظهور العناصر في viewport
 */
function initializeScrollReveal() {
    const revealElements = document.querySelectorAll('.project-card, .service-card, .blog-card');
    
    // التأكد من دعم IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        // Fallback: عرض جميع العناصر مباشرة
        revealElements.forEach(element => {
            element.classList.add('visible');
        });
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * تحسين أداء التمرير
 */
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(function() {
            scrollTimeout = null;
            // أي وظائف إضافية متعلقة بالتمرير
        }, 100);
    }
});

/**
 * تحسين إمكانية الوصول للتركيز
 */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});