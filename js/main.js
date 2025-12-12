/* ===================================================================
 * Luther 1.0.0 - Main JS
 *
 * ------------------------------------------------------------------- */

(function(html) {

    "use strict";

    html.className = html.className.replace(/\bno-js\b/g, '') + ' js ';



   /* Animations
    * -------------------------------------------------- */
    const tl = anime.timeline( {
        easing: 'easeInOutCubic',
        duration: 800,
        autoplay: false
    })
    .add({
        targets: '#loader',
        opacity: 0,
        duration: 1000,
        begin: function(anim) {
            window.scrollTo(0, 0);
        }
    })
    .add({
        targets: '#preloader',
        opacity: 0,
        complete: function(anim) {
            document.querySelector("#preloader").style.visibility = "hidden";
            document.querySelector("#preloader").style.display = "none";
        }
    })
    .add({
        targets: '.s-header',
        translateY: [-100, 0],
        opacity: [0, 1]
    }, '-=200')
    .add({
        targets: [ '.s-intro .text-pretitle', '.s-intro .text-huge-title'],
        translateX: [100, 0],
        opacity: [0, 1],
        delay: anime.stagger(400)
    })
    .add({
        targets: '.circles span',
        keyframes: [
            {opacity: [0, .3]},
            {opacity: [.3, .1], delay: anime.stagger(100, {direction: 'reverse'})}
        ],
        delay: anime.stagger(100, {direction: 'reverse'})
    })
    .add({
        targets: '.intro-social li',
        translateX: [-50, 0],
        opacity: [0, 1],
        delay: anime.stagger(100, {direction: 'reverse'})
    })
    .add({
        targets: '.intro-scrolldown',
        translateY: [100, 0],
        opacity: [0, 1]
    }, '-=800');



   /* Preloader
    * -------------------------------------------------- */
    const ssPreloader = function() {

        const preloader = document.querySelector('#preloader');
        if (!preloader) return;
        
        window.addEventListener('load', function() {
            document.querySelector('html').classList.remove('ss-preload');
            document.querySelector('html').classList.add('ss-loaded');

            document.querySelectorAll('.ss-animated').forEach(function(item){
                item.classList.remove('ss-animated');
            });

            tl.play();
        });

        // force page scroll position to top at page refresh
        // window.addEventListener('beforeunload' , function () {
        //     // window.scrollTo(0, 0);
        // });

    }; // end ssPreloader


   /* Mobile Menu
    * ---------------------------------------------------- */ 
    const ssMobileMenu = function() {

        const toggleButton = document.querySelector('.mobile-menu-toggle');
        const mainNavWrap = document.querySelector('.main-nav-wrap');
        const siteBody = document.querySelector("body");

        if (!(toggleButton && mainNavWrap)) return;

        toggleButton.addEventListener('click', function(event) {
            event.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        mainNavWrap.querySelectorAll('.main-nav a').forEach(function(link) {
            link.addEventListener("click", function(event) {

                // at 800px and below
                if (window.matchMedia('(max-width: 800px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function() {

            // above 800px
            if (window.matchMedia('(min-width: 801px)').matches) {
                if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
                if (toggleButton.classList.contains("is-clicked")) toggleButton.classList.remove("is-clicked");
            }
        });

    }; // end ssMobileMenu


   /* Highlight active menu link on pagescroll
    * ------------------------------------------------------ */
    const ssScrollSpy = function() {

        const sections = document.querySelectorAll(".target-section");

        // Add an event listener listening for scroll
        window.addEventListener("scroll", navHighlight);

        function navHighlight() {
        
            // Get current scroll position
            let scrollY = window.pageYOffset;
        
            // Loop through sections to get height(including padding and border), 
            // top and ID values for each
            sections.forEach(function(current) {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute("id");
            
               /* If our current scroll position enters the space where current section 
                * on screen is, add .current class to parent element(li) of the thecorresponding 
                * navigation link, else remove it. To know which link is active, we use 
                * sectionId variable we are getting while looping through sections as 
                * an selector
                */
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.add("current");
                } else {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.remove("current");
                }
            });
        }

    }; // end ssScrollSpy


   /* Animate elements if in viewport
    * ------------------------------------------------------ */
    const ssViewAnimate = function() {

        const blocks = document.querySelectorAll("[data-animate-block]");

        window.addEventListener("scroll", viewportAnimation);

        function viewportAnimation() {

            let scrollY = window.pageYOffset;

            blocks.forEach(function(current) {

                const viewportHeight = window.innerHeight;
                const triggerTop = (current.offsetTop + (viewportHeight * .2)) - viewportHeight;
                const blockHeight = current.offsetHeight;
                const blockSpace = triggerTop + blockHeight;
                const inView = scrollY > triggerTop && scrollY <= blockSpace;
                const isAnimated = current.classList.contains("ss-animated");

                if (inView && (!isAnimated)) {
                    anime({
                        targets: current.querySelectorAll("[data-animate-el]"),
                        opacity: [0, 1],
                        translateY: [100, 0],
                        delay: anime.stagger(400, {start: 200}),
                        duration: 800,
                        easing: 'easeInOutCubic',
                        begin: function(anim) {
                            current.classList.add("ss-animated");
                        }
                    });
                }
            });
        }

    }; // end ssViewAnimate


   /* Render Experience
    * ------------------------------------------------------ */
    const ssRenderExperience = function() {
        
        if (typeof experienceData === 'undefined') return;

        const timelineContainer = document.querySelector('.about-timelines .column.lg-6.tab-12:first-child .timeline');
        
        if (!timelineContainer) return;

        // Clear existing content
        timelineContainer.innerHTML = '';

        // Render experience items
        experienceData.forEach(exp => {
            const block = `
                <div class="timeline__block">
                    <div class="timeline__bullet"></div>
                    <div class="timeline__header">
                        <h4 class="timeline__title">${exp.company}</h4>
                        <h5 class="timeline__meta">${exp.position}</h5>
                        <p class="timeline__timeframe">${exp.timeframe}</p>
                    </div>
                    <div class="timeline__desc">
                        <p>${exp.description}</p>
                    </div>
                </div>
            `;
            timelineContainer.insertAdjacentHTML('beforeend', block);
        });

    }; // end ssRenderExperience


   /* Render Education
    * ------------------------------------------------------ */
    const ssRenderEducation = function() {
        
        if (typeof educationData === 'undefined') return;

        const timelineContainer = document.querySelector('.about-timelines .column.lg-6.tab-12:last-child .timeline');
        
        if (!timelineContainer) return;

        // Clear existing content
        timelineContainer.innerHTML = '';

        // Render education items
        educationData.forEach(edu => {
            const timeframeHTML = edu.timeframe ? `<p class="timeline__timeframe">${edu.timeframe}</p>` : '';
            const block = `
                <div class="timeline__block">
                    <div class="timeline__bullet"></div>
                    <div class="timeline__header">
                        <h4 class="timeline__title">${edu.institution}</h4>
                        <h5 class="timeline__meta">${edu.degree}</h5>
                        ${timeframeHTML}
                    </div>
                    <div class="timeline__desc">
                        <p>${edu.description}</p>
                    </div>
                </div>
            `;
            timelineContainer.insertAdjacentHTML('beforeend', block);
        });

    }; // end ssRenderEducation


   /* Swiper
    * ------------------------------------------------------ */ 
    const ssSwiper = function() {

        const mySwiper = new Swiper('.swiper-container', {

            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                // when window width is > 400px
                401: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                // when window width is > 800px
                801: {
                    slidesPerView: 2,
                    spaceBetween: 32
                },
                // when window width is > 1200px
                1201: {
                    slidesPerView: 2,
                    spaceBetween: 80
                }
            }
         });

    }; // end ssSwiper


   /* Lightbox
    * ------------------------------------------------------ */
    const ssLightbox = function() {

        const folioLinks = document.querySelectorAll('.folio-list__item-link');
        const modals = [];

        folioLinks.forEach(function(link) {
            let modalbox = link.getAttribute('href');
            let instance = basicLightbox.create(
                document.querySelector(modalbox),
                {
                    onShow: function(instance) {
                        //detect Escape key press
                        document.addEventListener("keydown", function(event) {
                            event = event || window.event;
                            if (event.keyCode === 27) {
                                instance.close();
                            }
                        });
                    }
                }
            )
            modals.push(instance);
        });

        folioLinks.forEach(function(link, index) {
            link.addEventListener("click", function(event) {
                event.preventDefault();
                modals[index].show();
            });
        });

    };  // end ssLightbox


   /* Alert boxes
    * ------------------------------------------------------ */
    const ssAlertBoxes = function() {

        const boxes = document.querySelectorAll('.alert-box');
  
        boxes.forEach(function(box){

            box.addEventListener('click', function(event) {
                if (event.target.matches(".alert-box__close")) {
                    event.stopPropagation();
                    event.target.parentElement.classList.add("hideit");

                    setTimeout(function(){
                        box.style.display = "none";
                    }, 500)
                }    
            });

        })

    }; // end ssAlertBoxes


   /* Smoothscroll
    * ------------------------------------------------------ */
    const ssMoveTo = function(){

        const easeFunctions = {
            easeInQuad: function (t, b, c, d) {
                t /= d;
                return c * t * t + b;
            },
            easeOutQuad: function (t, b, c, d) {
                t /= d;
                return -c * t* (t - 2) + b;
            },
            easeInOutQuad: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            },
            easeInOutCubic: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            }
        }

        const triggers = document.querySelectorAll('.smoothscroll');
        
        const moveTo = new MoveTo({
            tolerance: 0,
            duration: 1200,
            easing: 'easeInOutCubic',
            container: window
        }, easeFunctions);

        triggers.forEach(function(trigger) {
            moveTo.registerTrigger(trigger);
        });

    }; // end ssMoveTo


   /* Render Projects
    * ------------------------------------------------------ */
    const ssRenderProjects = function() {
        
        if (typeof projectsData === 'undefined') return;

        const folioList = document.querySelector('.folio-list');
        const modalsContainer = document.querySelector('.works-portfolio');
        
        if (!folioList || !modalsContainer) return;

        // Clear existing content
        folioList.innerHTML = '';

        // Render project cards
        projectsData.forEach(project => {
            const projectCard = `
                <li class="folio-list__item column" data-animate-el>
                    <a class="folio-list__item-link" href="#${project.id}">
                        <div class="folio-list__item-pic">
                            <img src="${project.thumbnail}"
                                 srcset="${project.thumbnail} 1x, ${project.thumbnailRetina} 2x" alt="${project.title}">
                        </div>
                        
                        <div class="folio-list__item-text">
                            <div class="folio-list__item-cat">
                                ${project.category}
                            </div>
                            <div class="folio-list__item-title">
                                ${project.title}
                            </div>
                        </div>
                    </a>
                    <a class="folio-list__proj-link" href="#" title="project link">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    </a>
                </li>
            `;
            folioList.insertAdjacentHTML('beforeend', projectCard);

            // Render modal
            const tagsHTML = project.tags.map(tag => `<li>${tag}</li>`).join('');
            const linkHTML = project.link ? 
                `<a href="${project.link}" class="modal-popup__details" target="_blank">${project.linkText}</a>` : '';
            
            const modal = `
                <div id="${project.id}" hidden>
                    <div class="modal-popup">
                        <img class="imgCenter" src="${project.modalImage}" alt="${project.title}">
            
                        <div class="modal-popup__desc">
                            <h5>${project.title}</h5>
                            <p>${project.description}</p>
                            <ul class="modal-popup__cat">
                                ${tagsHTML}
                            </ul>
                        </div>
            
                        ${linkHTML}
                    </div>
                </div>
            `;
            modalsContainer.insertAdjacentHTML('beforeend', modal);
        });

    }; // end ssRenderProjects


   /* Render Testimonials
    * ------------------------------------------------------ */
    const ssRenderTestimonials = function() {
        
        if (typeof testimonialsData === 'undefined') return;

        const swiperWrapper = document.querySelector('.testimonial-slider .swiper-wrapper');
        
        if (!swiperWrapper) return;

        // Clear existing content
        swiperWrapper.innerHTML = '';

        // Render testimonials
        testimonialsData.forEach(testimonial => {
            const slide = `
                <div class="testimonial-slider__slide swiper-slide">
                    <div class="testimonial-slider__author">
                        <img src="${testimonial.avatar}" alt="Author image" class="testimonial-slider__avatar">
                        <cite class="testimonial-slider__cite">
                            <a href="${testimonial.linkedin}" target="_blank">
                            <strong>${testimonial.name}</strong>
                            <span>${testimonial.title}</span>
                            </a>
                        </cite>
                    </div>
                    <p>
                        ${testimonial.quote}
                    </p>
                </div>
            `;
            swiperWrapper.insertAdjacentHTML('beforeend', slide);
        });

    }; // end ssRenderTestimonials


   /* Initialize
    * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssMobileMenu();
        ssScrollSpy();
        ssViewAnimate();
        ssRenderExperience();
        ssRenderEducation();
        ssRenderProjects();
        ssRenderTestimonials();
        ssSwiper();
        ssLightbox();
        ssAlertBoxes();
        ssMoveTo();

    })();

})(document.documentElement);